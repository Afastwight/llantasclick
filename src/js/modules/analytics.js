window.dataLayer = window.dataLayer || [];

function push(payload) {
  window.dataLayer.push(payload);
}

export function trackViewItemList(products) {
  push({ ecommerce: null });
  push({
    event: 'view_item_list',
    ecommerce: {
      item_list_id: 'catalogo_principal',
      item_list_name: 'Catálogo Principal',
      items: products.map((p, index) => ({
        item_id: p.id,
        item_name: `${p.brand} ${p.name}`,
        item_brand: p.brand,
        item_category: p.spec,
        price: p.price,
        index
      }))
    }
  });
}

export function trackAddToCart(product, quantity = 1) {
  push({ ecommerce: null });
  push({
    event: 'add_to_cart',
    ecommerce: {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: `${product.brand} ${product.name}`,
        item_brand: product.brand,
        item_category: product.spec,
        price: product.price,
        quantity
      }]
    }
  });
}

export function trackRemoveFromCart(product, quantity = 1) {
  push({ ecommerce: null });
  push({
    event: 'remove_from_cart',
    ecommerce: {
      currency: 'USD',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: `${product.brand} ${product.name}`,
        item_brand: product.brand,
        item_category: product.spec,
        price: product.price,
        quantity
      }]
    }
  });
}

export function trackBeginCheckout(ga4Items, value) {
  push({ ecommerce: null });
  push({
    event: 'begin_checkout',
    ecommerce: {
      currency: 'USD',
      value,
      items: ga4Items
    }
  });
}

export function trackPurchase(transactionId, ga4Items, value) {
  push({ ecommerce: null });
  push({
    event: 'purchase',
    ecommerce: {
      transaction_id: transactionId,
      currency: 'USD',
      value,
      items: ga4Items
    }
  });
}

export function trackSearch(searchTerm) {
  push({
    event: 'search',
    search_term: searchTerm
  });
}
