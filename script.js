const API_URL = 'https://script.google.com/macros/s/AKfycbyycCslQSIasyhy0QVU4KJh9xWhDHqJUrLIdFb4xiaKTU78IZ3TOpCoTgOTKGqOBtvv/exec'; // Substitua pelo seu URL
let currentUser = null;
let selectedNumber = null;
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}
function logout() {
    currentUser = null;
    showPage('home');
}
function forgotPassword() {
    alert('Funcionalidade em desenvolvimento. Entre em contato com o suporte.');
}
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const password = document.getElementById('regPassword').value;
    const phone = document.getElementById('regPhone').value.replace(/\D/g, '');
    if (password.length < 6) {
        alert('Senha deve ter pelo menos 6 caracteres.');
        return;
    }
    if (phone.length < 10 || phone.length > 11) {
        alert('Telefone deve ter 10 ou 11 dígitos.');
        return;
    }
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'register', name, email, password, phone })
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) showPage('home');
    } catch (error) {
        alert('Erro de conexão. Tente novamente.');
    }
});
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('logEmail').value.trim();
    const password = document.getElementById('logPassword').value.trim(); // Adicionei trim() aqui
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'login', email, password })
        });
        const result = await response.json();
        if (result.success) {
            currentUser = email;
            loadNumbers();
            showPage('numbers');
        } else {
            alert(result.message);
        }
    } catch (error) {
        alert('Erro de conexão. Verifique sua internet.');
    }
});
async function loadNumbers() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'getNumbers' })
        });
        const result = await response.json();
        const grid = document.getElementById('numberGrid');
        grid.innerHTML = '';
        for (let i = 1; i <= 100; i++) {
            const div = document.createElement('div');
            div.className = 'number';
            div.textContent = i;
            if (result.unavailable.includes(i)) div.classList.add('unavailable');
            else div.onclick = () => selectNumber(i);
            grid.appendChild(div);
        }
    } catch (error) {
        alert('Erro ao carregar números.');
    }
}
function selectNumber(num) {
    selectedNumber = num;
    document.getElementById('selectedNumber').textContent = num;
    showPage('payment');
}
async function confirmPurchase() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'notifyPurchase', email: currentUser, number: selectedNumber })
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            logout();
        }
    } catch (error) {
        alert('Erro ao processar compra.');
    }
}
