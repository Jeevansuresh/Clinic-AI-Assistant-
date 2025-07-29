🏥 ClinicAI
India’s WhatsApp-Powered Receptionist for Clinics
"Missed calls shouldn’t mean missed care."

🚨 The Problem No One Talks About
India has 70,000+ private clinics — most of them don’t have any software infrastructure.
No management system. No automation. No AI. Just a phone and paper.

And it’s not just clinics.
Most small businesses, SMBs, MSMEs in India — the ones that power the local economy — are still undigitized.
They rely on human memory, handwritten notes, and missed calls.

That’s a recipe for:

Missed appointments

Forgotten follow-ups

Misplaced reports

Lost patients

And eventually, lost income

I Talked to 40 Clinics Myself 💬
We didn’t just build this in a bubble. I personally spoke to 40+ clinics in Besant Nagar and Adyar alone.
Most of them told me the same thing:

“We don’t have time to learn new tools.”
“We don’t need a big software, just something simple.”
“WhatsApp works for us — we just wish it could do more.”

ClinicAI is the answer.
It doesn’t change what they use — it makes what they already use smarter.

💡 What’s ClinicAI?
ClinicAI is a plug-and-play AI assistant that runs on WhatsApp.
✅ No app install
✅ No hardware needed
✅ No training required

It’s like a virtual receptionist that:

Books appointments

Sends reminders

Answers common patient questions

Follows up with recovery tips

And keeps everything secure + organized

✨ Features That Just Work
👩‍⚕️ For Patients (on WhatsApp):
📅 Book, reschedule, or cancel appointments
⏰ Automated medicine reminders
❓ Ask questions: "fees?", "timings?", "report?"
📤 Upload prescriptions or test reports
💬 Get recovery tips from the AI
🌐 Local language support (Tamil, Hindi, English)

🏥 For Clinics:
🧠 Auto-replies to patients 24/7
🔔 Instant alerts when someone books or uploads
🧾 File storage — no more lost reports
🤖 Sends helpful post-visit tips
🏷️ Verified WhatsApp presence builds trust

👨‍⚕️ For Doctors (Web Dashboard):
📊 See today’s and weekly appointments
🗓️ Easy calendar view
📁 View uploaded prescriptions + patient history
🔍 AI Insights:
• Common symptoms
• Missed follow-ups
• Frequently prescribed meds
🔐 Secure login
🧬 Built-in file viewer

🧠 Why This Works — Psychologically and Practically
🕰️ Most clinics can’t afford a full-time receptionist
📵 Many patients won’t install yet another app
👴 Even elderly patients are already using WhatsApp
🤖 AI that replies like a human — follows up, remembers, and helps

🛠 Tech Stack – Built for Scale
Layer	Tools Used
🧠 AI & NLP	Ollama Mistral (for insights + tips)
📲 WhatsApp Bot	Twilio WhatsApp Business API
⚙️ Backend	Flask (Python)
🗃️ Database	MySQL (appointments, reports, patients)
📈 Dashboard UI	HTML, Tailwind CSS, JavaScript
🔐 Security	JWT Auth + Role-based Access

🏆 Why ClinicAI Wins
✅ Real need – 40+ clinics showed direct interest just in two neighborhoods
✅ No friction – Just WhatsApp, nothing new to learn
✅ Proven model – Works with what clinics already use
✅ AI-powered – Adds follow-up, memory, and personalization
✅ Massively scalable – Works for 1 clinic or 10,000
✅ Low-cost, high-impact – No big infra required


Clinic WhatsApp AI Assistant isn’t just a project — it’s a leap forward for grassroots healthcare in India.

**Sample Database**

# 🏥 Clinic AI Assistant – Sample Database Setup

This sample database sets up the core backend for the **ClinicAI**, including doctor schedules and patient appointments. Follow these steps to set up the database in MySQL.

---

## ✅ Step 1: Create the Database

```sql
CREATE DATABASE IF NOT EXISTS clinic_db;
```

---

## ✅ Step 2: Use the Database

```sql
USE clinic_db;
```

---

## ✅ Step 3: Drop Existing Tables (for Clean Setup)

```sql
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS doctor_schedule;
```

---

## ✅ Step 4: Create `doctor_schedule` Table

Stores doctor availability for specific days, dates, and time slots.

```sql
CREATE TABLE doctor_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    day VARCHAR(10) NOT NULL,         -- Example: Monday, Tuesday
    date DATE NOT NULL,               -- Specific date
    time_slot TIME NOT NULL,          -- Example: 09:00:00
    availability_status VARCHAR(20)   -- Available / Blocked / Not Available
);
```

---

## ✅ Step 5: Create `appointments` Table

Stores all appointment details booked through the WhatsApp AI Assistant.

```sql
CREATE TABLE appointments (
    appointment_number INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    issue VARCHAR(255),
    appointment_day VARCHAR(10),
    appointment_date DATE,
    appointment_time TIME,
    status VARCHAR(20)                -- Booked / Cancelled / Completed
);
```

---

## ✅ Step 6: Insert Sample Data into `doctor_schedule`

Includes working hours, blocked slots, and unavailable days for **Dr. Ram** and **Dr. Shyam**.

```sql
INSERT INTO doctor_schedule (doctor_name, day, date, time_slot, availability_status)
VALUES
('Dr. Ram', 'Sunday', '2025-08-03', '09:00:00', 'Available'),
('Dr. Ram', 'Sunday', '2025-08-03', '10:00:00', 'Blocked'),
('Dr. Ram', 'Sunday', '2025-08-03', '11:00:00', 'Available'),
('Dr. Shyam', 'Monday', '2025-08-04', '09:00:00', 'Available'),
('Dr. Shyam', 'Monday', '2025-08-04', '10:00:00', 'Blocked'),
('Dr. Shyam', 'Monday', '2025-08-04', '11:00:00', 'Not Available'),
('Dr. Ram', 'Tuesday', '2025-08-05', '09:00:00', 'Blocked'),
('Dr. Ram', 'Tuesday', '2025-08-05', '10:00:00', 'Available'),
('Dr. Ram', 'Tuesday', '2025-08-05', '11:00:00', 'Available');
```

---

## ✅ Step 7: Insert Sample Data into `appointments`

This reflects booked appointments through the AI assistant.

```sql
INSERT INTO appointments (patient_name, doctor_name, issue, appointment_day, appointment_date, appointment_time, status)
VALUES
('Aarav Patel', 'Dr. Ram', 'Headache', 'Sunday', '2025-08-03', '09:00:00', 'Booked'),
('Meera Iyer', 'Dr. Shyam', 'Fever', 'Monday', '2025-08-04', '09:00:00', 'Booked');
```

---

**Images**
![WhatsApp Image 2025-07-29 at 16 24 12_76871077](https://github.com/user-attachments/assets/a0ceaf51-3e00-4a53-93d8-dc5c60390d30)
![WhatsApp Image 2025-07-29 at 16 24 12_1177f4a4](https://github.com/user-attachments/assets/d590a808-79d0-417f-870e-b1a9f7b8e450)
![WhatsApp Image 2025-07-29 at 16 24 12_1f45a46c](https://github.com/user-attachments/assets/46068c09-65d9-419c-91e0-5578d1c2478b)
![WhatsApp Image 2025-07-29 at 16 24 13_620aa61f](https://github.com/user-attachments/assets/161971af-b552-4782-aa55-613061f3e6b0)
![WhatsApp Image 2025-07-29 at 16 24 13_a4321fcc](https://github.com/user-attachments/assets/aad032ef-d5fe-4cd7-8c68-e8e84328c675)






