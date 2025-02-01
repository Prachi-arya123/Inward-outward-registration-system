document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = 'http://localhost:8000/api/auth';

    // Function to redirect to login page
    function redirectToLogin() {
        window.location.replace('index.html');
    }

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        redirectToLogin();
        return;
    }

    // Update user information
    const userNameElements = document.querySelectorAll('.name');
    const profileName = document.querySelector('.company-logo h3');
    if (user.fullname) {
        userNameElements.forEach(element => {
            element.textContent = user.fullname;
        });
        if (profileName) {
            profileName.textContent = user.fullname;
        }
    }

    // Handle sign out
    function handleSignOut() {
        // Clear local storage
        localStorage.clear();
        // Force redirect to login page
        window.location.replace('index.html');
    }

    // Attach click event to sign out button
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.onclick = (e) => {
            e.preventDefault();
            handleSignOut();
        };
    }

    // Also attach to the icon and span inside the button
    const signOutIcon = document.querySelector('.fa-sign-out-alt');
    if (signOutIcon) {
        signOutIcon.parentElement.onclick = (e) => {
            e.preventDefault();
            handleSignOut();
        };
    }

    // Protect dashboard route
    function checkAuth() {
        if (!localStorage.getItem('token')) {
            redirectToLogin();
        }
    }

    // Check authentication status periodically
    setInterval(checkAuth, 5000);
});
