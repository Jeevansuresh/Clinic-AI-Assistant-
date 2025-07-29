// Sample data for appointments
const appointmentsData = [
    {
        id: 1,
        time: "09:00 AM",
        name: "John Smith",
        complaint: "Chest pain and shortness of breath",
        status: "pending",
        patientId: "P001"
    },
    {
        id: 2,
        time: "10:30 AM",
        name: "Sarah Johnson",
        complaint: "Regular checkup",
        status: "completed",
        patientId: "P002"
    },
    {
        id: 3,
        time: "11:45 AM",
        name: "Michael Brown",
        complaint: "Diabetes management",
        status: "pending",
        patientId: "P003"
    },
    {
        id: 4,
        time: "02:00 PM",
        name: "Emily Davis",
        complaint: "Fever and cough",
        status: "pending",
        patientId: "P004"
    },
    {
        id: 5,
        time: "03:15 PM",
        name: "David Wilson",
        complaint: "Blood pressure check",
        status: "pending",
        patientId: "P005"
    },
    {
        id: 6,
        time: "04:30 PM",
        name: "Lisa Anderson",
        complaint: "Follow-up consultation",
        status: "pending",
        patientId: "P006"
    }
];

// Sample patient data
const patientsData = {
    "P001": {
        name: "John Smith",
        age: 45,
        contact: "+1 234-567-8901",
        bloodGroup: "A+",
        medicalHistory: [
            "Hypertension (2020)",
            "Diabetes Type 2 (2018)",
            "Heart surgery (2019)"
        ],
        timeline: [
            {
                date: "2024-01-15",
                title: "Regular Checkup",
                description: "Blood pressure normal, diabetes under control"
            },
            {
                date: "2023-12-20",
                title: "Emergency Visit",
                description: "Chest pain, ECG normal, prescribed medication"
            },
            {
                date: "2023-11-10",
                title: "Follow-up",
                description: "Diabetes management, blood sugar levels improved"
            }
        ]
    },
    "P002": {
        name: "Sarah Johnson",
        age: 32,
        contact: "+1 234-567-8902",
        bloodGroup: "O-",
        medicalHistory: [
            "Asthma (2015)",
            "Seasonal allergies"
        ],
        timeline: [
            {
                date: "2024-01-10",
                title: "Annual Checkup",
                description: "All vital signs normal, asthma well controlled"
            }
        ]
    },
    "P003": {
        name: "Michael Brown",
        age: 58,
        contact: "+1 234-567-8903",
        bloodGroup: "B+",
        medicalHistory: [
            "Diabetes Type 1 (1995)",
            "Kidney disease (2020)",
            "Retinopathy (2021)"
        ],
        timeline: [
            {
                date: "2024-01-12",
                title: "Diabetes Management",
                description: "Blood sugar levels high, insulin dosage adjusted"
            }
        ]
    }
};

// DOM Elements
let currentPatientId = null;
let currentFilter = 'all';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    // Only run dashboard initialization if we're on dashboard or appointments page
    const currentPage = window.location.pathname;
    
    if (isLoggedIn === 'true') {
        if (currentPage.includes('dashboard.html') || currentPage.includes('appointments.html')) {
            showDashboard();
        }
    } else {
        // Redirect to login if not logged in and not on login page
        if (!currentPage.includes('index.html')) {
            showLogin();
        }
    }
    
    // Set current date
    updateCurrentDate();
    
    // Initialize event listeners only for dashboard/appointments pages
    if (currentPage.includes('dashboard.html') || currentPage.includes('appointments.html')) {
        initializeEventListeners();
    }
});

// Show login page
function showLogin() {
    window.location.href = 'index.html';
}

// Show dashboard
function showDashboard() {
    // Load dashboard data
    loadDashboardData();
}

