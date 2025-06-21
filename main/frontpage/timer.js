document.addEventListener('DOMContentLoaded', () => {
    let timerInterval;
    const timerDisplay = document.getElementById('timerValue');
    const resendLink = document.getElementById('resendCode');
    const codeModal = document.getElementById('codeVerificationModal');
    
    function startTimer(duration) {
        let timeLeft = duration;
        clearInterval(timerInterval);
        
        timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            timerDisplay.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timeLeft--;
            
            if (timeLeft < 0) {
                clearInterval(timerInterval);
                timerDisplay.textContent = '00:00';
                resendLink.classList.remove('disabled');
            }
        }, 1000);
    }
    
    codeModal.addEventListener('click', e => {
        if (e.target === codeModal) {
            startTimer(180);
            resendLink.classList.add('disabled');
        }
    });
    
    resendLink.addEventListener('click', e => {
        e.preventDefault();
        if (resendLink.classList.contains('disabled')) return;
        
        verificationCode = Math.floor(100000 + Math.random() * 900000);
        alert(`New verification code sent: ${verificationCode}`);
        startTimer(180);
        resendLink.classList.add('disabled');
    });
});