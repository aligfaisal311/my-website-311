import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                research: resolve(__dirname, 'research.html'),
                publications: resolve(__dirname, 'publications.html'),
                teaching: resolve(__dirname, 'teaching.html'),
                contact: resolve(__dirname, 'contact.html'),
                ai: resolve(__dirname, 'ai-integration.html'),
                virtual: resolve(__dirname, 'virtual-lab.html'),
                reynolds: resolve(__dirname, 'reynolds-lab.html'),
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    base: './', // Use relative paths for GitHub Pages compatibility
});
