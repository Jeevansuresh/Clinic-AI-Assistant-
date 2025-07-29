from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import pymysql
from twilio.twiml.messaging_response import MessagingResponse
from ollama_client import ask_mistral, classify_message
from rapidfuzz import process

app = Flask(__name__)
app.secret_key = 'your_secret_key_here_change_this'

DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'Skyno@1978',
    'database': 'clinic_db',
    'charset': 'utf8mb4',
    'cursorclass': pymysql.cursors.DictCursor
}

def get_db_connection():
    try:
        return pymysql.connect(**DB_CONFIG)
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def get_doctor_appointments(doctor_name):
    conn = get_db_connection()
    if not conn: return []
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT appointment_number, patient_name, issue, appointment_day, 
                       appointment_date, appointment_time, status 
                FROM appointments 
                WHERE doctor_name = %s 
                ORDER BY appointment_date, appointment_time
            """, (doctor_name,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching appointments: {e}")
        return []
    finally:
        conn.close()

def get_doctor_schedule(doctor_name):
    conn = get_db_connection()
    if not conn: return []
    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, day, date, time_slot, availability_status 
                FROM doctor_schedule 
                WHERE doctor_name = %s 
                ORDER BY date, time_slot
            """, (doctor_name,))
            return cursor.fetchall()
    except Exception as e:
        print(f"Error fetching schedule: {e}")
        return []
    finally:
        conn.close()

USERS = {
    'dr.ram': {'password': 'doctor123', 'full_name': 'Ram'},
    'dr.shyam': {'password': 'doctor123', 'full_name': 'Shyam'}
}

DOCTOR_NAMES = [u['full_name'].lower() for u in USERS.values()]

user_sessions = {}

def match_doctor_name(user_input):
    result = process.extractOne(user_input.lower(), DOCTOR_NAMES)
    if result:
        best_match, score, _ = result
        return best_match if score > 70 else None
    return None

