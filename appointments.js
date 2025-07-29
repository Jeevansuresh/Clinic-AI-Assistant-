// Calendar functionality with appointment listing and modal view

// --- Sample Data (replace with your real data source as needed) ---
const allAppointments = [
    {
        id: 1,
        date: "2024-01-15",
        time: "09:00 AM",
        patient_name: "John Smith",
        complaint: "Chest pain and shortness of breath",
        status: "pending",
        patient_code: "P001",
        duration: 30
    },
    {
        id: 2,
        date: "2024-01-15",
        time: "10:30 AM",
        patient_name: "Sarah Johnson",
        complaint: "Regular checkup",
        status: "completed",
        patient_code: "P002",
        duration: 45
    },
    {
        id: 3,
        date: "2024-01-18",
        time: "11:00 AM",
        patient_name: "Michael Brown",
        complaint: "Diabetes management",
        status: "pending",
        patient_code: "P003",
        duration: 60
    },
    {
        id: 4,
        date: "2024-01-22",
        time: "02:00 PM",
        patient_name: "Emily Davis",
        complaint: "Fever and cough",
        status: "pending",
        patient_code: "P004",
        duration: 30
    },
    {
        id: 5,
        date: "2024-01-25",
        time: "03:15 PM",
        patient_name: "David Wilson",
        complaint: "Blood pressure check",
        status: "pending",
        patient_code: "P005",
        duration: 30
    },
    {
        id: 6,
        date: "2024-01-28",
        time: "04:30 PM",
        patient_name: "Lisa Anderson",
        complaint: "Follow-up consultation",
        status: "pending",
        patient_code: "P006",
        duration: 30
    },
    {
        id: 7,
        date: "2025-07-29", // <-- today's date
        time: "11:00 AM",
        patient_name: "Priya Thomas",
        complaint: "Headache and dizziness",
        status: "pending",
        patient_code: "P007",
        duration: 20
    },
    {
        id: 8,
        date: "2025-07-01",
        time: "09:00 AM",
        patient_name: "Aarav Patel",
        complaint: "Fever and chills",
        status: "pending",
        patient_code: "P008",
        duration: 20
    },
    {
        id: 9,
        date: "2025-07-03",
        time: "11:30 AM",
        patient_name: "Meera Nair",
        complaint: "Back pain",
        status: "pending",
        patient_code: "P009",
        duration: 30
    },
    {
        id: 10,
        date: "2025-07-05",
        time: "10:00 AM",
        patient_name: "Rohan Gupta",
        complaint: "Routine checkup",
        status: "completed",
        patient_code: "P010",
        duration: 25
    },
    {
        id: 11,
        date: "2025-07-07",
        time: "02:00 PM",
        patient_name: "Sneha Menon",
        complaint: "Migraine",
        status: "pending",
        patient_code: "P011",
        duration: 30
    },
    {
        id: 12,
        date: "2025-07-10",
        time: "01:00 PM",
        patient_name: "Vikram Singh",
        complaint: "Diabetes follow-up",
        status: "pending",
        patient_code: "P012",
        duration: 40
    },
    {
        id: 13,
        date: "2025-07-12",
        time: "09:30 AM",
        patient_name: "Anjali Rao",
        complaint: "Blood pressure check",
        status: "completed",
        patient_code: "P013",
        duration: 15
    },
    {
        id: 14,
        date: "2025-07-15",
        time: "11:00 AM",
        patient_name: "Kiran Kumar",
        complaint: "Cough and cold",
        status: "pending",
        patient_code: "P014",
        duration: 20
    },
    {
        id: 15,
        date: "2025-07-17",
        time: "03:00 PM",
        patient_name: "Divya Sharma",
        complaint: "Allergy symptoms",
        status: "pending",
        patient_code: "P015",
        duration: 25
    },
    {
        id: 16,
        date: "2025-07-20",
        time: "10:00 AM",
        patient_name: "Rahul Jain",
        complaint: "Stomach ache",
        status: "pending",
        patient_code: "P016",
        duration: 30
    },
    {
        id: 17,
        date: "2025-07-22",
        time: "12:00 PM",
        patient_name: "Fatima Ali",
        complaint: "Asthma review",
        status: "completed",
        patient_code: "P017",
        duration: 30
    },
    {
        id: 18,
        date: "2025-07-24",
        time: "09:00 AM",
        patient_name: "Suresh Pillai",
        complaint: "Joint pain",
        status: "pending",
        patient_code: "P018",
        duration: 20
    },
    {
        id: 19,
        date: "2025-07-26",
        time: "11:30 AM",
        patient_name: "Lakshmi Das",
        complaint: "Skin rash",
        status: "pending",
        patient_code: "P019",
        duration: 25
    },
    {
        id: 20,
        date: "2025-07-28",
        time: "10:00 AM",
        patient_name: "Manoj Varma",
        complaint: "Eye checkup",
        status: "pending",
        patient_code: "P020",
        duration: 15
    },
    {
        id: 21,
        date: "2025-07-29",
        time: "11:00 AM",
        patient_name: "Priya Thomas",
        complaint: "Headache and dizziness",
        status: "pending",
        patient_code: "P007",
        duration: 20
    },
    {
        id: 22,
        date: "2025-07-29",
        time: "03:00 PM",
        patient_name: "Arjun Reddy",
        complaint: "Follow-up",
        status: "pending",
        patient_code: "P021",
        duration: 20
    },
    {
        id: 23,
        date: "2025-07-30",
        time: "09:30 AM",
        patient_name: "Neha Kapoor",
        complaint: "Throat infection",
        status: "pending",
        patient_code: "P022",
        duration: 15
    },
    {
        id: 24,
        date: "2025-07-31",
        time: "01:00 PM",
        patient_name: "Vivek Iyer",
        complaint: "Annual physical",
        status: "pending",
        patient_code: "P023",
        duration: 30
    }
];

