function filterProducts(button, category) {
  document.querySelectorAll('.filter-btn').forEach((item) => item.classList.remove('active'));
  button.classList.add('active');

  document.querySelectorAll('.product-card').forEach((card) => {
    const shouldShow = category === 'todos' || card.dataset.cat === category;
    card.style.display = shouldShow ? 'block' : 'none';

    if (shouldShow) {
      card.style.animation = 'fadeIn 0.4s ease both';
    }
  });
}

export function initProductFilters() {
  document.querySelectorAll('.filter-btn').forEach((button) => {
    button.addEventListener('click', () => {
      filterProducts(button, button.dataset.filter || 'todos');
    });
  });
}
