import '../css/styles.css';
import { supabase } from './modules/supabaseClient.js';

const ordersList = document.getElementById('ordersList');
const ordersCount = document.getElementById('ordersCount');

async function loadOrders() {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    window.location.href = '/auth.html';
    return;
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    ordersList.innerHTML = `
      <div class="empty-state">
        <h3>Error al cargar pedidos</h3>
        <p>${error.message}</p>
      </div>
    `;
    return;
  }

  if (!orders || orders.length === 0) {
    if (ordersCount) ordersCount.textContent = '0';

    ordersList.innerHTML = `
      <div class="empty-state">
        <h3>Aún no tienes pedidos</h3>
        <p>Cuando realices una compra, tus pedidos aparecerán en esta sección.</p>
        <a href="/" class="btn-primary">Ver productos</a>
      </div>
    `;
    return;
  }

  if (ordersCount) ordersCount.textContent = orders.length;

  ordersList.innerHTML = orders.map((order) => {
    const total = Number(order.total || 0).toFixed(2);
    const date = new Date(order.created_at).toLocaleString('es-EC', {
      dateStyle: 'medium',
      timeStyle: 'short'
    });

    return `
      <article class="order-card">
        <div class="order-card-header">
          <div>
            <span class="order-label">Pedido</span>
            <h3>#${order.id}</h3>
          </div>

          <span class="order-status">${order.status || 'pagado'}</span>
        </div>

        <div class="order-info">
          <p><strong>Fecha:</strong> ${date}</p>
          <p><strong>Total:</strong> $${total}</p>
          <p><strong>Sesión Stripe:</strong> ${order.stripe_session_id || 'No registrada'}</p>
        </div>
      </article>
    `;
  }).join('');
}

loadOrders();