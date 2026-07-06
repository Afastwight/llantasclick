import '../css/styles.css';
import { supabase } from './modules/supabaseClient.js';

const profileInfo = document.getElementById('profileInfo');

async function loadProfile() {
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    window.location.href = '/auth.html';
    return;
  }

  profileInfo.innerHTML = `
    <p><strong>Nombre:</strong> ${data.user.user_metadata?.full_name || 'No registrado'}</p>
    <p><strong>Correo:</strong> ${data.user.email}</p>
    <p><strong>ID usuario:</strong> ${data.user.id}</p>
  `;
}

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = '/';
});

loadProfile();