// accounts.js - Account management functionality

// Account storage key
const ACCOUNTS_KEY = 'authenticatorAccounts';

// DOM elements
const accountsContainer = document.getElementById('accountsContainer');
const addAccountBtn = document.getElementById('addAccountBtn');
const addAccountModal = document.getElementById('addAccountModal');
const closeAccountModal = document.getElementById('closeAccountModal');
const addAccountForm = document.getElementById('addAccountForm');
const accountNameInput = document.getElementById('accountName');
const accountTypeSelect = document.getElementById('accountType');
const secretKeyInput = document.getElementById('secretKey');

// Global timer interval
let globalTimerInterval;

// Load accounts from localStorage
function loadAccounts() {
    const accountsJSON = localStorage.getItem(ACCOUNTS_KEY);
    return accountsJSON ? JSON.parse(accountsJSON) : [];
}

// Save accounts to localStorage
function saveAccounts(accounts) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

// Generate a random 6-digit code
function generateCode() {
    return Array.from({length: 6}, () => Math.floor(Math.random() * 10));
}

// Generate a TOTP-like code (simplified)
function generateTOTP(secret) {
    if (!secret) return generateCode();
    
    // Simple hash function for demo purposes
    const time = Math.floor(Date.now() / 30000);
    let hash = 0;
    for (let i = 0; i < secret.length; i++) {
        hash = (hash << 5) - hash + secret.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    
    // Combine with time
    const combined = Math.abs(hash + time);
    const code = combined.toString().padStart(6, '0').slice(-6).split('');
    return code.map(Number);
}

// Create account card HTML
function createAccountCard(account, index) {
    const code = account.currentCode || generateTOTP(account.secretKey);
    
    return `
        <div class="account-card" data-id="${index}">
            <div class="account-header">
                <div class="account-icon">
                    <i class="fab fa-${account.type}"></i>
                </div>
                <div class="account-name">${account.name}</div>
                <button class="delete-account" data-id="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
            
            <div class="account-code">
                ${code.map(digit => `<span>${digit}</span>`).join('')}
            </div>
            
            <div class="account-timer">
                <div class="timer-bar"></div>
                <div class="timer-text">30s remaining</div>
            </div>
            
            <div class="account-actions">
                <button class="copy-account-code" data-id="${index}">
                    <i class="fas fa-copy"></i> Copy
                </button>
                <button class="refresh-account-code" data-id="${index}">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
            </div>
        </div>
    `;
}

// Update timer for all accounts
function updateAllTimers() {
    const timeLeft = 30 - Math.floor(Date.now() / 1000) % 30;
    const percent = (timeLeft / 30) * 100;
    
    document.documentElement.style.setProperty('--timer-width', `${percent}%`);
    
    document.querySelectorAll('.timer-text').forEach(el => {
        el.textContent = `${timeLeft}s remaining`;
    });
    
    // Update codes when timer resets
    if (timeLeft === 30) {
        refreshAllCodes();
    }
}

// Refresh all account codes
function refreshAllCodes() {
    const accounts = loadAccounts();
    accounts.forEach((account, index) => {
        account.currentCode = generateTOTP(account.secretKey);
        const card = document.querySelector(`.account-card[data-id="${index}"]`);
        if (card) {
            const code = account.currentCode;
            const codeSpans = card.querySelectorAll('.account-code span');
            codeSpans.forEach((span, i) => {
                span.textContent = code[i];
            });
        }
    });
}

// Render all accounts
function renderAccounts() {
    const accounts = loadAccounts();
    accountsContainer.innerHTML = '';
    
    if (accounts.length === 0) {
        accountsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-key"></i>
                <h3>No Accounts Added</h3>
                <p>Click "Add Account" to get started with your authenticator</p>
            </div>
        `;
        return;
    }
    
    accounts.forEach((account, index) => {
        accountsContainer.innerHTML += createAccountCard(account, index);
    });
    
    // Add event listeners to new elements
    document.querySelectorAll('.delete-account').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            deleteAccount(id);
        });
    });
    
    document.querySelectorAll('.copy-account-code').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            copyAccountCode(id);
        });
    });
    
    document.querySelectorAll('.refresh-account-code').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            refreshAccountCode(id);
        });
    });
}

// Add a new account
function addAccount(e) {
    e.preventDefault();
    
    const name = accountNameInput.value.trim();
    const type = accountTypeSelect.value;
    const secretKey = secretKeyInput.value.trim();
    
    if (!name || !secretKey) {
        alert('Please fill in all fields');
        return;
    }
    
    const newAccount = {
        id: Date.now(),
        name,
        type,
        secretKey,
        createdAt: new Date().toISOString(),
        currentCode: generateTOTP(secretKey)
    };
    
    const accounts = loadAccounts();
    accounts.push(newAccount);
    saveAccounts(accounts);
    
    // Reset form
    addAccountForm.reset();
    
    // Close modal
    addAccountModal.style.display = 'none';
    
    // Re-render accounts
    renderAccounts();
}

// Delete an account
function deleteAccount(id) {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    const accounts = loadAccounts();
    accounts.splice(id, 1);
    saveAccounts(accounts);
    renderAccounts();
}

// Copy account code to clipboard
function copyAccountCode(id) {
    const accounts = loadAccounts();
    if (id >= 0 && id < accounts.length) {
        const card = document.querySelector(`.account-card[data-id="${id}"]`);
        const code = Array.from(card.querySelectorAll('.account-code span'))
            .map(span => span.textContent)
            .join('');
        
        navigator.clipboard.writeText(code).then(() => {
            const btn = card.querySelector('.copy-account-code');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
}

// Refresh account code
function refreshAccountCode(id) {
    const accounts = loadAccounts();
    if (id >= 0 && id < accounts.length) {
        const card = document.querySelector(`.account-card[data-id="${id}"]`);
        const code = generateTOTP(accounts[id].secretKey);
        
        // Update code display
        const codeSpans = card.querySelectorAll('.account-code span');
        codeSpans.forEach((span, index) => {
            span.textContent = code[index];
        });
        
        // Show feedback
        const btn = card.querySelector('.refresh-account-code');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Refreshed!';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
        }, 2000);
    }
}

// Initialize account functionality
function initAccounts() {
    // Event listeners
    addAccountBtn.addEventListener('click', () => {
        addAccountModal.style.display = 'flex';
    });
    
    closeAccountModal.addEventListener('click', () => {
        addAccountModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === addAccountModal) {
            addAccountModal.style.display = 'none';
        }
    });
    
    addAccountForm.addEventListener('submit', addAccount);
    
    // Initial render
    renderAccounts();
    
    // Start global timer
    clearInterval(globalTimerInterval);
    globalTimerInterval = setInterval(updateAllTimers, 1000);
    updateAllTimers();
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initAccounts);