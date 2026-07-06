export function initProductSearch() {
  const searchInput = document.getElementById('productSearch');
  const products = document.querySelectorAll('.product-card');

  if (!searchInput || products.length === 0) return;

  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase().trim();

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
    });
  });
}