import '../css/styles.css';
import { supabase } from './modules/supabaseClient.js';

const ordersList = document.getElementById('ordersList');

async function loadOrders() {
  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    window.location.href = '/auth.html';
    return;
  }

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userData.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    ordersList.innerHTML = `<p>Error al cargar pedidos: ${error.message}</p>`;
    return;
  }

  if (!orders || orders.length === 0) {
    ordersList.innerHTML = '<p>Aún no tienes pedidos registrados.</p>';
    return;
  }

  ordersList.innerHTML = orders.map((order) => `
    <div class="order-card">
      <h3>Pedido #${order.id}</h3>
      <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleString()}</p>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
      <p><strong>Estado:</strong> ${order.status}</p>
    </div>
  `).join('');
}

loadOrders();