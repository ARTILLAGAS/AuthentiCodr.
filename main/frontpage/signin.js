// auth.js
document.addEventListener('DOMContentLoaded', () => {
    // Auth Modals
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const passphraseConfirmationModal = document.getElementById('passphraseConfirmationModal');
    const codeVerificationModal = document.getElementById('codeVerificationModal');
    const passphraseVerificationModal = document.getElementById('passphraseVerificationModal');
    
    const loginBtnHeader = document.getElementById('loginBtnHeader');
    const getStartedBtn = document.getElementById('getStartedBtn');
    const ctaGetStarted = document.getElementById('ctaGetStarted'); // Added for CTA button
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const passphraseDisplay = document.getElementById('passphraseDisplay');
    const copyPassphraseBtn = document.getElementById('copyPassphrase');
    const confirmPassphraseBtn = document.getElementById('confirmPassphrase');
    const codeVerificationForm = document.getElementById('codeVerificationForm');
    const passphraseVerificationForm = document.getElementById('passphraseVerificationForm');
    
    // Identifier toggle
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const emailGroup = document.getElementById('emailGroup');
    const phoneGroup = document.getElementById('phoneGroup');
    
    // Password validation elements
    const signupPassword = document.getElementById('signupPassword');
    const signupName = document.getElementById('signupName');
    
    // Security state
    let loginAttempts = 0;
    let codeAttempts = 0;
    let currentUserIdentifier = '';
    let verificationCode = '';
    let isNewDevice = true;
    
    // Function to open modal
    function openModal(modal) {
        modal.style.display = 'flex';
        // Reset scroll position
        const scrollable = modal.querySelector('.modal-scrollable');
        if (scrollable) {
            scrollable.scrollTop = 0;
        }
    }
    
    // Function to close modal
    function closeModal(modal) {
        modal.style.display = 'none';
    }
    
    // Close all modals
    function closeAllModals() {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            closeModal(modal);
        });
    }
    
    // Clear all inputs in a form
    function clearForm(form) {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.value = '';
        });
        
        // Reset password validation indicators
        const rules = document.querySelectorAll('.password-rules li');
        rules.forEach(rule => rule.classList.remove('valid'));
    }
    
    // Clear login form
    function clearLoginForm() {
        document.getElementById('loginIdentifier').value = '';
        document.getElementById('loginPassword').value = '';
    }
    
    // Clear signup form
    function clearSignupForm() {
        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPhone').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupConfirmPassword').value = '';
        document.getElementById('secretPassphrase').value = '';
        
        // Reset password validation indicators
        const rules = document.querySelectorAll('.password-rules li');
        rules.forEach(rule => rule.classList.remove('valid'));
    }
    
    // Event listeners for opening modals
    loginBtnHeader.addEventListener('click', (e) => {
        e.preventDefault();
        clearLoginForm();
        openModal(loginModal);
    });
    
    getStartedBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        clearSignupForm();
        openModal(signupModal);
    });
    
    // Add event listener for CTA button
    if (ctaGetStarted) {
        ctaGetStarted.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            clearSignupForm();
            openModal(signupModal);
        });
    }
    
    // Event listeners for switching between modals
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(loginModal);
        clearSignupForm();
        openModal(signupModal);
    });
    
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal(signupModal);
        clearLoginForm();
        openModal(loginModal);
    });
    
    // Event listeners for closing modals
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeAllModals();
        });
    });
    
    // Close modal when clicking outside of modal content
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('auth-modal')) {
            closeModal(e.target);
        }
    });
    
    // Identifier toggle functionality
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            
            // Update button states
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show appropriate input field
            if (type === 'email') {
                emailGroup.style.display = 'block';
                phoneGroup.style.display = 'none';
                document.getElementById('signupEmail').required = true;
                document.getElementById('signupPhone').required = false;
            } else {
                emailGroup.style.display = 'none';
                phoneGroup.style.display = 'block';
                document.getElementById('signupEmail').required = false;
                document.getElementById('signupPhone').required = true;
            }
        });
    });
    
    // Password validation function
    function validatePassword(password, name) {
        const nameParts = name.toLowerCase().split(' ').filter(part => part.length > 2);
        const containsName = nameParts.some(part => password.toLowerCase().includes(part));
        
        const uppercaseRegex = /[A-Z]/;
        const numbersRegex = /[0-9]/g;
        const specialCharsRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        
        const uppercaseCount = uppercaseRegex.test(password) ? 1 : 0;
        const numbersCount = (password.match(numbersRegex) || []).length;
        const specialCharsCount = (password.match(specialCharsRegex) || []).length;
        
        // Update UI indicators
        document.getElementById('rule-uppercase').classList.toggle('valid', uppercaseCount >= 1);
        document.getElementById('rule-numbers').classList.toggle('valid', numbersCount >= 3);
        document.getElementById('rule-special').classList.toggle('valid', specialCharsCount >= 2);
        document.getElementById('rule-name').classList.toggle('valid', !containsName);
        
        return (
            uppercaseCount >= 1 &&
            numbersCount >= 3 &&
            specialCharsCount >= 2 &&
            !containsName
        );
    }
    
    // Password validation on input
    signupPassword.addEventListener('input', () => {
        const name = signupName.value.trim();
        const password = signupPassword.value;
        
        if (name.length > 0 && password.length > 0) {
            validatePassword(password, name);
        }
    });
    
    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = signupName.value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = signupPassword.value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const secretPassphrase = document.getElementById('secretPassphrase').value.trim();
        
        // Validate name
        if (name.length < 3) {
            alert('Please enter your full name');
            return;
        }
        
        // Validate identifier
        const isEmailSelected = document.querySelector('.toggle-btn[data-type="email"]').classList.contains('active');
        let identifier = isEmailSelected ? email : phone;
        
        if (isEmailSelected && !validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }
        
        if (!isEmailSelected && !validatePhone(phone)) {
            alert('Please enter a valid phone number');
            return;
        }
        
        // Validate password
        if (!validatePassword(password, name)) {
            alert('Password does not meet the requirements');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        // Validate passphrase
        if (secretPassphrase.length < 6) {
            alert('Secret passphrase must be at least 6 characters long');
            return;
        }
        
        // Store user data (simulated)
        const userData = {
            name,
            identifier: isEmailSelected ? email : phone,
            identifierType: isEmailSelected ? 'email' : 'phone',
            password,
            secretPassphrase
        };
        
        localStorage.setItem(`user_${identifier}`, JSON.stringify(userData));
        
        // Show passphrase confirmation
        passphraseDisplay.textContent = secretPassphrase;
        closeModal(signupModal);
        openModal(passphraseConfirmationModal);
    });
    
    // Copy passphrase to clipboard
    copyPassphraseBtn.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        textarea.value = passphraseDisplay.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        // Show copied message
        const originalText = copyPassphraseBtn.innerHTML;
        copyPassphraseBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            copyPassphraseBtn.innerHTML = originalText;
        }, 2000);
    });
    
    // Confirm passphrase
    confirmPassphraseBtn.addEventListener('click', () => {
        closeModal(passphraseConfirmationModal);
        loginBtnHeader.innerHTML = '<i class="fas fa-user"></i> Account';
        alert('Account created successfully!');
    });
    
    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        
        // Check if user is locked out
        const lockoutKey = `lockout_${identifier}`;
        const lockoutUntil = localStorage.getItem(lockoutKey);
        
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const hoursLeft = Math.ceil((lockoutUntil - Date.now()) / (1000 * 60 * 60));
            alert(`Account locked. Please try again in ${hoursLeft} hours.`);
            return;
        }
        
        // Get user data
        const userKey = `user_${identifier}`;
        const userData = JSON.parse(localStorage.getItem(userKey));
        
        if (!userData || userData.password !== password) {
            loginAttempts++;
            
            if (loginAttempts >= 3) {
                // Lock account for 3 hours
                const lockoutTime = Date.now() + (3 * 60 * 60 * 1000);
                localStorage.setItem(lockoutKey, lockoutTime);
                loginAttempts = 0;
                alert('Too many failed attempts. Account locked for 3 hours.');
            } else {
                alert(`Incorrect credentials. You have ${3 - loginAttempts} attempts left.`);
            }
            return;
        }
        
        // Successful login
        loginAttempts = 0;
        currentUserIdentifier = identifier;
        
        // Generate verification code
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        
        // Simulate sending code to user
        alert(`Verification code sent to ${identifier}: ${verificationCode}`);
        
        // Clear code input
        document.getElementById('verificationCode').value = '';
        
        closeModal(loginModal);
        openModal(codeVerificationModal);
    });
    
    // Code verification form submission
    codeVerificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredCode = document.getElementById('verificationCode').value;
        
        if (enteredCode == verificationCode) {
            // Check if device is recognized
            const deviceKey = `device_${currentUserIdentifier}`;
            const deviceRecognized = localStorage.getItem(deviceKey);
            
            if (deviceRecognized) {
                // Device recognized, no passphrase needed
                completeLogin();
            } else {
                // New device, require passphrase
                closeModal(codeVerificationModal);
                // Clear passphrase input
                document.getElementById('passphraseInput').value = '';
                openModal(passphraseVerificationModal);
            }
        } else {
            codeAttempts++;
            
            if (codeAttempts >= 3) {
                // Lock account for 3 hours
                const lockoutKey = `lockout_${currentUserIdentifier}`;
                const lockoutTime = Date.now() + (3 * 60 * 60 * 1000);
                localStorage.setItem(lockoutKey, lockoutTime);
                codeAttempts = 0;
                closeModal(codeVerificationModal);
                alert('Too many failed attempts. Account locked for 3 hours.');
            } else {
                alert(`Incorrect code. You have ${3 - codeAttempts} attempts left.`);
            }
        }
    });
    
    // Passphrase verification form submission
    passphraseVerificationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredPassphrase = document.getElementById('passphraseInput').value;
        
        // Get user data
        const userKey = `user_${currentUserIdentifier}`;
        const userData = JSON.parse(localStorage.getItem(userKey));
        
        if (userData && userData.secretPassphrase === enteredPassphrase) {
            // Remember this device
            const deviceKey = `device_${currentUserIdentifier}`;
            localStorage.setItem(deviceKey, 'true');
            
            completeLogin();
        } else {
            alert('Incorrect passphrase. Please try again.');
        }
    });
    
    // Complete login process
    // In signin.js
function completeLogin() {
    closeAllModals();
    loginBtnHeader.innerHTML = '<i class="fas fa-user"></i> Account';
    
    // Redirect to authenticator main page
    localStorage.setItem('isAuthenticated', 'true');
    window.location.href = '../main/main.html'; // Fixed path
}
    
    // Helper functions
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePhone(phone) {
        // Simple phone validation - at least 7 digits
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 7;
    }

    // Add responsive adjustments for modals on resize
    window.addEventListener('resize', () => {
        adjustModalLayout();
    });
    
    function adjustModalLayout() {
        const modals = document.querySelectorAll('.auth-modal');
        modals.forEach(modal => {
            if (modal.style.display === 'flex') {
                const content = modal.querySelector('.modal-content');
                if (window.innerWidth <= 576) {
                    content.style.width = '95%';
                    content.style.padding = '20px 15px';
                } else {
                    content.style.width = '';
                    content.style.padding = '';
                }
            }
        });
    }
});