// Login page specific functionality
console.log('Login.js loaded successfully');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    console.log('Is logged in:', isLoggedIn);
    
    if (isLoggedIn === 'true') {
        // Redirect to dashboard if already logged in
        console.log('User already logged in, redirecting to dashboard');
        window.location.href = 'dashboard.html';
        return;
    }
    
    // Set up login functionality
    setupLogin();
});

// Setup login functionality
function setupLogin() {
    console.log('Setting up login functionality');
    
    // Get the login form
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    
    console.log('Login form:', loginForm);
    console.log('Login button:', loginBtn);
    
    if (loginForm) {
        // Add form submit handler
        loginForm.addEventListener('submit', function(e) {
            console.log('Form submitted');
            e.preventDefault();
            handleLogin();
        });
    }
    
    if (loginBtn) {
        // Add button click handler as backup
        loginBtn.addEventListener('click', function(e) {
            console.log('Login button clicked');
            e.preventDefault();
            handleLogin();
        });
    }
    
    // Add visual feedback
    setupVisualFeedback();
}

// Handle login
function handleLogin() {
    console.log('Handling login');
    
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (!emailInput || !passwordInput) {
        console.error('Email or password input not found');
        return;
    }
    
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    
    console.log('Email:', email);
    console.log('Password:', password);
    
    // Validate credentials
    if (email === 'doctor@hospital.com' && password === 'password123') {
        console.log('Login successful');
        
        // Set login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('doctorEmail', email);
        
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            loginBtn.disabled = true;
        }
        
        // Redirect after a short delay
        setTimeout(() => {
            console.log('Redirecting to dashboard');
            window.location.href = 'dashboard.html';
        }, 1000);
        
    } else {
        console.log('Login failed - invalid credentials');
        alert('Invalid credentials. Please use the demo credentials provided.');
    }
}

// Setup visual feedback
function setupVisualFeedback() {
    console.log('Setting up visual feedback');
    
    // Add focus effects to input fields
    const inputs = document.querySelectorAll('input');
    console.log('Found input fields:', inputs.length);
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    console.log('Login.js setup complete');
} 