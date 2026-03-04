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
                webbook: resolve(__dirname, 'web-book.html'),
                fm_res: resolve(__dirname, 'fluid-mechanics-resources.html'),
                cfd_res: resolve(__dirname, 'cfd-resources.html'),
                ht_res: resolve(__dirname, 'heat-transfer-resources.html'),
                td_res: resolve(__dirname, 'thermodynamics-resources.html'),
                ansys_res: resolve(__dirname, 'ansys-resources.html'),
                aero_res: resolve(__dirname, 'aerodynamics-resources.html'),
                graph_res: resolve(__dirname, 'graphics-resources.html'),
                sw_res: resolve(__dirname, 'solidworks-resources.html'),
                print_res: resolve(__dirname, '3d-printing-resources.html'),
                work_res: resolve(__dirname, 'workshop-resources.html'),
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    base: './', // Use relative paths for GitHub Pages compatibility
});
