document.addEventListener('DOMContentLoaded', () => {
    const ACCOUNTS_KEY = 'authenticatorAccounts';
    const accountsContainer = document.getElementById('accountsContainer');
    const addAccountBtn = document.getElementById('addAccountBtn');
    const addAccountModal = document.getElementById('addAccountModal');
    const closeAccountModal = document.getElementById('closeAccountModal');
    const addAccountForm = document.getElementById('addAccountForm');
    const accountNameInput = document.getElementById('accountName');
    const accountTypeSelect = document.getElementById('accountType');
    const secretKeyInput = document.getElementById('secretKey');
    let globalTimerInterval;

    function loadAccounts() {
        const accountsJSON = localStorage.getItem(ACCOUNTS_KEY);
        return accountsJSON ? JSON.parse(accountsJSON) : [];
    }

    function saveAccounts(accounts) {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }

    function generateRandomCode() {
        return Array.from({length: 6}, () => Math.floor(Math.random() * 10));
    }

    function generateTOTP(secret) {
        if (!secret) return generateRandomCode();
        const time = Math.floor(Date.now() / 30000);
        let hash = 0;
        for (let i = 0; i < secret.length; i++) {
            hash = (hash << 5) - hash + secret.charCodeAt(i);
            hash |= 0;
        }
        const combined = Math.abs(hash + time);
        const code = combined % 1000000;
        return code.toString().padStart(6, '0').split('').map(Number);
    }

    function createAccountCard(account, index) {
        const code = generateTOTP(account.secretKey);
        return `
            <div class="account-card" data-id="${index}">
                <div class="account-header">
                    <div class="account-icon"><i class="fab fa-${account.type}"></i></div>
                    <div class="account-name">${account.name}</div>
                    <button class="delete-account" data-id="${index}"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="account-code">${code.map(digit => `<span>${digit}</span>`).join('')}</div>
                <div class="account-timer">
                    <div class="timer-bar"></div>
                    <div class="timer-text">30s remaining</div>
                </div>
                <div class="account-actions">
                    <button class="copy-account-code" data-id="${index}"><i class="fas fa-copy"></i> Copy</button>
                    <button class="refresh-account-code" data-id="${index}"><i class="fas fa-sync-alt"></i> Refresh</button>
                </div>
            </div>
        `;
    }

    function updateAllTimers() {
        const timeLeft = 30 - Math.floor(Date.now() / 1000) % 30;
        const percent = (timeLeft / 30) * 100;
        document.documentElement.style.setProperty('--timer-width', `${percent}%`);
        document.querySelectorAll('.timer-text').forEach(el => el.textContent = `${timeLeft}s remaining`);
        if (timeLeft === 30) refreshAllCodes();
    }

    function refreshAllCodes() {
        const accounts = loadAccounts();
        accounts.forEach((account, index) => {
            const card = document.querySelector(`.account-card[data-id="${index}"]`);
            if (card) {
                const code = generateTOTP(account.secretKey);
                const codeSpans = card.querySelectorAll('.account-code span');
                codeSpans.forEach((span, i) => span.textContent = code[i]);
            }
        });
    }

    function renderAccounts() {
        const accounts = loadAccounts();
        accountsContainer.innerHTML = accounts.length ? '' : `
            <div class="empty-state">
                <i class="fas fa-key"></i>
                <h3>No Accounts Added</h3>
                <p>Click "Add Account" to get started with your authenticator</p>
            </div>
        `;
        
        accounts.forEach((account, index) => {
            accountsContainer.innerHTML += createAccountCard(account, index);
        });
        
        document.querySelectorAll('.delete-account').forEach(btn => 
            btn.addEventListener('click', () => deleteAccount(parseInt(btn.dataset.id)))
        );
        
        document.querySelectorAll('.copy-account-code').forEach(btn => 
            btn.addEventListener('click', () => copyAccountCode(parseInt(btn.dataset.id)))
        );
        
        document.querySelectorAll('.refresh-account-code').forEach(btn => 
            btn.addEventListener('click', () => refreshAccountCode(parseInt(btn.dataset.id)))
        );
    }

    function addAccount(e) {
        e.preventDefault();
        const name = accountNameInput.value.trim();
        const type = accountTypeSelect.value;
        const secretKey = secretKeyInput.value.trim();
        
        if (!name || !secretKey) return alert('Please fill in all fields');
        
        const newAccount = {
            id: Date.now(),
            name,
            type,
            secretKey,
            createdAt: new Date().toISOString()
        };
        
        const accounts = loadAccounts();
        accounts.push(newAccount);
        saveAccounts(accounts);
        addAccountForm.reset();
        addAccountModal.style.display = 'none';
        renderAccounts();
    }

    function deleteAccount(id) {
        if (!confirm('Are you sure you want to delete this account?')) return;
        const accounts = loadAccounts();
        accounts.splice(id, 1);
        saveAccounts(accounts);
        renderAccounts();
    }

    function copyAccountCode(id) {
        const accounts = loadAccounts();
        if (id >= 0 && id < accounts.length) {
            const card = document.querySelector(`.account-card[data-id="${id}"]`);
            const code = Array.from(card.querySelectorAll('.account-code span'))
                .map(span => span.textContent).join('');
            
            navigator.clipboard.writeText(code).then(() => {
                const btn = card.querySelector('.copy-account-code');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(() => btn.innerHTML = originalText, 2000);
            });
        }
    }

    function refreshAccountCode(id) {
        const accounts = loadAccounts();
        if (id >= 0 && id < accounts.length) {
            const card = document.querySelector(`.account-card[data-id="${id}"]`);
            const code = generateRandomCode();
            const codeSpans = card.querySelectorAll('.account-code span');
            codeSpans.forEach((span, i) => span.textContent = code[i]);
            
            const btn = card.querySelector('.refresh-account-code');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Refreshed!';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        }
    }

    function initAccounts() {
        addAccountBtn.addEventListener('click', () => addAccountModal.style.display = 'flex');
        closeAccountModal.addEventListener('click', () => addAccountModal.style.display = 'none');
        window.addEventListener('click', e => e.target === addAccountModal && (addAccountModal.style.display = 'none'));
        addAccountForm.addEventListener('submit', addAccount);
        renderAccounts();
        clearInterval(globalTimerInterval);
        globalTimerInterval = setInterval(updateAllTimers, 1000);
        updateAllTimers();
    }

    initAccounts();
});