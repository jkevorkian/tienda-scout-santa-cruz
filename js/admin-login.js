const ADMIN_PASSWORD = "pochoVive2025"; // Cambia esto por una contraseña segura

const loginForm = document.getElementById('login-form');
const loginContainer = document.getElementById('login-container');
const pedidosContent = document.getElementById('pedidos-content');
const loginError = document.getElementById('login-error');

function isLoggedIn() {
  return sessionStorage.getItem('adminLogged') === 'true';
}

function showPedidos() {
  loginContainer.style.display = 'none';
  pedidosContent.style.display = '';
}

function showLogin() {
  loginContainer.style.display = '';
  pedidosContent.style.display = 'none';
}

if (isLoggedIn()) {
  showPedidos();
} else {
  showLogin();
}

loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const pass = document.getElementById('admin-pass').value;
  if (pass === ADMIN_PASSWORD) {
    sessionStorage.setItem('adminLogged', 'true');
    showPedidos();
    loginError.style.display = 'none';
  } else {
    loginError.style.display = '';
  }
});