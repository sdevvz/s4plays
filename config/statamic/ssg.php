<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Base URL
    |--------------------------------------------------------------------------
    |
    | This informs the generator where the static site will eventually be hosted.
    | For instance, if you are relying on absolute URLs in your app, this one
    | will be used. It should be an absolute URL, eg. "http://my-app.com"
    |
    */

    'base_url' => env('APP_URL', 'http://localhost'),

    /*
    |--------------------------------------------------------------------------
    | Destination Directory
    |--------------------------------------------------------------------------
    |
    | This option defines where the static files will be saved.
    |
    */

    'destination' => storage_path('app/static'),

    /*
    |--------------------------------------------------------------------------
    | Files and Symlinks
    |--------------------------------------------------------------------------
    |
    | This option defines whether files should be copied or symlinked.
    | Symlinking is more performant, but may not work on all systems.
    | For deployment, always use 'copy'.
    |
    */

    'copy_files' => true,

    /*
    |--------------------------------------------------------------------------
    | Additional Files and Directories
    |--------------------------------------------------------------------------
    |
    | Specify any files or directories that should be copied to the
    | destination directory. Use public_path() for the source and 
    | provide the destination path as the value.
    |
    */

    'copy' => [
        // Vite Build Directory (CSS, JS, and other compiled assets) - CRITICAL!
        public_path('build') => 'build',
        
        // Favicons
        public_path('favicon.ico') => 'favicon.ico',
        public_path('favicon.png') => 'favicon.png',
        public_path('favicon.svg') => 'favicon.svg',
        
        // Apple Touch Icons
        public_path('apple-touch-icon.png') => 'apple-touch-icon.png',
        
        // Web Manifest
        public_path('site.webmanifest') => 'site.webmanifest',
        public_path('manifest.json') => 'manifest.json',
        
        // Robots and Sitemap
        public_path('robots.txt') => 'robots.txt',
        public_path('sitemap.xml') => 'sitemap.xml',
        
        // Additional asset directories
        public_path('assets') => 'assets',
        public_path('images') => 'images',
        public_path('fonts') => 'fonts',
        
        // Any other public files
        public_path('.htaccess') => '.htaccess',
        public_path('browserconfig.xml') => 'browserconfig.xml',
    ],

    /*
    |--------------------------------------------------------------------------
    | Exclude URLs
    |--------------------------------------------------------------------------
    |
    | Specify any URLs that should not be generated as static pages.
    | These are typically admin areas, API endpoints, or dynamic pages.
    |
    */

    'exclude' => [
        '/cp',
        '/cp/*',
        '!/cp',
        '/api/*',
        '/graphql',
        '/oauth/*',
        '/password/*',
        '/nocache/*',
    ],

    /*
    |--------------------------------------------------------------------------
    | Glide Route
    |--------------------------------------------------------------------------
    |
    | Whether to generate the Glide route. This is required if you use
    | Glide to generate images. For Netlify, set this to false and use
    | Netlify's image optimization or pre-generate all image sizes.
    |
    */

    'glide' => false,

    /*
    |--------------------------------------------------------------------------
    | Workers
    |--------------------------------------------------------------------------
    |
    | The number of concurrent workers to use when generating the site.
    | More workers = faster generation, but uses more memory.
    | Recommended: 4-8 workers for most sites.
    |
    */

    'workers' => env('SSG_WORKERS', 4),

    /*
    |--------------------------------------------------------------------------
    | Extra URLs
    |--------------------------------------------------------------------------
    |
    | Here you may define a list of additional URLs to be generated,
    | such as manually created routes that Statamic might not discover.
    |
    */

    'urls' => [
        '/404',
        '/404.html',
        // Add any custom routes here
        // '/custom-route',
        // '/api/data.json',
    ],

    /*
    |--------------------------------------------------------------------------
    | Before Generate Callback
    |--------------------------------------------------------------------------
    |
    | This callback is fired before generating the site. You can use it
    | to prepare your site, such as clearing caches or building assets.
    |
    */

    'before' => function () {
        // Clear all caches
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('view:clear');
        
        // Ensure build directory exists
        $buildPath = public_path('build');
        if (!file_exists($buildPath)) {
            \Illuminate\Support\Facades\Log::warning('Build directory not found. Run `npm run build` first.');
        }
        
        \Illuminate\Support\Facades\Log::info('Starting SSG generation...');
    },

    /*
    |--------------------------------------------------------------------------
    | After Generate Callback
    |--------------------------------------------------------------------------
    |
    | This callback is fired after generating the site. You can use it
    | to perform cleanup, additional processing, or create additional files.
    |
    */

    'after' => function ($paths) {
        $destination = storage_path('app/static');
        
        // Log generated pages
        \Illuminate\Support\Facades\Log::info('SSG generated ' . count($paths) . ' pages');
        
        // Create .nojekyll file (tells GitHub Pages not to use Jekyll)
        file_put_contents($destination . '/.nojekyll', '');
        \Illuminate\Support\Facades\Log::info('Created .nojekyll file for GitHub Pages');
        
        // Create CNAME file if custom domain is set
        $customDomain = env('GITHUB_PAGES_DOMAIN');
        if ($customDomain) {
            file_put_contents($destination . '/CNAME', $customDomain);
            \Illuminate\Support\Facades\Log::info('Created CNAME file: ' . $customDomain);
        }
        
        // Note: GitHub Pages doesn't support _redirects or _headers
        // 404 handling is done via 404.html file
        
        // Verify build directory was copied
        $buildDestination = $destination . '/build';
        if (file_exists($buildDestination)) {
            $buildFiles = count(glob($buildDestination . '/*'));
            \Illuminate\Support\Facades\Log::info("Build directory copied with {$buildFiles} files");
        } else {
            \Illuminate\Support\Facades\Log::error('Build directory NOT copied! Check your configuration.');
        }
        
        // Create a deployment info file
        $deployInfo = [
            'generated_at' => now()->toIso8601String(),
            'pages_count' => count($paths),
            'base_url' => config('statamic.ssg.base_url'),
            'php_version' => PHP_VERSION,
            'statamic_version' => \Statamic\Statamic::version(),
            'platform' => 'GitHub Pages',
        ];
        file_put_contents($destination . '/deploy-info.json', json_encode($deployInfo, JSON_PRETTY_PRINT));
        
        // Generate sitemap if not already present
        if (!file_exists($destination . '/sitemap.xml')) {
            \Illuminate\Support\Facades\Artisan::call('statamic:sitemap:generate');
            $sitemapSource = public_path('sitemap.xml');
            if (file_exists($sitemapSource)) {
                copy($sitemapSource, $destination . '/sitemap.xml');
                \Illuminate\Support\Facades\Log::info('Sitemap copied');
            }
        }
        
        \Illuminate\Support\Facades\Log::info('SSG generation completed successfully for GitHub Pages!');
    },

    /*
    |--------------------------------------------------------------------------
    | Sitemap
    |--------------------------------------------------------------------------
    |
    | Generate a sitemap.xml file.
    |
    */

    'sitemap' => [
        'enabled' => true,
        'url' => '/sitemap.xml',
    ],

];