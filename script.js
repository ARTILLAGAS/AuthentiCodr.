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

const demo_email = 'demo@example.com';
const demo_password = 'password123';

mode_toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

login_form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = email_input.value;
    const password = password_input.value;
    
    login_button.innerHTML = '<span>Signing in...</span>';
    login_button.classList.add('login_animation');
    
    setTimeout(() => {
        if (email === demo_email && password === demo_password) {
            login_section.style.transition = 'all 0.4s ease';
            login_section.style.transform = 'scale(0.95)';
            login_section.style.opacity = '0';
            
            setTimeout(() => {
                login_section.style.display = 'none';
                auth_codes_section.style.display = 'flex';
                
                start_timers();
                
                generate_new_codes();
            }, 400);
        } else {
            login_button.innerHTML = '<span>Sign In</span>';
            login_button.classList.remove('login_animation');
            
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

add_button.addEventListener('click', () => {
    add_account_modal.classList.add('active');
});

close_modal.addEventListener('click', () => {
    add_account_modal.classList.remove('active');
});

add_account_modal.addEventListener('click', (e) => {
    if (e.target === add_account_modal) {
        add_account_modal.classList.remove('active');
    }
});

add_account_form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const service_name = document.getElementById('service_input').value;
    const account = document.getElementById('account_input').value;
    
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
    
    auth_codes_section.insertBefore(code_card, add_button);
    
    add_account_form.reset();
    
    add_account_modal.classList.remove('active');
    
    show_notification('Account added successfully!');
    
    const timer_el = code_card.querySelector('.timer');
    start_timer(timer_el);
});

function start_timers() {
    const timers = document.querySelectorAll('.timer');
    timers.forEach(timer => {
        start_timer(timer);
    });
}

function start_timer(timer_el) {
    let time = 30;
    timer_el.textContent = time;
    
    const interval = setInterval(() => {
        time--;
        timer_el.textContent = time;
        
        if (time <= 10) {
            const redIntensity = Math.max(255, 255 * (10 - time) / 10);
            timer_el.style.background = `linear-gradient(to right, rgb(${redIntensity}, ${150 - time * 10}, 48), rgb(255, ${150 - time * 10}, 0))`;
        }
        
        if (time === 0) {
            clearInterval(interval);
            
            const code_digits = timer_el.previousElementSibling;
            
            code_digits.style.transition = 'opacity 0.3s ease';
            code_digits.style.opacity = '0';
            
            setTimeout(() => {
                code_digits.textContent = generate_random_code();
                code_digits.style.opacity = '1';
                
                timer_el.style.background = 'linear-gradient(to right, var(--primary-color), var(--secondary-color))';
                start_timer(timer_el);
            }, 300);
        }
    }, 1000);
}

function generate_random_code() {
    const code1 = Math.floor(100 + Math.random() * 900);
    const code2 = Math.floor(100 + Math.random() * 900);
    return `${code1} ${code2}`;
}

function generate_new_codes() {
    setInterval(() => {
        const code_digits = document.querySelectorAll('.code_digits');
        code_digits.forEach(code => {
            code.style.transition = 'opacity 0.4s ease';
            code.style.opacity = '0';
            
            setTimeout(() => {
                code.textContent = generate_random_code();
                code.style.opacity = '1';
            }, 400);
        });
    }, 30000);
}

function show_notification(message) {
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

email_input.value = demo_email;
password_input.value = demo_password;