document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    
    if (!isAuthenticated) {
        window.location.href = '../frontpage/start.html';
        return;
    }

    // Logout function
    const logoutBtn = document.getElementById('logoutBtn');
    
    function logout() {
        localStorage.removeItem('isAuthenticated');
        window.location.href = '../frontpage/start.html';
    }
    
    logoutBtn.addEventListener('click', logout);
});