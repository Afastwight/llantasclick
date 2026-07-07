import { supabase } from './supabaseClient.js';

export async function initAuthState() {
  const navAccount = document.getElementById('navAccount');

  if (!navAccount) return;

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    navAccount.innerHTML = `
      <a href="/auth.html" class="account-link">Mi cuenta</a>
    `;
    return;
  }

  const user = data.user;
  const name = user.user_metadata?.full_name || user.email;

  navAccount.innerHTML = `
    <div class="account-logged">
      <span>${name}</span>
      <a href="/perfil.html">Perfil</a>
      <button type="button" id="logoutHomeBtn">Salir</button>
    </div>
  `;

  document.getElementById('logoutHomeBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
  });
}