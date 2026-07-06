export function initCartFeedback() {
  document.querySelectorAll('.product-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const originalText = button.textContent;

      button.textContent = '✓ Agregado';
      button.style.background = '#1a7a3a';

      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    });
  });
}
