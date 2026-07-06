import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        success: resolve(__dirname, 'success.html'),
        cancel: resolve(__dirname, 'cancel.html'),
      
        auth: resolve(__dirname, 'auth.html'),
        perfil: resolve(__dirname, 'perfil.html'),
        historial: resolve(__dirname, 'historial.html'),

        privacidad: resolve(__dirname, 'privacidad.html'),
        terminos: resolve(__dirname, 'terminos.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        devoluciones: resolve(__dirname, 'devoluciones.html'),
        proteccionDatos: resolve(__dirname, 'proteccion-datos.html')
        
      }
    }
  }
});