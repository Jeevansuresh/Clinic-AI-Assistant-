# 🏥 ClinicAI – India’s WhatsApp-Powered Receptionist for Clinics  
**_"Missed calls shouldn’t mean missed care."_**

---

## 🚨 The Problem No One Talks About

India has 70,000+ private clinics — most lack digital infrastructure:

- 📞 Missed calls are the first contact  
- 🗂️ Paper records vanish  
- ⏳ Follow-ups rely on memory  
- 🚫 No receptionist after hours  

> Not just clinics — **most SMBs and MSMEs in India are undigitized.**  
They lose **money, patients, and time** every single day.

Apps like **Practo**?  
❌ Too complex  
❌ Need downloads  
❌ Not AI-driven  

**Everyone already uses WhatsApp — so let’s make WhatsApp smarter.**

---

## 💬 I Asked 40+ Clinics Myself

We didn’t assume the problem — we asked.  
I personally contacted **40+ clinics in Besant Nagar and Adyar**. (Data available in excel sheet)

And here’s what they told me:

> “We don’t have time to learn new systems.”
> "It's very interesting, There are no AI based apps for this""
> “We don’t want to pay for big hospital software.”  
> “If it works on WhatsApp, we’re in.”

They were very interested to try it out
That’s what **ClinicAI** is.

---

## 💡 What’s ClinicAI?

**ClinicAI** is a **virtual receptionist** that works 100% on **WhatsApp**.  
No apps. No training. No hardware.

✅ Book and manage appointments  
✅ Automated reminders  
✅ Handles FAQs and queries  
✅ Accepts reports and prescriptions  
✅ Sends AI-powered recovery tips  
✅ Secure data for doctor access  

🛠️ Plug-and-play, 24/7, multi-language support.

---

## 👩‍⚕️ For Patients (on WhatsApp)

- 📅 Book / reschedule / cancel appointments  
- ⏰ Get automated medicine reminders  
- ❓ Ask questions like: “fees?”, “timings?”, “report?”  
- 📤 Upload prescriptions / test reports  
- 💬 Receive recovery tips based on your condition  
- 🌐 Available in **English**, **Tamil**, **Hindi**

---

## 🏥 For Clinics

- 🧠 AI replies 24/7 – even after-hours  
- 🔔 Real-time alerts for bookings/uploads  
- 🧾 Organized medical record storage  
- 🤖 Auto follow-up messages and reminders  
- 🏷️ Verified, branded WhatsApp for trust

---

## 👨‍⚕️ For Doctors (Dashboard)

- 📊 Track appointments live  
- 🗓️ Weekly view of the schedule  
- 📁 Access prescriptions and patient history  
- 🔍 AI-powered insights:
  - Common symptoms  
  - Missed follow-ups  
  - Frequently prescribed meds  
- 🔐 Role-based login  
- 🧬 Built-in file/document viewer

---

## 🧠 Why This Works

- 🕰️ Clinics don’t always have a receptionist  
- 📵 Most patients won’t install an app  
- 👵 Even senior citizens can just say “Hi Doctor”  
- 🤖 AI adds memory, care, and follow-up — without feeling robotic  

---

## 🛠️ Tech Stack – Production-Ready

| Layer         | Tools Used                                |
|---------------|--------------------------------------------|
| 🧠 AI & NLP     | Ollama Mistral (for insights + tips)       |
| 📲 WhatsApp Bot | Twilio WhatsApp Business API              |
| ⚙️ Backend      | Flask (Python)                            |
| 🗃️ Database     | MySQL (appointments, files, patients)     |
| 📈 Dashboard UI | HTML, Tailwind CSS, JavaScript            |
| 🔐 Security     | JWT Auth + Role-based Access              |

---

## 🏆 Why ClinicAI Will Win

✅ Clinics are desperate for **lightweight**, helpful tech  
✅ It works on **WhatsApp** — no learning curve  
✅ Actually **useful**, not just flashy  
✅ **AI makes care feel personal**  
✅ Scalable to 1 or 10,000 clinics instantly  
✅ Built for **real-world India**, not pitch decks

---

## 🚀 Bottom Line

**ClinicAI isn’t an app.**  
It’s the invisible, 24/7 receptionist **every Indian clinic deserves**.

- Works with what they already use  
- Adds AI where it matters  
- Keeps clinics running — even when no one’s at the desk.


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






