// DOM Elements
const body = document.body;
const mode_toggle = document.getElementById('mode_toggle');
const login_form = document.getElementById('login_form');
const login_section = document.getElementById('login_section');
const auth_codes_section = document.getElementById('auth_codes_section');
const add_button = document.getElementById('add_button');
const add_account_modal = document.getElementById('add_account_modal');
const close_modal = document.getElementById('close_modal');
const add_account_form = document.getElementById('add_account_form');
const notification = document.getElementById('notification');
const login_button = document.getElementById('login_button');
const email_input = document.getElementById('email_input');
const password_input = document.getElementById('password_input');

// Demo credentials
const demo_email = 'demo@example.com';
const demo_password = 'password123';

// Toggle light/dark mode
mode_toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    // Removed shake animation
});

// Handle login form submission
login_form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = email_input.value;
    const password = password_input.value;
    
    // Show loading animation
    login_button.innerHTML = '<span>Signing in...</span>';
    login_button.classList.add('login_animation');
    
    // Simulate login process
    setTimeout(() => {
        if (email === demo_email && password === demo_password) {
            // Successful login - smoother transition
            login_section.style.transition = 'all 0.4s ease';
            login_section.style.transform = 'scale(0.95)';
            login_section.style.opacity = '0';
            
            setTimeout(() => {
                login_section.style.display = 'none';
                auth_codes_section.style.display = 'flex';
                
                // Start the timers
                start_timers();
                
                // Start code regeneration
                generate_new_codes();
            }, 400);
        } else {
            // Failed login - without shake, just visual feedback
            login_button.innerHTML = '<span>Sign In</span>';
            login_button.classList.remove('login_animation');
            
            // Reset form with visual feedback
            if (email !== demo_email) {
                email_input.style.transition = 'box-shadow 0.3s ease';
                email_input.style.boxShadow = '0 0 0 2px #ff3b30';
                setTimeout(() => {
                    email_input.style.boxShadow = 'none';
                }, 1000);
            }
            
            if (password !== demo_password) {
                password_input.style.transition = 'box-shadow 0.3s ease';
                password_input.style.boxShadow = '0 0 0 2px #ff3b30';
                setTimeout(() => {
                    password_input.style.boxShadow = 'none';
                }, 1000);
            }
        }
    }, 1000);
});

// Open add account modal
add_button.addEventListener('click', () => {
    add_account_modal.classList.add('active');
});

// Close modal
close_modal.addEventListener('click', () => {
    add_account_modal.classList.remove('active');
});

// Close modal when clicking outside
add_account_modal.addEventListener('click', (e) => {
    if (e.target === add_account_modal) {
        add_account_modal.classList.remove('active');
    }
});

// Handle add account form submission
add_account_form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const service_name = document.getElementById('service_input').value;
    const account = document.getElementById('account_input').value;
    
    // Create a new auth code card
    const code_card = document.createElement('div');
    code_card.className = 'code_card';
    
    const random_code = generate_random_code();
    
    code_card.innerHTML = `
        <div class="code_info">
            <span class="code_service">${service_name}</span>
            <span class="code_account">${account}</span>
        </div>
        <div class="code_area">
            <span class="code_digits">${random_code}</span>
            <div class="timer">30</div>
        </div>
    `;
    
    // Add the new card before the add button
    auth_codes_section.insertBefore(code_card, add_button);
    
    // Reset form
    add_account_form.reset();
    
    // Close modal
    add_account_modal.classList.remove('active');
    
    // Show notification
    show_notification('Account added successfully!');
    
    // Start timer for the new card
    const timer_el = code_card.querySelector('.timer');
    start_timer(timer_el);
});

// Function to start all timers
function start_timers() {
    const timers = document.querySelectorAll('.timer');
    timers.forEach(timer => {
        start_timer(timer);
    });
}

// Function to start individual timer with smoother color transition
function start_timer(timer_el) {
    let time = 30;
    timer_el.textContent = time;
    
    const interval = setInterval(() => {
        time--;
        timer_el.textContent = time;
        
        // Change color based on remaining time - smoother transition
        if (time <= 10) {
            const redIntensity = Math.max(255, 255 * (10 - time) / 10);
            timer_el.style.background = `linear-gradient(to right, rgb(${redIntensity}, ${150 - time * 10}, 48), rgb(255, ${150 - time * 10}, 0))`;
        }
        
        if (time === 0) {
            clearInterval(interval);
            
            // Get the code display
            const code_digits = timer_el.previousElementSibling;
            
            // Generate new code with smooth transition
            code_digits.style.transition = 'opacity 0.3s ease';
            code_digits.style.opacity = '0';
            
            setTimeout(() => {
                code_digits.textContent = generate_random_code();
                code_digits.style.opacity = '1';
                
                // Reset timer
                timer_el.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
                start_timer(timer_el);
            }, 300);
        }
    }, 1000);
}

// Function to generate random auth code
function generate_random_code() {
    const code1 = Math.floor(100 + Math.random() * 900);
    const code2 = Math.floor(100 + Math.random() * 900);
    return `${code1} ${code2}`;
}

// Function to generate new codes every 30 seconds with smoother transitions
function generate_new_codes() {
    setInterval(() => {
        const code_digits = document.querySelectorAll('.code_digits');
        code_digits.forEach(code => {
            // Add a smoother animation when changing code
            code.style.transition = 'opacity 0.4s ease';
            code.style.opacity = '0';
            
            setTimeout(() => {
                code.textContent = generate_random_code();
                code.style.opacity = '1';
            }, 400);
        });
    }, 30000);
}

// Function to show notification with smoother animation
function show_notification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// For demo purposes - prefill credentials
email_input.value = demo_email;
password_input.value = demo_password;