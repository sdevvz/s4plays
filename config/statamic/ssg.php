<?php

return [

    'base_url' => env('APP_URL', 'http://localhost'),

    'destination' => storage_path('app/static'),

    'copy_files' => true,

    'copy' => [
        // Vite build (CRITICAL!)
        public_path('build') => 'build',
        
        // Favicons
        public_path('favicon.ico') => 'favicon.ico',
        public_path('favicon.png') => 'favicon.png',
        
        // SEO
        public_path('robots.txt') => 'robots.txt',
        public_path('sitemap.xml') => 'sitemap.xml',
        
        // Assets (if you have them)
        public_path('assets') => 'assets',
        public_path('images') => 'images',
    ],

    'exclude' => [
        '/cp',
        '/cp/*',
    ],

    'glide' => false,

    'workers' => 4,

    'urls' => [
        '/404',
    ],

    'before' => function () {
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
    },

    'after' => function ($paths) {
        $destination = storage_path('app/static');
        
        // GitHub Pages: Create .nojekyll
        file_put_contents($destination . '/.nojekyll', '');
        
        \Illuminate\Support\Facades\Log::info('SSG: Generated ' . count($paths) . ' pages');
    },

];