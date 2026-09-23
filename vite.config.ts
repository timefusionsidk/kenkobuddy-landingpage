import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],base:'./',build:{target:'es2022',chunkSizeWarningLimit:1000,rollupOptions:{output:{manualChunks(id){if(id.replaceAll('\\','/').includes('/node_modules/three/'))return 'three-core';}}}}});
