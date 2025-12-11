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
    build: {
        rollupOptions: {
            output: {
                // This correctly handles your JS entry: public/build/assets/site.js
                entryFileNames: 'assets/[name].js', 
                
                assetFileNames: (assetInfo) => {
                    // Check if the asset is a CSS file
                    if (assetInfo.name.endsWith('.css')) {
                        // We assume the main CSS is the only one here
                        // You can enforce a fixed name directly:
                        return 'assets/site.css'; 
                    }
                    
                    // Fallback for other assets (images, fonts, etc.), keeping the hash
                    return 'assets/[name]-[hash][extname]';
                },
                
                chunkFileNames: 'assets/[name]-[hash].js', 
            },
        },
    },
});