document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    document.getElementById('loginBtn').addEventListener('click', () => {
        window.location.href = 'login.html';
    });
    
    document.getElementById('signupBtn').addEventListener('click', () => {
        window.location.href = 'login.html#signup';
    });
    
    if (sessionStorage.getItem('authenticodr_loggedIn')) {
        window.location.href = 'main.html';
    }
});