@app.route("/webhook", methods=["POST"])
def bot():
    user_msg = request.values.get("Body", "").strip()
    phone_number = request.values.get("From")
    response = MessagingResponse()

    session_data = user_sessions.get(phone_number, {
        "step": "start",
        "mode": "",
        "patient_name": "",
        "doctor_name": "",
        "issue": "",
        "date": "",
        "available_slots": [],
        "time_slot": ""
    })

    print("📩 Incoming:", user_msg)
    print("📱 Session:", phone_number, session_data)

    if session_data["step"] == "start":
        category = classify_message(user_msg)

        if category == "booking_appointment":
            session_data["mode"] = "booking"
            session_data["step"] = "waiting_for_patient_name"
            user_sessions[phone_number] = session_data
            response.message("Sure! Let's get started.\nWhat is your full name?")
            return str(response)

        elif category == "general_query":
            reply = ask_mistral(user_msg)
            response.message(reply)
            return str(response)

        else:
            response.message("Sorry, I couldn't understand. Please try again.")
            return str(response)

    elif session_data["mode"] == "booking":
        if session_data["step"] == "waiting_for_patient_name":
            session_data["patient_name"] = user_msg
            session_data["step"] = "waiting_for_issue"
            user_sessions[phone_number] = session_data
            response.message("What issue are you facing?")
            return str(response)

        elif session_data["step"] == "waiting_for_issue":
            session_data["issue"] = user_msg
            session_data["step"] = "waiting_for_doctor"
            user_sessions[phone_number] = session_data
            response.message("Which doctor would you like to consult?")
            return str(response)

        elif session_data["step"] == "waiting_for_doctor":
            matched_name = match_doctor_name(user_msg)
            if not matched_name:
                response.message("Doctor not found. Please enter a valid name like 'Ram' or 'Shyam'")
            else:
                session_data["doctor_name"] = matched_name.capitalize()
                session_data["step"] = "waiting_for_date"
                user_sessions[phone_number] = session_data
                response.message("Please enter the appointment date (YYYY-MM-DD):")
            return str(response)

        elif session_data["step"] == "waiting_for_date":
            session_data["date"] = user_msg
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT time_slot FROM doctor_schedule 
                        WHERE doctor_name = %s AND date = %s AND availability_status = 'Available'
                    """, (session_data["doctor_name"], session_data["date"]))
                    results = cursor.fetchall()
            except Exception as e:
                print("DB error during slot fetch:", e)
                response.message("Database error. Please try again later.")
                return str(response)
            finally:
                conn.close()

            if not results:
                response.message("❌ No slots available on that date. Please try a different date:")
            else:
                session_data["available_slots"] = [row['time_slot'] for row in results]
                session_data["step"] = "waiting_for_time"
                slot_list = "\n".join(session_data["available_slots"])
                response.message(f"Available slots:\n{slot_list}\n\nPlease choose one:")
            user_sessions[phone_number] = session_data
            return str(response)

        elif session_data["step"] == "waiting_for_time":
            if user_msg not in session_data["available_slots"]:
                response.message("Invalid slot. Please pick from the list above.")
            else:
                session_data["time_slot"] = user_msg
                try:
                    conn = get_db_connection()
                    with conn.cursor() as cursor:
                        cursor.execute("""
                            INSERT INTO appointments (patient_name, doctor_name, issue, appointment_day, appointment_date, appointment_time, status)
                            VALUES (%s, %s, %s, DAYNAME(%s), %s, %s, 'Booked')
                        """, (
                            session_data["patient_name"], session_data["doctor_name"], session_data["issue"],
                            session_data["date"], session_data["date"], session_data["time_slot"]
                        ))
                        cursor.execute("""
                            UPDATE doctor_schedule
                            SET availability_status = 'Blocked'
                            WHERE doctor_name = %s AND date = %s AND time_slot = %s
                        """, (
                            session_data["doctor_name"], session_data["date"], session_data["time_slot"]
                        ))
                        conn.commit()
                except Exception as e:
                    print("DB error during booking:", e)
                    response.message("❌ Something went wrong. Please try again.")
                    return str(response)
                finally:
                    conn.close()

                response.message(
                    f"✅ Booking Confirmed!\n"
                    f"Name: {session_data['patient_name']}\n"
                    f"Doctor: {session_data['doctor_name']}\n"
                    f"Issue: {session_data['issue']}\n"
                    f"Date: {session_data['date']}\n"
                    f"Time: {session_data['time_slot']}"
                )
                user_sessions.pop(phone_number)
                return str(response)

    user_sessions[phone_number] = session_data
    return str(response)

@app.route("/", methods=["GET"])
def index():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == 'POST':
        username = request.form['username'].lower()
        password = request.form['password']
        if username in USERS and USERS[username]['password'] == password:
            session['username'] = username
            session['full_name'] = USERS[username]['full_name']
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid credentials. Please try again.', 'error')
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if 'username' not in session:
        return redirect(url_for('login'))
    doctor_name = session['full_name']
    appointments = get_doctor_appointments(doctor_name)
    return render_template("dashboard.html",
                           appointments=appointments,
                           doctor_name=doctor_name,
                           total_appointments=len(appointments),
                           booked_appointments=len([a for a in appointments if a['status'] == 'Booked']),
                           pending_appointments=len([a for a in appointments if a['status'] == 'Pending']))

@app.route("/schedule")
def schedule():
    if 'username' not in session:
        return redirect(url_for('login'))
    doctor_name = session['full_name']
    schedule = get_doctor_schedule(doctor_name)
    return render_template("schedule.html",
                           schedule=schedule,
                           doctor_name=doctor_name,
                           total_slots=len(schedule),
                           available_slots=len([s for s in schedule if s['availability_status'] == 'Available']),
                           blocked_slots=len([s for s in schedule if s['availability_status'] == 'Blocked']))

@app.route("/logout")
def logout():
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('login'))

@app.route("/api/appointments")
def api_appointments():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    doctor_name = session['full_name']
    return jsonify(get_doctor_appointments(doctor_name))

@app.route("/api/schedule")
def api_schedule():
    if 'username' not in session:
        return jsonify({'error': 'Unauthorized'}), 401
    doctor_name = session['full_name']
    return jsonify(get_doctor_schedule(doctor_name))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
