import '../css/styles.css';
import { supabase } from './modules/supabaseClient.js';

const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const message = document.getElementById('authMessage');

loginTab?.addEventListener('click', () => {
  loginTab.classList.add('active');
  registerTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  registerForm.classList.add('hidden');
});

registerTab?.addEventListener('click', () => {
  registerTab.classList.add('active');
  loginTab.classList.remove('active');
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  window.location.href = '/perfil.html';
});

registerForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name
      }
    }
  });

  if (error) {
    message.textContent = error.message;
    return;
  }

  message.textContent = 'Cuenta creada. Revisa tu correo para confirmar el registro.';
});

document.getElementById('resetPasswordBtn')?.addEventListener('click', async () => {
  const email = document.getElementById('loginEmail').value;

  if (!email) {
    message.textContent = 'Ingresa tu correo para recuperar la contraseña.';
    return;
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth.html`
  });

  message.textContent = error
    ? error.message
    : 'Te enviamos un enlace de recuperación al correo.';
});