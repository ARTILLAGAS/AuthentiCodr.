document.addEventListener('DOMContentLoaded', () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.href = '../frontpage/start.html';
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    
    function logout() {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '../frontpage/start.html';
    }
    
    logoutBtn.addEventListener('click', logout);
});