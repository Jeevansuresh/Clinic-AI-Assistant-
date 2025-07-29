

from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from ollama_client import ask_mistral, classify_message
import mysql.connector

app = Flask(__name__)
user_sessions = {}

@app.route("/", methods=["POST"])
def bot():
    user_msg = request.values.get("Body", "").strip()
    phone_number = request.values.get("From")
    response = MessagingResponse()

    # Get or create session
    session = user_sessions.get(phone_number, {
        "step": "start",
        "patient_name": "",
        "doctor_name": "",
        "issue": "",
        "date": "",
        "available_slots": [],
        "time_slot": ""
    })

    # Step-by-step booking flow
    if session["step"] == "waiting_for_patient_name":
        session["patient_name"] = user_msg
        response.message("What is the issue you're facing?")
        session["step"] = "waiting_for_issue"

    elif session["step"] == "waiting_for_issue":
        session["issue"] = user_msg
        response.message("Which doctor would you like to consult?")
        session["step"] = "waiting_for_doctor"

    elif session["step"] == "waiting_for_doctor":
        session["doctor_name"] = user_msg
        response.message("Please enter the appointment date (YYYY-MM-DD):")
        session["step"] = "waiting_for_date"

    elif session["step"] == "waiting_for_date":
        session["date"] = user_msg

        try:
            db = mysql.connector.connect(host="localhost", user="root", password="", database="your_db")
            cursor = db.cursor()
            cursor.execute("""
                SELECT time_slot FROM doctor_schedule 
                WHERE doctor_name = %s AND date = %s AND availability_status = 'Available'
            """, (session["doctor_name"], session["date"]))
            results = cursor.fetchall()
            db.close()
        except Exception as e:
            response.message("Database error occurred. Please try again later.")
            return str(response)

        if not results:
            response.message("❌ No available slots on that date. Please enter another date:")
        else:
            session["available_slots"] = [row[0] for row in results]
            slot_list = "\n".join(session["available_slots"])
            response.message(f"Available slots:\n{slot_list}\n\nPlease type your preferred time slot:")
            session["step"] = "waiting_for_time"

    elif session["step"] == "waiting_for_time":
        if user_msg not in session["available_slots"]:
            slot_list = "\n".join(session["available_slots"])
            response.message(f"❌ Invalid slot. Please choose one of the available options:\n{slot_list}")
        else:
            session["time_slot"] = user_msg

            try:
                db = mysql.connector.connect(host="localhost", user="root", password="", database="your_db")
                cursor = db.cursor()

                # Insert into appointments
                cursor.execute("""
                    INSERT INTO appointments (patient_name, doctor_name, issue, appointment_day, appointment_date, appointment_time, status)
                    VALUES (%s, %s, %s, DAYNAME(%s), %s, %s, 'Booked')
                """, (
                    session["patient_name"],
                    session["doctor_name"],
                    session["issue"],
                    session["date"],
                    session["date"],
                    session["time_slot"]
                ))

                # Update doctor schedule
                cursor.execute("""
                    UPDATE doctor_schedule
                    SET availability_status = 'Blocked'
                    WHERE doctor_name = %s AND date = %s AND time_slot = %s
                """, (session["doctor_name"], session["date"], session["time_slot"]))

                db.commit()
                db.close()

                # Confirmation message
                response.message(
                    f"✅ Appointment booked!\n"
                    f"Name: {session['patient_name']}\n"
                    f"Doctor: {session['doctor_name']}\n"
                    f"Issue: {session['issue']}\n"
                    f"Date: {session['date']}\n"
                    f"Time: {session['time_slot']}"
                )

                # Clear session
                user_sessions.pop(phone_number)

            except Exception as e:
                response.message("❌ Failed to save appointment. Please try again.")
                return str(response)

    # Start of conversation
    elif session["step"] == "start":
        category = classify_message(user_msg)

        if category == "booking_appointment":
            response.message("Sure! Let's book an appointment. Please enter your full name:")
            session["step"] = "waiting_for_patient_name"
        elif category == "general_query":
            reply = ask_mistral(user_msg)
            response.message(reply)
        else:
            response.message("Sorry, I didn't understand. Please rephrase.")

    # Save session
    user_sessions[phone_number] = session
    return str(response)

if __name__ == "__main__":
    app.run(debug=True)