// --- Patient Data (for modal) ---
const patientDetails = {
    'P001': { age: 45, contact: '+1 234-567-8901', blood_group: 'A+' },
    'P002': { age: 32, contact: '+1 234-567-8902', blood_group: 'O-' },
    'P003': { age: 58, contact: '+1 234-567-8903', blood_group: 'B+' },
    'P004': { age: 29, contact: '+1 234-567-8904', blood_group: 'AB+' },
    'P005': { age: 51, contact: '+1 234-567-8905', blood_group: 'O+' },
    'P006': { age: 38, contact: '+1 234-567-8906', blood_group: 'A-' },
    'P007': { age: 27, contact: '+1 234-567-8907', blood_group: 'B-' },
    'P008': { age: 34, contact: '+1 234-567-8908', blood_group: 'A+' },
    'P009': { age: 41, contact: '+1 234-567-8909', blood_group: 'B+' },
    'P010': { age: 29, contact: '+1 234-567-8910', blood_group: 'O+' },
    'P011': { age: 37, contact: '+1 234-567-8911', blood_group: 'AB-' },
    'P012': { age: 55, contact: '+1 234-567-8912', blood_group: 'A-' },
    'P013': { age: 62, contact: '+1 234-567-8913', blood_group: 'B-' },
    'P014': { age: 23, contact: '+1 234-567-8914', blood_group: 'O-' },
    'P015': { age: 30, contact: '+1 234-567-8915', blood_group: 'A+' },
    'P016': { age: 48, contact: '+1 234-567-8916', blood_group: 'B+' },
    'P017': { age: 44, contact: '+1 234-567-8917', blood_group: 'AB+' },
    'P018': { age: 53, contact: '+1 234-567-8918', blood_group: 'O+' },
    'P019': { age: 36, contact: '+1 234-567-8919', blood_group: 'A-' },
    'P020': { age: 27, contact: '+1 234-567-8920', blood_group: 'B-' },
    'P021': { age: 39, contact: '+1 234-567-8921', blood_group: 'O+' },
    'P022': { age: 31, contact: '+1 234-567-8922', blood_group: 'A+' },
    'P023': { age: 50, contact: '+1 234-567-8923', blood_group: 'AB-' }
};

// --- Calendar Logic ---
let currentDate = new Date();
let selectedDate = new Date();

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    updateQuickStats();
});

function initializeCalendar() {
    updateCalendarHeader();
    renderCalendar();
    setupCalendarControls();
}

function updateCalendarHeader() {
    const monthYear = currentDate.toLocaleDateString('en-US', { 
        month: 'long', 
        year: 'numeric' 
    });
    document.getElementById('currentMonth').textContent = monthYear;
}

