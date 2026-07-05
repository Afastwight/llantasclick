# LlantasClick

Proyecto web estático ordenado para subir a Vercel.

## Estructura

```text
llantasclick/
├── index.html
├── package.json
├── vercel.json
├── public/
└── src/
    ├── css/
    │   └── styles.css
    └── js/
        ├── main.js
        ├── data/
        │   └── modelos.js
        └── modules/
            ├── animations.js
            ├── cartFeedback.js
            ├── compatibilitySearch.js
            ├── modelSelector.js
            ├── navigation.js
            └── productFilters.js
```

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Subir a Vercel

1. Sube esta carpeta a GitHub.
2. En Vercel, importa el repositorio.
3. Vercel detectará Vite y usará `npm run build`.
4. La carpeta de salida será `dist`.
