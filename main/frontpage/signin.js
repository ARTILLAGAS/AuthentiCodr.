document.addEventListener('DOMContentLoaded', () => {
    const modals = {
        login: document.getElementById('loginModal'),
        signup: document.getElementById('signupModal'),
        passphrase: document.getElementById('passphraseConfirmationModal'),
        code: document.getElementById('codeVerificationModal'),
        passphraseVerify: document.getElementById('passphraseVerificationModal')
    };
    
    const elements = {
        loginBtnHeader: document.getElementById('loginBtnHeader'),
        getStartedBtn: document.getElementById('getStartedBtn'),
        ctaGetStarted: document.getElementById('ctaGetStarted'),
        showSignup: document.getElementById('showSignup'),
        showLogin: document.getElementById('showLogin'),
        loginForm: document.getElementById('loginForm'),
        signupForm: document.getElementById('signupForm'),
        passphraseDisplay: document.getElementById('passphraseDisplay'),
        copyPassphrase: document.getElementById('copyPassphrase'),
        confirmPassphrase: document.getElementById('confirmPassphrase'),
        codeVerificationForm: document.getElementById('codeVerificationForm'),
        passphraseVerificationForm: document.getElementById('passphraseVerificationForm'),
        signupPassword: document.getElementById('signupPassword'),
        signupName: document.getElementById('signupName')
    };
    
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    
    let loginAttempts = 0;
    let codeAttempts = 0;
    let currentUserIdentifier = '';
    let verificationCode = '';
    
    function openModal(modal) {
        modal.style.display = 'flex';
        const scrollable = modal.querySelector('.modal-scrollable');
        if (scrollable) scrollable.scrollTop = 0;
    }
    
    function closeModal(modal) {
        modal.style.display = 'none';
    }
    
    function closeAllModals() {
        document.querySelectorAll('.auth-modal').forEach(closeModal);
    }
    
    function clearForm(form) {
        form.querySelectorAll('input').forEach(input => input.value = '');
        document.querySelectorAll('.password-rules li').forEach(li => li.classList.remove('valid'));
    }
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.type;
            toggleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (type === 'email') {
                document.getElementById('emailGroup').style.display = 'block';
                document.getElementById('phoneGroup').style.display = 'none';
                document.getElementById('signupEmail').required = true;
                document.getElementById('signupPhone').required = false;
            } else {
                document.getElementById('emailGroup').style.display = 'none';
                document.getElementById('phoneGroup').style.display = 'block';
                document.getElementById('signupEmail').required = false;
                document.getElementById('signupPhone').required = true;
            }
        });
    });
    
    function validatePassword(password, name) {
        const nameParts = name.toLowerCase().split(' ').filter(part => part.length > 2);
        const containsName = nameParts.some(part => password.toLowerCase().includes(part));
        
        const rules = {
            uppercase: /[A-Z]/.test(password),
            numbers: (password.match(/[0-9]/g) || []).length >= 3,
            special: (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2,
            name: !containsName
        };
        
        Object.keys(rules).forEach((rule, i) => {
            document.getElementById(`rule-${rule}`).classList.toggle('valid', rules[rule]);
        });
        
        return Object.values(rules).every(Boolean);
    }
    
    elements.signupPassword.addEventListener('input', () => {
        const name = elements.signupName.value.trim();
        const password = elements.signupPassword.value;
        if (name && password) validatePassword(password, name);
    });
    
    elements.signupForm.addEventListener('submit', e => {
        e.preventDefault();
        
        const name = elements.signupName.value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const phone = document.getElementById('signupPhone').value.trim();
        const password = elements.signupPassword.value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const secretPassphrase = document.getElementById('secretPassphrase').value.trim();
        
        if (name.length < 3) return alert('Please enter your full name');
        
        const isEmailSelected = document.querySelector('.toggle-btn[data-type="email"]').classList.contains('active');
        let identifier = isEmailSelected ? email : phone;
        
        if (isEmailSelected && !validateEmail(email)) return alert('Please enter a valid email address');
        if (!isEmailSelected && !validatePhone(phone)) return alert('Please enter a valid phone number');
        if (!validatePassword(password, name)) return alert('Password does not meet the requirements');
        if (password !== confirmPassword) return alert('Passwords do not match');
        if (secretPassphrase.length < 6) return alert('Secret passphrase must be at least 6 characters long');
        
        const userData = {
            name,
            identifier,
            identifierType: isEmailSelected ? 'email' : 'phone',
            password,
            secretPassphrase
        };
        
        localStorage.setItem(`user_${identifier}`, JSON.stringify(userData));
        elements.passphraseDisplay.textContent = secretPassphrase;
        closeModal(modals.signup);
        openModal(modals.passphrase);
    });
    
    elements.copyPassphrase.addEventListener('click', () => {
        const textarea = document.createElement('textarea');
        textarea.value = elements.passphraseDisplay.textContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        const originalText = elements.copyPassphrase.innerHTML;
        elements.copyPassphrase.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => elements.copyPassphrase.innerHTML = originalText, 2000);
    });
    
    elements.confirmPassphrase.addEventListener('click', () => {
    closeModal(modals.passphrase);
    const notification = document.createElement('div');
    notification.className = 'signup-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-check-circle"></i>
            <span>Sign up successful! Please login now.</span>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.style.opacity = '1', 10);
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
    
    clearForm(elements.signupForm);
    clearForm(elements.loginForm);
    openModal(modals.login);
    });
    
    elements.loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const identifier = document.getElementById('loginIdentifier').value;
        const password = document.getElementById('loginPassword').value;
        
        const lockoutKey = `lockout_${identifier}`;
        const lockoutUntil = localStorage.getItem(lockoutKey);
        
        if (lockoutUntil && Date.now() < lockoutUntil) {
            const hoursLeft = Math.ceil((lockoutUntil - Date.now()) / (1000 * 60 * 60));
            return alert(`Account locked. Please try again in ${hoursLeft} hours.`);
        }
        
        const userKey = `user_${identifier}`;
        const userData = JSON.parse(localStorage.getItem(userKey));
        
        if (!userData || userData.password !== password) {
            loginAttempts++;
            
            if (loginAttempts >= 3) {
                const lockoutTime = Date.now() + (3 * 60 * 60 * 1000);
                localStorage.setItem(lockoutKey, lockoutTime);
                loginAttempts = 0;
                alert('Too many failed attempts. Account locked for 3 hours.');
            } else {
                alert(`Incorrect credentials. You have ${3 - loginAttempts} attempts left.`);
            }
            return;
        }
        
        loginAttempts = 0;
        currentUserIdentifier = identifier;
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        alert(`Verification code sent to ${identifier}: ${verificationCode}`);
        document.getElementById('verificationCode').value = '';
        closeModal(modals.login);
        openModal(modals.code);
    });
    
    elements.codeVerificationForm.addEventListener('submit', e => {
        e.preventDefault();
        const enteredCode = document.getElementById('verificationCode').value;
        
        if (enteredCode == verificationCode) {
            const deviceKey = `device_${currentUserIdentifier}`;
            const deviceRecognized = localStorage.getItem(deviceKey);
            
            if (deviceRecognized) {
                completeLogin();
            } else {
                closeModal(modals.code);
                document.getElementById('passphraseInput').value = '';
                openModal(modals.passphraseVerify);
            }
        } else {
            codeAttempts++;
            
            if (codeAttempts >= 3) {
                const lockoutKey = `lockout_${currentUserIdentifier}`;
                const lockoutTime = Date.now() + (3 * 60 * 60 * 1000);
                localStorage.setItem(lockoutKey, lockoutTime);
                codeAttempts = 0;
                closeModal(modals.code);
                alert('Too many failed attempts. Account locked for 3 hours.');
            } else {
                alert(`Incorrect code. You have ${3 - codeAttempts} attempts left.`);
            }
        }
    });
    
    elements.passphraseVerificationForm.addEventListener('submit', e => {
        e.preventDefault();
        const enteredPassphrase = document.getElementById('passphraseInput').value;
        const userKey = `user_${currentUserIdentifier}`;
        const userData = JSON.parse(localStorage.getItem(userKey));
        
        if (userData && userData.secretPassphrase === enteredPassphrase) {
            localStorage.setItem(`device_${currentUserIdentifier}`, 'true');
            completeLogin();
        } else {
            alert('Incorrect passphrase. Please try again.');
        }
    });
    
    function completeLogin() {
        closeAllModals();
        elements.loginBtnHeader.innerHTML = '<i class="fas fa-user"></i> Account';
        localStorage.setItem('isAuthenticated', 'true');
        window.location.href = '../main/main.html';
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function validatePhone(phone) {
        return phone.replace(/\D/g, '').length >= 7;
    }
    
    window.addEventListener('resize', adjustModalLayout);
    
    function adjustModalLayout() {
        document.querySelectorAll('.auth-modal').forEach(modal => {
            if (modal.style.display === 'flex') {
                const content = modal.querySelector('.modal-content');
                content.style.width = window.innerWidth <= 576 ? '95%' : '';
                content.style.padding = window.innerWidth <= 576 ? '20px 15px' : '';
            }
        });
    }
    
    elements.loginBtnHeader.addEventListener('click', e => {
        e.preventDefault();
        clearForm(elements.loginForm);
        openModal(modals.login);
    });
    
    elements.getStartedBtn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        clearForm(elements.signupForm);
        openModal(modals.signup);
    });
    
    if (elements.ctaGetStarted) {
        elements.ctaGetStarted.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            clearForm(elements.signupForm);
            openModal(modals.signup);
        });
    }
    
    elements.showSignup.addEventListener('click', e => {
        e.preventDefault();
        closeModal(modals.login);
        clearForm(elements.signupForm);
        openModal(modals.signup);
    });
    
    elements.showLogin.addEventListener('click', e => {
        e.preventDefault();
        closeModal(modals.signup);
        clearForm(elements.loginForm);
        openModal(modals.login);
    });
    
    closeModalButtons.forEach(button => button.addEventListener('click', closeAllModals));
    
    window.addEventListener('click', e => {
        if (e.target.classList.contains('auth-modal')) closeModal(e.target);
    });
});