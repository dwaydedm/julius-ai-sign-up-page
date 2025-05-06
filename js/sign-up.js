document.addEventListener('DOMContentLoaded', () => {
    // Remove no-js class since JavaScript is enabled
    document.body.classList.remove('no-js');

    const form = document.getElementById('signup-form');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.getElementById('toggle-password');

    // Create signed-in message container
    const signedInContainer = document.createElement('div');
    signedInContainer.id = 'signed-in-container';
    signedInContainer.style.display = 'none';
    signedInContainer.style.padding = '2rem';
    signedInContainer.style.textAlign = 'center';
    signedInContainer.innerHTML = `
        <h2>Welcome, <span id="user-email"></span>!</h2>
        <button id="sign-out-btn" style="margin-top: 1rem; padding: 0.5rem 1rem; font-size: 1rem; cursor: pointer;">Sign out</button>
    `;
    form.parentNode.insertBefore(signedInContainer, form.nextSibling);

    // Password toggle functionality
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePasswordButton.textContent = type === 'password' ? 'Show password' : 'Hide password';
        });
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = form.email.value;
            const password = form.password.value;

            // Validate email
            if (!validateEmail(email)) {
                showError('Please enter a valid email address');
                return;
            }

            // Validate password
            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                let errorMessage = [];
                if (!passwordValidation.minLength) {
                    errorMessage.push('Password must be at least 10 characters long');
                }
                if (passwordValidation.metConditions < 3) {
                    errorMessage.push('Password must meet at least 3 of the character requirements');
                }
                showError(errorMessage.join('\\n'));
                return;
            }

            try {
                // Here you would typically make an API call to your backend
                console.log('Form submitted successfully', { email });
                showSuccess('Account created successfully!');

                // Clear form
                form.reset();

            } catch (error) {
                showError('An error occurred. Please try again later.');
                console.error('Signup error:', error);
            }
        });
    }

    // Password validation
    function validatePassword(password) {
        const minLength = password.length >= 10;
        const hasLower = /[a-z]/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*]/.test(password);

        const conditions = [hasLower, hasUpper, hasNumber, hasSpecial];
        const metConditions = conditions.filter(condition => condition).length;

        return {
            isValid: minLength && metConditions >= 3,
            minLength,
            metConditions
        };
    }

    // Email validation
    function validateEmail(email) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        return emailRegex.test(email);
    }

    // Error handling
    function showError(message) {
        removeMessages();

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(errorDiv, submitButton);
    }

    function showSuccess(message) {
        removeMessages();

        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;

        const submitButton = form.querySelector('button[type="submit"]');
        form.insertBefore(successDiv, submitButton);
    }

    function removeMessages() {
        const messages = form.querySelectorAll('.error-message, .success-message');
        messages.forEach(message => message.remove());
    }

    // OAuth buttons
    const googleButton = document.querySelector('.btn-google');
    const appleButton = document.querySelector('.btn-apple');

    if (googleButton) {
        googleButton.addEventListener('click', () => {
            // Simulate Google OAuth popup and login
            alert('Simulated Google sign-in successful!');
            showSuccess('Signed in with Google successfully!');

            // Hide form and show signed-in message
            form.style.display = 'none';
            signedInContainer.style.display = 'block';
            document.getElementById('user-email').textContent = 'user@example.com';
        });
    }

    if (appleButton) {
        appleButton.addEventListener('click', () => {
            alert('Simulated Apple sign-in successful!');
            showSuccess('Signed in with Apple successfully!');
        });
    }

    // Sign out button
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'sign-out-btn') {
            signedInContainer.style.display = 'none';
            form.style.display = 'block';
            removeMessages();
        }
    });
});
