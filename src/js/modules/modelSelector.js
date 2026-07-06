import { modelosPorMarca } from '../data/modelos.js';

export function initModelSelector() {
  const selects = document.querySelectorAll('.form-select');
  const marcaSelect = selects[0];
  const modeloSelect = selects[1];

  if (!marcaSelect || !modeloSelect) return;

  marcaSelect.addEventListener('change', () => {
    const marca = marcaSelect.value;
    const modelos = modelosPorMarca[marca];

    modeloSelect.innerHTML = modelos
      ? modelos.map((modelo) => `<option>${modelo}</option>`).join('')
      : '<option>Selecciona el modelo...</option>';
  });
}
