export function initCompatibilitySearch() {
  const button = document.querySelector('.search-btn');
  const catalogSection = document.getElementById('catalogo');

  if (!button || !catalogSection) return;

  button.addEventListener('click', () => {
    button.textContent = 'BUSCANDO...';
    button.style.background = '#555';

    setTimeout(() => {
      button.textContent = '✓ 48 LLANTAS COMPATIBLES ENCONTRADAS';
      button.style.background = '#1a7a3a';
      catalogSection.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => {
        button.textContent = 'BUSCAR LLANTAS COMPATIBLES →';
        button.style.background = '';
      }, 4000);
    }, 1200);
  });
}
