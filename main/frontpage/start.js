// script.js
// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
    menu.classList.toggle('show');
});

// Close menu when clicking on a link
const menuLinks = document.querySelectorAll('#menu a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        menu.classList.remove('show');
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Animated code generation for authenticator
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

// Timer animation
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

// Copy code functionality
document.querySelector('.auth-actions button:first-child').addEventListener('click', () => {
    const codeElements = document.querySelectorAll('.auth-code span');
    let code = '';
    codeElements.forEach(el => code += el.textContent);
    
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.querySelector('.auth-actions button:first-child');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    });
});

// Refresh button functionality
document.querySelector('.auth-actions button:last-child').addEventListener('click', () => {
    animateCode();
});

// Initialize animations and functionality
document.addEventListener('DOMContentLoaded', () => {
    animateCode();
    updateTimer();
    
    // Smooth scrolling for anchor links
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