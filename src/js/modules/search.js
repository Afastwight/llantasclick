import { trackSearch } from './analytics.js';

export function initProductSearch() {
  const searchInput = document.getElementById('productSearch');
  const products = document.querySelectorAll('.product-card');
  const productsGrid = document.querySelector('.products-grid');

  if (!searchInput || products.length === 0 || !productsGrid) return;

  let emptyMessage = document.getElementById('emptySearchMessage');

  if (!emptyMessage) {
    emptyMessage = document.createElement('div');
    emptyMessage.id = 'emptySearchMessage';
    emptyMessage.className = 'empty-search-message';
    emptyMessage.innerHTML = `
      <h3>No encontramos resultados</h3>
      <p>Intenta buscar por marca, medida, tipo de vehículo o modelo de llanta.</p>
    `;
    productsGrid.after(emptyMessage);
  }

  emptyMessage.style.display = 'none';

  let searchTimer;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    products.forEach((product) => {
      const brand = product.querySelector('.product-brand')?.textContent.toLowerCase() || '';
      const name = product.querySelector('.product-name')?.textContent.toLowerCase() || '';
      const spec = product.querySelector('.product-spec')?.textContent.toLowerCase() || '';
      const category = product.dataset.cat?.toLowerCase() || '';

      const matches =
        brand.includes(term) ||
        name.includes(term) ||
        spec.includes(term) ||
        category.includes(term);

      product.style.display = matches ? '' : 'none';

      if (matches) visibleCount++;
    });

    emptyMessage.style.display = visibleCount === 0 ? 'block' : 'none';

    clearTimeout(searchTimer);
    if (term.length >= 3) {
      searchTimer = setTimeout(() => trackSearch(term), 1000);
    }
  });
}