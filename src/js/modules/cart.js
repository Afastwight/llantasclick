import { supabase } from './supabaseClient.js';
import { trackAddToCart, trackRemoveFromCart, trackBeginCheckout, trackViewItemList } from './analytics.js';

const CART_KEY = 'llantasclick_cart';

const productCatalog = {
  'michelin-primacy-4': {
    id: 'michelin-primacy-4',
    brand: 'Michelin',
    name: 'Primacy 4+',
    spec: '205/55 R16 · Sedán · Alto rendimiento',
    price: 155
  },
  'bridgestone-dueler-hp': {
    id: 'bridgestone-dueler-hp',
    brand: 'Bridgestone',
    name: 'Dueler H/P Sport',
    spec: '235/65 R17 · SUV · Carretera',
    price: 198
  },
  'pirelli-pzero-pz4': {
    id: 'pirelli-pzero-pz4',
    brand: 'Pirelli',
    name: 'P Zero PZ4',
    spec: '225/40 R18 · Sport · UHP',
    price: 242
  },
  'continental-premiumcontact-7': {
    id: 'continental-premiumcontact-7',
    brand: 'Continental',
    name: 'PremiumContact 7',
    spec: '195/65 R15 · Sedán · Confort',
    price: 130
  },
  'goodyear-wrangler-at': {
    id: 'goodyear-wrangler-at',
    brand: 'Goodyear',
    name: 'Wrangler AT Adventure',
    spec: '265/70 R17 · SUV · All-Terrain',
    price: 224
  },
  'michelin-xze-2': {
    id: 'michelin-xze-2',
    brand: 'Michelin',
    name: 'XZE 2+ Radial',
    spec: '295/80 R22.5 · Comercial · Larga distancia',
    price: 480
  }
};

function getCart() {
  const savedCart = localStorage.getItem(CART_KEY);
  return savedCart ? JSON.parse(savedCart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function getCartTotal(cart) {
  return cart.reduce((total, item) => {
    const product = productCatalog[item.id];
    if (!product) return total;
    return total + product.price * item.quantity;
  }, 0);
}

function getCartCount(cart) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
}

function renderCart() {
  const cart = getCart();

  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cartItems || !cartCount || !cartTotal || !checkoutBtn) return;

  cartCount.textContent = getCartCount(cart);
  cartTotal.textContent = formatMoney(getCartTotal(cart));
  checkoutBtn.disabled = cart.length === 0;

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío.</p>';
    return;
  }

  cartItems.innerHTML = cart.map((item) => {
    const product = productCatalog[item.id];

    if (!product) return '';

    return `
      <div class="cart-item">
        <div>
          <div class="cart-item-name">${product.brand} ${product.name}</div>
          <div class="cart-item-meta">${product.spec}</div>

          <div class="cart-item-actions">
            <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
            <button class="remove-btn" data-action="remove" data-id="${item.id}">Eliminar</button>
          </div>
        </div>

        <div class="cart-item-price">
          ${formatMoney(product.price * item.quantity)}
        </div>
      </div>
    `;
  }).join('');
}

function addToCart(productId) {
  const product = productCatalog[productId];

  if (!product) {
    alert('Producto no encontrado.');
    return;
  }

  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productId,
      quantity: 1
    });
  }

  saveCart(cart);
  renderCart();
  openCart();
  trackAddToCart(product);
}

function updateQuantity(productId, action) {
  const cart = getCart();
  const item = cart.find((cartItem) => cartItem.id === productId);

  if (!item) return;

  if (action === 'increase') {
    item.quantity += 1;
  }

  if (action === 'decrease') {
    item.quantity -= 1;
  }

  const updatedCart = cart.filter((cartItem) => cartItem.quantity > 0);

  saveCart(updatedCart);
  renderCart();
}

function removeFromCart(productId) {
  const cart = getCart();
  const item = cart.find((i) => i.id === productId);
  const product = productCatalog[productId];

  if (item && product) {
    trackRemoveFromCart(product, item.quantity);
  }

  const updatedCart = cart.filter((i) => i.id !== productId);
  saveCart(updatedCart);
  renderCart();
}

function createWhatsAppOrder() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  const lines = cart.map((item) => {
    const product = productCatalog[item.id];
    return `• ${product.brand} ${product.name} - ${product.spec} x${item.quantity} = ${formatMoney(product.price * item.quantity)}`;
  });

  const total = formatMoney(getCartTotal(cart));

  const message = `
Hola, deseo cotizar/comprar las siguientes llantas:

${lines.join('\n')}

Total aproximado: ${total}
  `.trim();

  const phone = '593997963005';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  window.open(url, '_blank');
}

async function checkout() {
  const cart = getCart();

  if (cart.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  const checkoutBtn = document.getElementById('checkoutBtn');

  try {
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Procesando...';

    const ga4Items = cart.map((item) => {
      const p = productCatalog[item.id];
      return {
        item_id: p.id,
        item_name: `${p.brand} ${p.name}`,
        item_brand: p.brand,
        item_category: p.spec,
        price: p.price,
        quantity: item.quantity
      };
    });
    const cartValue = getCartTotal(cart);
    trackBeginCheckout(ga4Items, cartValue);
    localStorage.setItem('llantasclick_pending_purchase', JSON.stringify({ items: ga4Items, value: cartValue }));

    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      alert('Debes iniciar sesión antes de realizar una compra.');
      window.location.href = '/auth.html';
      return;
    }

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        cart,
        userId: userData.user.id,
        userEmail: userData.user.email
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo crear la sesión de pago.');
    }

    window.location.href = data.url;
  } catch (error) {
    alert(error.message);
  } finally {
    checkoutBtn.disabled = false;
    checkoutBtn.textContent = 'Pagar ahora';
  }
}

export function initCart() {
  document.querySelectorAll('.product-card .product-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const productCard = button.closest('.product-card');
      const productId = productCard?.dataset.productId;

      addToCart(productId);
    });
  });

  document.getElementById('cartToggle')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', checkout);
  document.getElementById('whatsappOrderBtn')?.addEventListener('click', createWhatsAppOrder);

  document.getElementById('cartItems')?.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    const productId = button.dataset.id;
    const action = button.dataset.action;

    if (action === 'increase' || action === 'decrease') {
      updateQuantity(productId, action);
    }

    if (action === 'remove') {
      removeFromCart(productId);
    }
  });

  renderCart();
  trackViewItemList(Object.values(productCatalog));
}