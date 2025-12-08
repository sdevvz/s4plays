import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/site.css', 'resources/js/site.js'],
            refresh: true,
        }),
        tailwindcss(),
        
    ],
        // IMPORTANT: Set base path for GitHub Pages
    // Change 'z4plays' to your repository name
    base: process.env.NODE_ENV === 'production' ? '/z4plays/' : '/',

});
