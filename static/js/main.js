// Medical Dashboard JavaScript

$(document).ready(function() {
    // Initialize the dashboard
    initDashboard();
    
    // Auto-dismiss alerts after 5 seconds
    setTimeout(function() {
        $('.alert').fadeOut();
    }, 5000);
});

function initDashboard() {
    // Add fade-in animation to cards
    $('.card, .bg-blue-800, .bg-green-700, .bg-yellow-600, .bg-purple-700').addClass('fade-in');
    
    // Initialize tooltips (if using)
    $('[data-toggle="tooltip"]').tooltip();
    
    // Add loading state to buttons
    $('button').on('click', function() {
        const button = $(this);
        const originalText = button.html();
        
        // Don't add loading to logout button
        if (!button.attr('href') && !button.hasClass('no-loading')) {
            button.html('<i class="fas fa-spinner fa-spin"></i> Loading...');
            button.prop('disabled', true);
            
            // Re-enable after 2 seconds (adjust as needed)
            setTimeout(function() {
                button.html(originalText);
                button.prop('disabled', false);
            }, 2000);
        }
    });
}

function refreshData() {
    // Show loading state
    const refreshBtn = $('button:contains("Refresh")');
    refreshBtn.html('<i class="fas fa-spinner fa-spin"></i> Refreshing...');
    refreshBtn.prop('disabled', true);
    
    // Refresh appointments data via AJAX
    $.get('/api/appointments')
        .done(function(data) {
            updateAppointmentsTable(data);
            showNotification('Data refreshed successfully!', 'success');
        })
        .fail(function() {
            showNotification('Failed to refresh data', 'error');
        })
        .always(function() {
            // Restore button
            refreshBtn.html('<i class="fas fa-sync-alt mr-2"></i> Refresh');
            refreshBtn.prop('disabled', false);
        });
}

function updateAppointmentsTable(appointments) {
    const tbody = $('#appointmentsTable tbody');
    tbody.empty();
    
    if (appointments.length === 0) {
        tbody.append('<tr><td colspan="7" class="py-8 text-center text-blue-300">No appointments found</td></tr>');
        return;
    }
    
    appointments.forEach(function(appointment) {
        const statusClass = appointment.status === 'Booked' ? 'bg-green-600' : 'bg-yellow-600';
        const row = `
            <tr class="border-b border-blue-700 hover:bg-blue-700 transition-colors">
                <td class="py-3">${appointment.appointment_number}</td>
                <td class="py-3">${appointment.patient_name}</td>
                <td class="py-3">${appointment.issue}</td>
                <td class="py-3">${appointment.appointment_day}</td>
                <td class="py-3">${appointment.appointment_date}</td>
                <td class="py-3">${appointment.appointment_time}</td>
                <td class="py-3">
                    <span class="${statusClass} text-white px-3 py-1 rounded-full text-sm">
                        ${appointment.status}
                    </span>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
}

function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'bg-green-600' : 
                      type === 'error' ? 'bg-red-600' : 'bg-blue-600';
    
    const notification = `
        <div class="fixed top-4 right-4 ${alertClass} text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in">
            <div class="flex items-center">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'} mr-2"></i>
                ${message}
            </div>
        </div>
    `;
    
    $('body').append(notification);
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        $('.fixed.top-4.right-4').fadeOut(function() {
            $(this).remove();
        });
    }, 3000);
}

// Mobile sidebar toggle
function toggleSidebar() {
    $('.sidebar').toggleClass('open');
}

// Search functionality (if needed)
function searchTable(tableId, searchInputId) {
    const input = document.getElementById(searchInputId);
    const table = document.getElementById(tableId);
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = tbody.getElementsByTagName('tr');
    
    const filter = input.value.toLowerCase();
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length; j++) {
            const cellText = cells[j].textContent || cells[j].innerText;
            if (cellText.toLowerCase().indexOf(filter) > -1) {
                found = true;
                break;
            }
        }
        
        rows[i].style.display = found ? '' : 'none';
    }
}

// Export table to CSV (utility function)
function exportTableToCSV(tableId, filename) {
    const table = document.getElementById(tableId);
    const rows = table.getElementsByTagName('tr');
    let csv = [];
    
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        const headers = rows[i].getElementsByTagName('th');
        const row = [];
        
        // Handle both td and th elements
        const elements = cells.length > 0 ? cells : headers;
        
        for (let j = 0; j < elements.length; j++) {
            let cellText = elements[j].textContent || elements[j].innerText;
            cellText = cellText.replace(/"/g, '""'); // Escape quotes
            row.push('"' + cellText + '"');
        }
        
        csv.push(row.join(','));
    }
    
    // Download CSV
    const csvContent = csv.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}
