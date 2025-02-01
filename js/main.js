document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8000/api/auth';
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');

    // Show signup form by default
    signupForm.classList.add('active');

    // Switch to login form
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.remove('active');
        loginForm.classList.add('active');
        // Update header text
        document.querySelector('.form-header h1').textContent = 'Welcome Back';
        document.title = 'WIORMS - Login';
        // Clear any existing error messages
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    });

    // Switch to signup form
    signupLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.remove('active');
        signupForm.classList.add('active');
        // Update header text
        document.querySelector('.form-header h1').textContent = 'Welcome to WIORMS';
        document.title = 'WIORMS - Sign Up';
        // Clear any existing error messages
        const errorMessage = document.querySelector('.error-message');
        if (errorMessage) errorMessage.remove();
    });

    // Show error message
    const showError = (message) => {
        console.error('Error:', message);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Remove any existing error message
        const existingError = document.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Insert error message at the top of the active form
        const activeForm = document.querySelector('form.active');
        activeForm.insertBefore(errorDiv, activeForm.firstChild);

        // Remove error after 5 seconds
        setTimeout(() => errorDiv.remove(), 5000);
    };

    // Show success message
    const showSuccess = (message) => {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        
        // Remove any existing messages
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Insert success message at the top of the active form
        const activeForm = document.querySelector('form.active');
        activeForm.insertBefore(successDiv, activeForm.firstChild);

        // Remove success message after 3 seconds
        setTimeout(() => successDiv.remove(), 3000);
    };

    // Handle signup form submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = signupForm.querySelector('button');
        button.disabled = true;

        const fullname = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const requestData = {
            fullname,
            collage_email: email,
            password
        };

        console.log('Sending signup request with data:', requestData);
        
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showSuccess('Account created successfully! Redirecting...');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            console.error('Full error:', error);
            showError(error.message || 'An error occurred during signup');
        } finally {
            button.disabled = false;
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = loginForm.querySelector('button');
        button.disabled = true;

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const requestData = {
            collage_email: email,
            password
        };

        console.log('Sending login request with data:', requestData);

        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Login response:', data);
            
            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            showSuccess('Login successful! Redirecting...');

            // Redirect to dashboard after a short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } catch (error) {
            console.error('Login error:', error);
            showError(error.message || 'Invalid email or password');
        } finally {
            button.disabled = false;
        }
    });

    // Add ripple effect to buttons
    document.querySelectorAll('.signup-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.disabled) return;
            
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            
            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
        window.location.href = 'dashboard.html';
    }
});