// Timer for verification code
document.addEventListener('DOMContentLoaded', () => {
    let timerInterval;
    const timerDisplay = document.getElementById('timerValue');
    const resendLink = document.getElementById('resendCode');
    
    function startTimer(duration) {
        let timer = duration, minutes, seconds;
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            minutes = parseInt(timer / 60, 10);
            seconds = parseInt(timer % 60, 10);
            
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            
            timerDisplay.textContent = minutes + ":" + seconds;
            
            if (--timer < 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = "00:00";
                resendLink.classList.remove('disabled');
            }
        }, 1000);
    }
    
    // Start 3-minute timer when code modal opens
    document.getElementById('codeVerificationModal').addEventListener('click', (e) => {
        if (e.target === codeVerificationModal) {
            startTimer(180);
            resendLink.classList.add('disabled');
        }
    });
    
    // Resend code functionality
    resendLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (resendLink.classList.contains('disabled')) return;
        
        // Generate new code
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        alert(`New verification code sent: ${verificationCode}`);
        
        // Restart timer
        startTimer(180);
        resendLink.classList.add('disabled');
    });
});