// Update current date
function updateCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    if (dateElement) {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        dateElement.textContent = today.toLocaleDateString('en-US', options);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
    
    // Modal close button
    const closeBtn = document.querySelector('.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    // Tab buttons
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', handleTabClick);
    });
    
    // File upload
    const fileUpload = document.getElementById('fileUpload');
    if (fileUpload) {
        fileUpload.addEventListener('change', handleFileUpload);
    }
    
    // Save diagnosis button
    const saveDiagnosisBtn = document.getElementById('saveDiagnosis');
    if (saveDiagnosisBtn) {
        saveDiagnosisBtn.addEventListener('click', saveDiagnosis);
    }
    
    // Send WhatsApp button
    const sendWhatsAppBtn = document.getElementById('sendWhatsApp');
    if (sendWhatsAppBtn) {
        sendWhatsAppBtn.addEventListener('click', sendToWhatsApp);
    }
    
    // Add medication button
    const addMedicationBtn = document.querySelector('.add-medication-btn');
    if (addMedicationBtn) {
        addMedicationBtn.addEventListener('click', addMedication);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('patientModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('doctorEmail');
    showLogin();
}

// Load dashboard data
function loadDashboardData() {
    loadAppointments();
    updateStats();
}

// Load appointments
function loadAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    if (!appointmentsList) return;
    
    appointmentsList.innerHTML = '';
    
    appointmentsData.forEach(appointment => {
        const appointmentCard = createAppointmentCard(appointment);
        appointmentsList.appendChild(appointmentCard);
    });
}

// Create appointment card
function createAppointmentCard(appointment) {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    card.dataset.status = appointment.status;
    card.dataset.time = appointment.time;
    
    const time = appointment.time;
    const isMorning = time.includes('AM') && parseInt(time.split(':')[0]) < 12;
    const isAfternoon = time.includes('PM') || (time.includes('AM') && parseInt(time.split(':')[0]) >= 12);
    
    card.dataset.period = isMorning ? 'morning' : 'afternoon';
    
    card.innerHTML = `
        <div class="appointment-info">
            <div class="appointment-time">${appointment.time}</div>
            <div class="appointment-name">${appointment.name}</div>
            <div class="appointment-complaint">${appointment.complaint}</div>
        </div>
        <div class="appointment-actions">
            <button class="btn-view" onclick="viewPatient('${appointment.patientId}')">
                <i class="fas fa-eye"></i>
                View
            </button>
        </div>
    `;
    
    return card;
}

// Update stats
function updateStats() {
    const total = appointmentsData.length;
    const completed = appointmentsData.filter(a => a.status === 'completed').length;
    const pending = total - completed;
    
    const totalElement = document.getElementById('totalAppointments');
    const completedElement = document.getElementById('completedAppointments');
    const pendingElement = document.getElementById('pendingAppointments');
    
    if (totalElement) totalElement.textContent = total;
    if (completedElement) completedElement.textContent = completed;
    if (pendingElement) pendingElement.textContent = pending;
}

// Handle filter click
function handleFilterClick(e) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    currentFilter = e.target.dataset.filter;
    filterAppointments();
}

// Filter appointments
function filterAppointments() {
    const appointmentCards = document.querySelectorAll('.appointment-card');
    
    appointmentCards.forEach(card => {
        if (currentFilter === 'all') {
            card.style.display = 'flex';
        } else {
            const period = card.dataset.period;
            card.style.display = (period === currentFilter) ? 'flex' : 'none';
        }
    });
}

// View patient
function viewPatient(patientId) {
    currentPatientId = patientId;
    const patient = patientsData[patientId];
    
    if (!patient) {
        alert('Patient data not found');
        return;
    }
    
    // Update modal content
    document.getElementById('patientName').textContent = patient.name;
    document.getElementById('patientFullName').textContent = patient.name;
    document.getElementById('patientAge').textContent = patient.age;
    document.getElementById('patientContact').textContent = patient.contact;
    document.getElementById('patientBloodGroup').textContent = patient.bloodGroup;
    
    // Load medical history
    loadMedicalHistory(patient.medicalHistory);
    
    // Load timeline
    loadTimeline(patient.timeline);
    
    // Show modal
    document.getElementById('patientModal').style.display = 'block';
}

// Load medical history
function loadMedicalHistory(history) {
    const historyList = document.getElementById('medicalHistoryList');
    if (!historyList) return;
    
    historyList.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = item;
        historyList.appendChild(historyItem);
    });
}

