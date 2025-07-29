from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import pymysql
from twilio.twiml.messaging_response import MessagingResponse
from ollama_client import ask_mistral, classify_message
from rapidfuzz import process

app = Flask(__name__)
app.secret_key = 'your_secret_key_here_change_this'  # Keep this secure!

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

def match_doctor_name(user_input):
    result = process.extractOne(user_input.lower(), DOCTOR_NAMES)
    if result:
        best_match, score, _ = result
        return best_match if score > 70 else None
    return None

# Helper functions to get/save bot session from Flask session
def get_bot_session():
    bot_session = session.get('bot_session', None)
    if not bot_session:
        # Initialize a new booking session state
        bot_session = {
            "step": "start",
            "mode": "",
            "patient_name": "",
            "doctor_name": "",
            "issue": "",
            "date": "",
            "available_slots": [],
            "time_slot": ""
        }
        session['bot_session'] = bot_session
    return bot_session

def save_bot_session(bot_session):
    session['bot_session'] = bot_session
    session.modified = True
    print("Bot session updated:", bot_session)  # Debug log

@app.route("/webhook", methods=["POST"])
def bot():
    user_msg = request.values.get("Body", "").strip()
    phone_number = request.values.get("From")
    response = MessagingResponse()

    # Load bot session from Flask session
    bot_session = get_bot_session()
    print("📩 Incoming:", user_msg)
    print("📱 Session before:", bot_session)

    if bot_session["step"] == "start":
        category = classify_message(user_msg)

        if category == "booking_appointment":
            bot_session["mode"] = "booking"
            bot_session["step"] = "waiting_for_patient_name"
            save_bot_session(bot_session)
            response.message("Sure! Let's get started.\nWhat is your full name?")
            return str(response)

        elif category == "general_query":
            reply = ask_mistral(user_msg)
            response.message(reply)
            return str(response)

        else:
            response.message("Sorry, I couldn't understand. Please try again.")
            return str(response)

    elif bot_session["mode"] == "booking":
        if bot_session["step"] == "waiting_for_patient_name":
            bot_session["patient_name"] = user_msg
            bot_session["step"] = "waiting_for_issue"
            save_bot_session(bot_session)
            response.message("What issue are you facing?")
            return str(response)

        elif bot_session["step"] == "waiting_for_issue":
            bot_session["issue"] = user_msg
            bot_session["step"] = "waiting_for_doctor"
            save_bot_session(bot_session)
            response.message("Which doctor would you like to consult?")
            return str(response)

        elif bot_session["step"] == "waiting_for_doctor":
            matched_name = match_doctor_name(user_msg)
            if not matched_name:
                response.message("Doctor not found. Please enter a valid name like 'Ram' or 'Shyam'")
            else:
                bot_session["doctor_name"] = matched_name.capitalize()
                bot_session["step"] = "waiting_for_date"
                save_bot_session(bot_session)
                response.message("Please enter the appointment date (YYYY-MM-DD):")
            return str(response)

        elif bot_session["step"] == "waiting_for_date":
            bot_session["date"] = user_msg
            try:
                conn = get_db_connection()
                with conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT time_slot FROM doctor_schedule
                        WHERE doctor_name = %s AND date = %s AND availability_status = 'Available'
                    """, (bot_session["doctor_name"], bot_session["date"]))
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
                bot_session["available_slots"] = [row['time_slot'] for row in results]
                bot_session["step"] = "waiting_for_time"
                slot_list = "\n".join(bot_session["available_slots"])
                response.message(f"Available slots:\n{slot_list}\n\nPlease choose one:")
            save_bot_session(bot_session)
            return str(response)

        elif bot_session["step"] == "waiting_for_time":
            if user_msg not in bot_session["available_slots"]:
                response.message("Invalid slot. Please pick from the list above.")
            else:
                bot_session["time_slot"] = user_msg
                try:
                    conn = get_db_connection()
                    with conn.cursor() as cursor:
                        cursor.execute("""
                            INSERT INTO appointments (patient_name, doctor_name, issue, appointment_day, appointment_date, appointment_time, status)
                            VALUES (%s, %s, %s, DAYNAME(%s), %s, %s, 'Booked')
                        """, (
                            bot_session["patient_name"], bot_session["doctor_name"], bot_session["issue"],
                            bot_session["date"], bot_session["date"], bot_session["time_slot"]
                        ))
                        cursor.execute("""
                            UPDATE doctor_schedule
                            SET availability_status = 'Blocked'
                            WHERE doctor_name = %s AND date = %s AND time_slot = %s
                        """, (
                            bot_session["doctor_name"], bot_session["date"], bot_session["time_slot"]
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
                    f"Name: {bot_session['patient_name']}\n"
                    f"Doctor: {bot_session['doctor_name']}\n"
                    f"Issue: {bot_session['issue']}\n"
                    f"Date: {bot_session['date']}\n"
                    f"Time: {bot_session['time_slot']}"
                )
                # Clear bot session after successful booking
                session.pop('bot_session', None)
                return str(response)

    # Save session if no response sent
    save_bot_session(bot_session)
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
