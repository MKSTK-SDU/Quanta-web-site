/**
 * Quanta - Physics Education Platform
 * Authentication Module
 */

// Initialize authentication module
document.addEventListener('DOMContentLoaded', function() {
    // Set up login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Set up signup form
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Set up logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Set up password reset form
    const resetForm = document.getElementById('reset-form');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPassword);
    }
    
    // Update UI based on authentication state
    updateAuthUI();
});

/**
 * Handle login form submission
 * @param {Event} e - Form submit event
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('#login-email');
    const passwordInput = form.querySelector('#login-password');
    const errorEl = form.querySelector('.error-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic validation
    if (!emailInput.value.trim()) {
        showFormError(errorEl, 'Please enter your email');
        return;
    }
    
    if (!validateEmail(emailInput.value.trim())) {
        showFormError(errorEl, 'Please enter a valid email address');
        return;
    }
    
    if (!passwordInput.value) {
        showFormError(errorEl, 'Please enter your password');
        return;
    }
    
    try {
        // Disable form and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Logging in...';
        
        // Send login request
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value.trim(),
                password: passwordInput.value
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Login failed');
        }
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        
        // Show success message
        showToast('Login successful! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Login error:', error);
        showFormError(errorEl, error.message || 'Invalid email or password');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Log In';
    }
}

/**
 * Handle signup form submission
 * @param {Event} e - Form submit event
 */
async function handleSignup(e) {
    e.preventDefault();
    
    const form = e.target;
    const usernameInput = form.querySelector('#signup-username');
    const emailInput = form.querySelector('#signup-email');
    const passwordInput = form.querySelector('#signup-password');
    const confirmPasswordInput = form.querySelector('#signup-confirm-password');
    const errorEl = form.querySelector('.error-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic validation
    if (!usernameInput.value.trim()) {
        showFormError(errorEl, 'Please enter a username');
        return;
    }
    
    if (!emailInput.value.trim()) {
        showFormError(errorEl, 'Please enter your email');
        return;
    }
    
    if (!validateEmail(emailInput.value.trim())) {
        showFormError(errorEl, 'Please enter a valid email address');
        return;
    }
    
    if (!passwordInput.value) {
        showFormError(errorEl, 'Please enter a password');
        return;
    }
    
    // Validate password strength
    const passwordValidation = validatePassword(passwordInput.value);
    if (!passwordValidation.isValid) {
        showFormError(errorEl, passwordValidation.message);
        return;
    }
    
    if (passwordInput.value !== confirmPasswordInput.value) {
        showFormError(errorEl, 'Passwords do not match');
        return;
    }
    
    try {
        // Disable form and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Creating account...';
        
        // Send signup request
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Signup failed');
        }
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(data));
        
        // Show success message
        showToast('Account created successfully! Redirecting...', 'success');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
        
    } catch (error) {
        console.error('Signup error:', error);
        showFormError(errorEl, error.message || 'Failed to create account');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Sign Up';
    }
}

/**
 * Handle logout
 */
function handleLogout() {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    
    // Show success message
    showToast('You have been logged out', 'success');
    
    // Redirect to home page
    window.location.href = '/index.html';
}

/**
 * Handle password reset form submission
 * @param {Event} e - Form submit event
 */
async function handleResetPassword(e) {
    e.preventDefault();
    
    const form = e.target;
    const emailInput = form.querySelector('#reset-email');
    const errorEl = form.querySelector('.error-message');
    const successEl = form.querySelector('.success-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Basic validation
    if (!emailInput.value.trim()) {
        showFormError(errorEl, 'Please enter your email');
        return;
    }
    
    if (!validateEmail(emailInput.value.trim())) {
        showFormError(errorEl, 'Please enter a valid email address');
        return;
    }
    
    try {
        // Disable form and show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending reset email...';
        
        // In a real app, this would call an API endpoint
        // For demo purposes, we'll just simulate a successful request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Hide error message if visible
        errorEl.style.display = 'none';
        
        // Show success message
        successEl.textContent = 'Password reset email sent! Check your inbox.';
        successEl.style.display = 'block';
        
        // Clear form
        emailInput.value = '';
        
    } catch (error) {
        console.error('Password reset error:', error);
        showFormError(errorEl, error.message || 'Failed to send reset email');
    } finally {
        // Re-enable form
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Reset Password';
    }
}

/**
 * Show an error message on a form
 * @param {HTMLElement} errorEl - Error message element
 * @param {string} message - Error message to display
 */
function showFormError(errorEl, message) {
    if (!errorEl) return;
    
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    
    // Automatically hide after 5 seconds
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

/**
 * Update UI elements based on authentication state
 */
function updateAuthUI() {
    const isLoggedIn = !!localStorage.getItem('user');
    const user = isLoggedIn ? JSON.parse(localStorage.getItem('user')) : null;
    
    // Get elements that need to be updated
    const authButtons = document.querySelectorAll('.auth-buttons');
    const userMenus = document.querySelectorAll('.user-menu');
    const authOptions = document.querySelectorAll('.auth-option');
    const userOptions = document.querySelectorAll('.user-option');
    const usernamePlaceholders = document.querySelectorAll('.username-placeholder');
    const avatarPlaceholders = document.querySelectorAll('.user-avatar');
    const loggedInOnlyElements = document.querySelectorAll('.logged-in-only');
    const loggedOutOnlyElements = document.querySelectorAll('.logged-out-only');
    
    if (isLoggedIn) {
        // User is logged in
        
        // Show/hide login/profile elements
        authButtons.forEach(el => el.style.display = 'none');
        userMenus.forEach(el => el.style.display = 'block');
        authOptions.forEach(el => el.style.display = 'none');
        userOptions.forEach(el => el.style.display = 'block');
        
        // Update username placeholders
        usernamePlaceholders.forEach(el => {
            el.textContent = user.username;
        });
        
        // Update avatar placeholders
        avatarPlaceholders.forEach(el => {
            el.textContent = getInitials(user.username);
        });
        
        // Show elements only visible to logged-in users
        loggedInOnlyElements.forEach(el => el.style.display = '');
        
        // Hide elements only visible to logged-out users
        loggedOutOnlyElements.forEach(el => el.style.display = 'none');
        
    } else {
        // User is not logged in
        
        // Show/hide login/profile elements
        authButtons.forEach(el => el.style.display = 'block');
        userMenus.forEach(el => el.style.display = 'none');
        authOptions.forEach(el => el.style.display = 'block');
        userOptions.forEach(el => el.style.display = 'none');
        
        // Reset username placeholders
        usernamePlaceholders.forEach(el => {
            el.textContent = 'Guest';
        });
        
        // Reset avatar placeholders
        avatarPlaceholders.forEach(el => {
            el.textContent = 'G';
        });
        
        // Hide elements only visible to logged-in users
        loggedInOnlyElements.forEach(el => el.style.display = 'none');
        
        // Show elements only visible to logged-out users
        loggedOutOnlyElements.forEach(el => el.style.display = '');
    }
}

/**
 * Check if a user is currently logged in
 * @returns {boolean} True if a user is logged in
 */
function isLoggedIn() {
    return !!localStorage.getItem('user');
}

/**
 * Get the current user if logged in
 * @returns {Object|null} Current user object or null
 */
function getCurrentUser() {
    return localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
}

// Export auth functions
window.auth = {
    isLoggedIn,
    getCurrentUser,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    updateAuthUI
};