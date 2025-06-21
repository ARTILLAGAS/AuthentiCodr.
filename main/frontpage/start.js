document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const menuLinks = document.querySelectorAll('#menu a');
    
    menuToggle.addEventListener('click', () => menu.classList.toggle('show'));
    
    menuLinks.forEach(link => link.addEventListener('click', () => menu.classList.remove('show')));
    
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    function animateCode() {
        const codeElements = document.querySelectorAll('.auth-code span');
        
        setInterval(() => {
            codeElements.forEach((element, index) => {
                setTimeout(() => {
                    element.style.transform = 'translateY(-10px)';
                    element.style.opacity = '0';
                    
                    setTimeout(() => {
                        element.textContent = Math.floor(Math.random() * 10);
                        element.style.transform = 'translateY(0)';
                        element.style.opacity = '1';
                    }, 200);
                }, index * 100);
            });
        }, 5000);
    }
    
    function updateTimer() {
        const timerBar = document.querySelector('.timer-bar');
        const timerText = document.querySelector('.timer-text');
        let timeLeft = 23;
        
        setInterval(() => {
            timeLeft--;
            if (timeLeft < 0) {
                timeLeft = 29;
                animateCode();
            }
            
            const percent = (timeLeft / 29) * 100;
            timerBar.style.width = `${percent}%`;
            timerText.textContent = `${timeLeft}s remaining`;
        }, 1000);
    }
    
    document.querySelector('.auth-actions button:first-child').addEventListener('click', () => {
        const codeElements = document.querySelectorAll('.auth-code span');
        let code = '';
        codeElements.forEach(el => code += el.textContent);
        
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.querySelector('.auth-actions button:first-child');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => btn.innerHTML = originalText, 2000);
        });
    });
    
    document.querySelector('.auth-actions button:last-child').addEventListener('click', animateCode);
    
    animateCode();
    updateTimer();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});