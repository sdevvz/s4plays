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
    |
    */

    'copy_files' => true,

    /*
    |--------------------------------------------------------------------------
    | Build Directory
    |--------------------------------------------------------------------------
    |
    | The build directory (from Vite) that should be copied to the static site.
    |
    */

    'build_directory' => public_path('build'),

    /*
    |--------------------------------------------------------------------------
    | Additional Files and Directories
    |--------------------------------------------------------------------------
    |
    | Specify any files or directories that should be copied to the
    | destination directory. Provide the path relative to the public
    | directory as the key, and the destination path as the value.
    |
    */

    'copy' => [
        'build' => 'build',
        'favicon.ico' => 'favicon.ico',
        'favicon.png' => 'favicon.png',
        // Add any other assets you need
    ],

    /*
    |--------------------------------------------------------------------------
    | Exclude URLs
    |--------------------------------------------------------------------------
    |
    | Specify any URLs that should not be generated as static pages.
    |
    */

    'exclude' => [
        // 'secret-page',
    ],

    /*
    |--------------------------------------------------------------------------
    | Glide Route
    |--------------------------------------------------------------------------
    |
    | Whether to generate the Glide route. This is required if you use
    | Glide to generate images. You'll need to set up a serverless
    | function or similar to handle image generation on-the-fly.
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
    |
    */

    'workers' => env('SSG_WORKERS', 1),

    /*
    |--------------------------------------------------------------------------
    | Extra URLs
    |--------------------------------------------------------------------------
    |
    | Here you may define a list of additional URLs to be generated,
    | such as manually created routes.
    |
    */

    'urls' => [
        // '/custom-route',
    ],

    /*
    |--------------------------------------------------------------------------
    | Before Generate Callback
    |--------------------------------------------------------------------------
    |
    | This callback is fired before generating the site. You can use it
    | to prepare your site, such as clearing caches.
    |
    */

    'before' => function () {
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
    },

    /*
    |--------------------------------------------------------------------------
    | After Generate Callback
    |--------------------------------------------------------------------------
    |
    | This callback is fired after generating the site. You can use it
    | to perform cleanup or additional processing.
    |
    */

    'after' => function ($paths) {
        // Log generated paths
        \Illuminate\Support\Facades\Log::info('SSG generated ' . count($paths) . ' pages');
    },

];