document.addEventListener('DOMContentLoaded', function() {
    // Theme toggle functionality
    const themeToggle = document.getElementById('themeToggle');
    const authThemeToggle = document.getElementById('authThemeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        if (themeToggle) themeToggle.checked = true;
        if (authThemeToggle) authThemeToggle.checked = true;
    }
    
    // Theme toggle event listeners
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    if (authThemeToggle) {
        authThemeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Check if user is already logged in
    if (sessionStorage.getItem('authenticodr_loggedIn')) {
        window.location.href = 'main.html';
        return;
    }
    
    // Welcome screen buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const welcomeScreen = document.getElementById('welcomeScreen');
    const authScreen = document.getElementById('authScreen');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginBtn && signupBtn) {
        loginBtn.addEventListener('click', () => {
            welcomeScreen.style.display = 'none';
            authScreen.style.display = 'flex';
            loginTab.click();
        });
        
        signupBtn.addEventListener('click', () => {
            welcomeScreen.style.display = 'none';
            authScreen.style.display = 'flex';
            signupTab.click();
        });
    }
    
    // Tab switching
    if (loginTab && signupTab) {
        loginTab.addEventListener('click', () => {
            loginTab.classList.add('active');
            signupTab.classList.remove('active');
            loginForm.classList.add('active');
            signupForm.classList.remove('active');
        });
        
        signupTab.addEventListener('click', () => {
            signupTab.classList.add('active');
            loginTab.classList.remove('active');
            signupForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }
    
    // Check URL hash for signup
    if (window.location.hash === '#signup' && signupTab) {
        welcomeScreen.style.display = 'none';
        authScreen.style.display = 'flex';
        signupTab.click();
    }
    
    // Form submissions
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('authenticodr_users')) || [];
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                sessionStorage.setItem('authenticodr_loggedIn', 'true');
                sessionStorage.setItem('authenticodr_user', JSON.stringify(user));
                window.location.href = 'main.html';
            } else {
                alert('Invalid credentials');
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            if (!email || !password || !confirmPassword) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('authenticodr_users')) || [];
            const userExists = users.some(u => u.email === email);
            
            if (userExists) {
                alert('User already exists');
                return;
            }
            
            const newUser = { email, password, createdAt: new Date().toISOString() };
            users.push(newUser);
            localStorage.setItem('authenticodr_users', JSON.stringify(users));
            
            sessionStorage.setItem('authenticodr_loggedIn', 'true');
            sessionStorage.setItem('authenticodr_user', JSON.stringify(newUser));
            window.location.href = 'main.html';
        });
    }
});