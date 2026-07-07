import '../css/styles.css';
import { supabase } from './modules/supabaseClient.js';

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const message = document.getElementById('authMessage');

function showMessage(text, type = 'error') {
  if (!message) return;

  message.textContent = text;
  message.className = type === 'success' ? 'auth-message success' : 'auth-message error';
}

loginTab?.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
  showMessage('');
});

registerTab?.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  showMessage('');
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  window.location.href = '/perfil.html';
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const password = document.getElementById('registerPassword').value;
  const termsAccepted = document.getElementById('termsAccepted').checked;

  if (!termsAccepted) {
    showMessage('Debes aceptar los términos y condiciones para crear una cuenta.');
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        terms_accepted: termsAccepted
      }
    }
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  const user = data.user;

  if (!user) {
    showMessage('Cuenta creada. Revisa tu correo para confirmar el registro.', 'success');
    return;
  }

  

  showMessage('Cuenta creada correctamente. Revisa tu correo para confirmar el registro.', 'success');
});

document.getElementById('resetPasswordBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value.trim();

  if (!email) {
    showMessage('Ingresa tu correo para recuperar la contraseña.');
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth.html`
  });

  if (error) {
    showMessage(error.message);
    return;
  }

  showMessage('Te enviamos un enlace de recuperación al correo.', 'success');
});