function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) return;
    calendarGrid.innerHTML = '';

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';

        // Current month/other month
        if (date.getMonth() !== currentDate.getMonth()) {
            dayElement.classList.add('other-month');
        }

        // Today
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // Selected
        if (date.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }

        // Weekend
        if (date.getDay() === 0 || date.getDay() === 6) {
            dayElement.classList.add('weekend');
        }

        // Day number
        dayElement.innerHTML = `<div class="day-number">${date.getDate()}</div>`;

        // Appointments for this day
        const dateStr = date.toISOString().split('T')[0];
        const appointments = allAppointments.filter(a => a.date === dateStr);

        if (appointments.length > 0) {
            const list = document.createElement('div');
            list.className = 'appointments-list';
            appointments.forEach(app => {
                const item = document.createElement('div');
                item.className = 'appointment-item' + (app.status === 'completed' ? ' completed' : '');
                item.title = `${app.time} - ${app.patient_name}: ${app.complaint}`;
                item.innerHTML = `<strong>${app.time}</strong> ${app.patient_name}`;
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showAppointmentModal(app);
                });
                list.appendChild(item);
            });
            dayElement.appendChild(list);
        } else {
            dayElement.classList.add('empty');
        }

        dayElement.addEventListener('click', () => {
            selectedDate = date;
            renderCalendar();
        });

        calendarGrid.appendChild(dayElement);
    }
}

function setupCalendarControls() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const todayBtn = document.getElementById('todayBtn');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            updateCalendarHeader();
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            updateCalendarHeader();
            renderCalendar();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentDate = new Date();
            selectedDate = new Date();
            updateCalendarHeader();
            renderCalendar();
        });
    }
}

function updateQuickStats() {
    document.getElementById('totalAppointments').textContent = allAppointments.length;
    // Today's appointments
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('todayAppointments').textContent = allAppointments.filter(a => a.date === todayStr).length;
    // Upcoming (future dates)
    const now = new Date();
    document.getElementById('upcomingAppointments').textContent = allAppointments.filter(a => new Date(a.date) > now).length;
    // Completed
    document.getElementById('completedAppointments').textContent = allAppointments.filter(a => a.status === 'completed').length;
}

// --- Modal Logic ---
function showAppointmentModal(appointment) {
    const modal = document.getElementById('appointmentModal');
    const title = document.getElementById('appointmentTitle');
    const dateTime = document.getElementById('appointmentDateTime');
    const patientName = document.getElementById('appointmentPatientName');
    const complaint = document.getElementById('appointmentComplaint');
    const status = document.getElementById('appointmentStatus');
    const duration = document.getElementById('appointmentDuration');
    const patientAge = document.getElementById('patientAge');
    const patientContact = document.getElementById('patientContact');
    const patientBloodGroup = document.getElementById('patientBloodGroup');

    // Format date and time
    const appointmentDate = new Date(appointment.date + ' ' + appointment.time);
    const formattedDateTime = appointmentDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    title.textContent = `Appointment - ${appointment.patient_name}`;
    dateTime.textContent = formattedDateTime;
    patientName.textContent = appointment.patient_name;
    complaint.textContent = appointment.complaint;
    status.textContent = appointment.status;
    status.className = `status-badge ${appointment.status}`;
    duration.textContent = `${appointment.duration} minutes`;

    // Load patient details
    const patient = patientDetails[appointment.patient_code] || { age: '-', contact: '-', blood_group: '-' };
    patientAge.textContent = patient.age;
    patientContact.textContent = patient.contact;
    patientBloodGroup.textContent = patient.blood_group;

    modal.style.display = 'block';
}

// Modal close functionality
document.addEventListener('click', function(event) {
    const appointmentModal = document.getElementById('appointmentModal');
    const patientModal = document.getElementById('patientModal');
    if (event.target === appointmentModal) {
        appointmentModal.style.display = 'none';
    }
    if (event.target === patientModal) {
        patientModal.style.display = 'none';
    }
    if (event.target.classList.contains('close')) {
        const modal = event.target.closest('.modal');
        if (modal) modal.style.display = 'none';
    }
});

// Appointment action buttons (optional: connect to your patient modal)
document.addEventListener('click', function(event) {
    if (event.target.id === 'viewFullProfile') {
        // Open patient profile modal (reuse your dashboard logic)
        document.getElementById('appointmentModal').style.display = 'none';
        document.getElementById('patientModal').style.display = 'block';
        // Optionally, load patient data here
    }
    // ...other actions as before...
});