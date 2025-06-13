if (!sessionStorage.getItem('authenticodr_loggedIn')) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const accountsContainer = document.getElementById('accountsContainer');
    const addAccountModal = document.getElementById('addAccountModal');
    const accountInfoModal = document.getElementById('accountInfoModal');
    const accountForm = document.getElementById('accountForm');
    const modalIssuer = document.getElementById('modalIssuer');
    const modalAccount = document.getElementById('modalAccount');
    const modalSecretKey = document.getElementById('modalSecretKey');
    const modalTokenCode = document.getElementById('modalTokenCode');
    const deleteAccountBtn = document.getElementById('deleteAccount');
    const themeToggle = document.getElementById('themeToggle');
    
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.body.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') themeToggle.checked = true;
    
    themeToggle.addEventListener('change', function() {
        const newTheme = this.checked ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    let accounts = JSON.parse(localStorage.getItem('authenticodr_accounts')) || [];
    let currentAccountId = null;
    
    function init() {
        renderAccounts();
        initProgressBars();
    }
    
    function renderAccounts() {
        accountsContainer.innerHTML = '';
        accounts.forEach(account => addAccountToDOM(account));
        addAddAccountButton();
    }
    
    function addAccountToDOM(account) {
        const accountWindow = document.createElement('div');
        accountWindow.className = 'account-window';
        accountWindow.dataset.id = account.id;
        accountWindow.innerHTML = `
            <div class="account-header">
                <span class="token-issuer">${account.issuer}</span>
                <span class="token-account">${account.account}</span>
            </div>
            <div class="token-code">${generateTokenCode(account.secretKey)}</div>
            <div class="token-progress">
                <div class="progress-bar"></div>
            </div>
        `;
        accountWindow.addEventListener('click', () => showAccountInfo(account.id));
        accountsContainer.appendChild(accountWindow);
    }
    
    function addAddAccountButton() {
        const addAccountBtn = document.createElement('button');
        addAccountBtn.className = 'add-account-btn';
        addAccountBtn.innerHTML = '<i class="fas fa-plus"></i> Add Account';
        addAccountBtn.addEventListener('click', () => addAccountModal.style.display = 'block');
        accountsContainer.appendChild(addAccountBtn);
    }
    
    function showAccountInfo(id) {
        const account = accounts.find(acc => acc.id === id);
        if (account) {
            currentAccountId = id;
            modalIssuer.textContent = account.issuer;
            modalAccount.textContent = account.account;
            modalSecretKey.textContent = account.secretKey;
            modalTokenCode.textContent = generateTokenCode(account.secretKey);
            accountInfoModal.style.display = 'block';
        }
    }
    
    function generateTokenCode(secret) {
        const now = Math.floor(Date.now() / 30000);
        const code = Math.floor(100000 + (now % 900000));
        return `${code.toString().slice(0, 3)} ${code.toString().slice(3)}`;
    }
    
    function initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.transition = 'transform 30s linear';
            bar.style.transform = 'scaleX(0)';
        });
    }
    
    function updateTokens() {
        document.querySelectorAll('.account-window').forEach(accountEl => {
            const id = accountEl.dataset.id;
            const account = accounts.find(acc => acc.id === id);
            if (account) accountEl.querySelector('.token-code').textContent = generateTokenCode(account.secretKey);
        });
        
        if (currentAccountId && accountInfoModal.style.display === 'block') {
            const account = accounts.find(acc => acc.id === currentAccountId);
            if (account) modalTokenCode.textContent = generateTokenCode(account.secretKey);
        }
        
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.style.transition = 'none';
            bar.style.transform = 'scaleX(1)';
            void bar.offsetWidth;
            bar.style.transition = 'transform 30s linear';
            bar.style.transform = 'scaleX(0)';
        });
    }
    
    accountForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const issuer = document.getElementById('issuer').value;
        const account = document.getElementById('account').value;
        const secretKey = document.getElementById('secretKey').value;
        const newAccount = { id: Date.now().toString(), issuer, account, secretKey };
        accounts.push(newAccount);
        localStorage.setItem('authenticodr_accounts', JSON.stringify(accounts));
        renderAccounts();
        addAccountModal.style.display = 'none';
        accountForm.reset();
    });
    
    deleteAccountBtn.addEventListener('click', function() {
        if (currentAccountId) {
            accounts = accounts.filter(account => account.id !== currentAccountId);
            localStorage.setItem('authenticodr_accounts', JSON.stringify(accounts));
            renderAccounts();
            accountInfoModal.style.display = 'none';
            currentAccountId = null;
        }
    });
    
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            addAccountModal.style.display = 'none';
            accountInfoModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === addAccountModal) addAccountModal.style.display = 'none';
        if (e.target === accountInfoModal) accountInfoModal.style.display = 'none';
    });
    
    init();
    setInterval(updateTokens, 30000);
    setInterval(() => {
        const now = new Date();
        const seconds = now.getSeconds();
        const progress = (30 - (seconds % 30)) / 30 * 100;
        document.querySelectorAll('.progress-bar').forEach(bar => {
            if (!bar.style.transition || bar.style.transition.includes('none')) return;
            bar.style.transform = `scaleX(${progress / 100})`;
        });
    }, 1000);
});