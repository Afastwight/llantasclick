import '../css/styles.css';
import { trackPurchase } from './modules/analytics.js';

const successMessage = document.getElementById('successMessage');

async function saveOrder() {
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');

  if (!sessionId) {
    successMessage.textContent = 'Pago completado, pero no se encontró el identificador de la sesión.';
    return;
  }

  try {
    const response = await fetch(`/api/save-order?session_id=${sessionId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo guardar el pedido.');
    }

    const pending = JSON.parse(localStorage.getItem('llantasclick_pending_purchase') || 'null');
    if (pending) {
      trackPurchase(sessionId, pending.items, pending.value);
    }

    localStorage.removeItem('llantasclick_cart');
    localStorage.removeItem('llantasclick_pending_purchase');

    successMessage.textContent = 'Tu pago fue confirmado y el pedido se guardó correctamente en tu historial.';
  } catch (error) {
    console.error(error);
    successMessage.textContent = error.message;
  }
}

saveOrder();