// Load timeline
function loadTimeline(timeline) {
    const timelineElement = document.getElementById('visitTimeline');
    if (!timelineElement) return;
    
    timelineElement.innerHTML = '';
    
    timeline.forEach(item => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-date">${formatDate(item.date)}</div>
            <div class="timeline-title">${item.title}</div>
            <div class="timeline-description">${item.description}</div>
        `;
        timelineElement.appendChild(timelineItem);
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Close modal
function closeModal() {
    document.getElementById('patientModal').style.display = 'none';
}

// Handle tab click
function handleTabClick(e) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Remove active class from all tabs and panes
    tabBtns.forEach(btn => btn.classList.remove('active'));
    tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked tab
    e.target.classList.add('active');
    
    // Show corresponding pane
    const tabName = e.target.dataset.tab;
    document.getElementById(tabName).classList.add('active');
}

// Handle file upload
function handleFileUpload(e) {
    const files = e.target.files;
    const reportsList = document.getElementById('reportsList');
    
    Array.from(files).forEach(file => {
        const reportItem = document.createElement('div');
        reportItem.className = 'report-item';
        reportItem.innerHTML = `
            <div>
                <strong>${file.name}</strong>
                <br>
                <small>${formatFileSize(file.size)}</small>
            </div>
            <button class="btn-view" onclick="downloadReport('${file.name}')">
                <i class="fas fa-download"></i>
            </button>
        `;
        reportsList.appendChild(reportItem);
    });
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Download report (mock function)
function downloadReport(filename) {
    alert(`Downloading ${filename}...`);
}

// Save diagnosis
function saveDiagnosis() {
    const diagnosisNotes = document.getElementById('diagnosisNotes').value;
    
    if (!diagnosisNotes.trim()) {
        alert('Please enter diagnosis notes');
        return;
    }
    
    // In a real app, this would save to the database
    alert('Diagnosis saved successfully!');
    
    // Clear the textarea
    document.getElementById('diagnosisNotes').value = '';
}

// Send to WhatsApp
function sendToWhatsApp() {
    const diagnosisNotes = document.getElementById('diagnosisNotes').value;
    const patient = patientsData[currentPatientId];
    
    if (!diagnosisNotes.trim()) {
        alert('Please enter diagnosis notes first');
        return;
    }
    
    // Create WhatsApp message
    const message = `*Medical Summary for ${patient.name}*
    
*Diagnosis:*
${diagnosisNotes}

*Patient Details:*
- Name: ${patient.name}
- Age: ${patient.age}
- Contact: ${patient.contact}

*Instructions:*
Please follow the prescribed medications and schedule a follow-up appointment.

*From:* Dr. Sarah Johnson
*Hospital:* AI Assistant Medical Center`;

    // Encode message for WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${patient.contact.replace(/\D/g, '')}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    alert('WhatsApp message prepared!');
}

// Add medication
function addMedication() {
    const medicationName = prompt('Enter medication name:');
    if (!medicationName) return;
    
    const dosage = prompt('Enter dosage:');
    if (!dosage) return;
    
    const duration = prompt('Enter duration:');
    if (!duration) return;
    
    // Add to UI
    const medicationList = document.getElementById('medicationList');
    const medicationItem = document.createElement('div');
    medicationItem.className = 'medication-item';
    medicationItem.innerHTML = `
        <div>
            <strong>${medicationName}</strong>
            <br>
            <small>Dosage: ${dosage} | Duration: ${duration}</small>
        </div>
        <button class="btn-view" onclick="removeMedication(this)">
            <i class="fas fa-trash"></i>
        </button>
    `;
    medicationList.appendChild(medicationItem);
}

// Remove medication
function removeMedication(button) {
    button.parentElement.remove();
}

// Navigation handling
document.addEventListener('click', function(e) {
    if (e.target.closest('.nav-item a')) {
        e.preventDefault();
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => item.classList.remove('active'));
        e.target.closest('.nav-item').classList.add('active');
        
        // Handle navigation
        const href = e.target.closest('.nav-item a').getAttribute('href');
        if (href === '#dashboard') {
            // Already on dashboard
        } else if (href === 'appointments.html') {
            // Navigate to appointments page
            window.location.href = 'appointments.html';
        } else if (href === 'dashboard.html') {
            // Navigate to dashboard
            window.location.href = 'dashboard.html';
        } else {
            // For other sections that aren't implemented yet
            alert(`${href.substring(1)} section coming soon!`);
        }
    }
});

// Auto-refresh appointments every 5 minutes
setInterval(() => {
    if (document.getElementById('appointmentsList')) {
        loadAppointments();
        updateStats();
    }
}, 300000); // 5 minutes

// Add some interactivity to the upload area
document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            document.getElementById('fileUpload').click();
        });
        
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#4CAF50';
            uploadArea.style.backgroundColor = '#f0f8f0';
        });
        
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'transparent';
        });
        
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            document.getElementById('fileUpload').files = files;
            handleFileUpload({ target: { files: files } });
        });
    }
}); 