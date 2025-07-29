from flask import Flask, request
from twilio.twiml.messaging_response import MessagingResponse
from ollama_client import ask_mistral, classify_message
import mysql.connector
app = Flask(__name__)

@app.route("/", methods=["POST"])
def bot():
    user_msg = request.values.get("Body", "").strip()
    response = MessagingResponse()
    session = user_sessions.get(phone_number, {
        "step": "start",
        "patient_name": "",
        "doctor_name": "",
        "issue": "",
        "date": "",
        "time_slot": ""
    })
    category = classify_message(user_msg)

    if category == "booking_appointment":
        if session["step"] == "start":
            response.message("Please enter your full name:")
            session["step"] = "waiting_for_patient_name"

        elif session["step"] == "waiting_for_patient_name":
            session["patient_name"] = user_msg
            response.message("Which doctor would you like to book with?")
            session["step"] = "waiting_for_doctor"

        elif session["step"] == "waiting_for_doctor":
            session["doctor_name"] = user_msg
            response.message("Please describe your issue:")
            session["step"] = "waiting_for_issue"

        elif session["step"] == "waiting_for_issue":
            session["issue"] = user_msg
            response.message("Please enter the date (YYYY-MM-DD):")
            session["step"] = "waiting_for_date"

        elif session["step"] == "waiting_for_date":
            session["date"] = user_msg
            db = mysql.connector.connect(host="localhost", user="root", password="", database="your_db")
            cursor = db.cursor()
            cursor.execute("""
                SELECT time_slot FROM doctor_schedule 
                WHERE doctor_name = %s AND date = %s AND availability_status = 'Available'
            """, (session["doctor_name"], session["date"]))
            results = cursor.fetchall()
            db.close()

            if not results:
                response.message("❌ No available slots on that date. Please enter another date:")
            else:
                session["available_slots"] = [row[0] for row in results]
                slot_list = "\n".join(session["available_slots"])
                response.message(f"Available slots:\n{slot_list}\n\nPlease choose one:")
                session["step"] = "waiting_for_time"

        elif session["step"] == "waiting_for_time":
            if user_msg not in session["available_slots"]:
                response.message("Invalid slot. Please choose one from the list:")
            else:
                session["time_slot"] = user_msg
                response.message(f"✅ Booking confirmed!\nName: {session['patient_name']}\nDoctor: {session['doctor_name']}\nIssue: {session['issue']}\nDate: {session['date']}\nTime: {session['time_slot']}")
                
                # Insert into appointments + update doctor_schedule
                db = mysql.connector.connect(host="localhost", user="root", password="", database="your_db")
                cursor = db.cursor()
                cursor.execute("""
                    INSERT INTO appointments (patient_name, doctor_name, issue, appointment_day, appointment_date, appointment_time, status)
                    VALUES (%s, %s, %s, DAYNAME(%s), %s, %s, 'Booked')
                """, (session["patient_name"], session["doctor_name"], session["issue"], session["date"], session["date"], session["time_slot"]))

                cursor.execute("""
                    UPDATE doctor_schedule
                    SET availability_status = 'Blocked'
                    WHERE doctor_name = %s AND date = %s AND time_slot = %s
                """, (session["doctor_name"], session["date"], session["time_slot"]))
                db.commit()
                db.close()

                user_sessions.pop(phone_number)







        response.message("Sure! Booking appointment.")
    elif category == "general_query":
        reply = ask_mistral(user_msg)
        response.message(reply)
    else:
        response.message("Sorry, I didn't understand. Please try again.")
    
    return str(response)

if __name__ == "__main__":
    app.run(debug=True)
