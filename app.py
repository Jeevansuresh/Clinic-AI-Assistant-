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

    # Get existing session or create a new one
    session = user_sessions.get(phone_number, {
        "step": "start",                # to track progress
        "mode": "",                     # will be 'booking' or 'query'
        "patient_name": "",
        "doctor_name": "",
        "issue": "",
        "date": "",
        "available_slots": [],
        "time_slot": ""
    })

    # ✅ STEP 1: Fresh message — classify only once
    if session["step"] == "start":
        category = classify_message(user_msg)

        if category == "booking_appointment":
            session["mode"] = "booking"
            session["step"] = "waiting_for_patient_name"
            response.message("Sure! Let's get started.\nWhat is your full name?")
        
        elif category == "general_query":
            reply = ask_mistral(user_msg)
            response.message(reply)
            return str(response)

        else:
            response.message("Sorry, I couldn't understand. Please try again.")
            return str(response)

    # ✅ STEP 2: Booking flow (only if mode is booking)
    elif session["mode"] == "booking":

        if session["step"] == "waiting_for_patient_name":
            session["patient_name"] = user_msg
            session["step"] = "waiting_for_issue"
            response.message("What issue are you facing?")

        elif session["step"] == "waiting_for_issue":
            session["issue"] = user_msg
            session["step"] = "waiting_for_doctor"
            response.message("Which doctor would you like to consult?")

        elif session["step"] == "waiting_for_doctor":
            session["doctor_name"] = user_msg
            session["step"] = "waiting_for_date"
            response.message("Please enter the appointment date (YYYY-MM-DD):")

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
                response.message("Database error. Please try again later.")
                return str(response)

            if not results:
                response.message("❌ No slots available on that date. Please try a different date:")
            else:
                session["available_slots"] = [row[0] for row in results]
                slots_str = "\n".join(session["available_slots"])
                session["step"] = "waiting_for_time"
                response.message(f"Available slots:\n{slots_str}\n\nPlease choose one:")

        elif session["step"] == "waiting_for_time":
            if user_msg not in session["available_slots"]:
                response.message("Invalid time slot. Please choose one from the list.")
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
                        session["patient_name"], session["doctor_name"], session["issue"],
                        session["date"], session["date"], session["time_slot"]
                    ))

                    # Block slot
                    cursor.execute("""
                        UPDATE doctor_schedule
                        SET availability_status = 'Blocked'
                        WHERE doctor_name = %s AND date = %s AND time_slot = %s
                    """, (session["doctor_name"], session["date"], session["time_slot"]))

                    db.commit()
                    db.close()

                    response.message(
                        f"✅ Booking Confirmed!\n"
                        f"Name: {session['patient_name']}\n"
                        f"Doctor: {session['doctor_name']}\n"
                        f"Issue: {session['issue']}\n"
                        f"Date: {session['date']}\n"
                        f"Time: {session['time_slot']}"
                    )

                    user_sessions.pop(phone_number)

                except Exception as e:
                    response.message("❌ Something went wrong. Please try again.")
                    return str(response)

    # ✅ Save updated session
    user_sessions[phone_number] = session
    return str(response)
