<?php

/**
 * Final Statamic SSG config file
 * Save as: config/statamic/ssg.php
 *
 * Purpose: configuration tuned for static builds to GitHub Pages.
 * - Writes static site to storage/app/static by default
 * - Writes Glide-generated images into the static folder
 * - Fails CI on errors (set to 'errors')
 * - Provides hooks and extras to copy public assets after generation
 */

return [
    /**
     * Destination directory for generated static site (relative to project root).
     * Default Statamic destination is storage/app/static — keep that for CI-friendly builds.
     */
    'destination' => storage_path('app/static'),

    /**
     * Base URL that generated pages will reference. Set APP_URL in your environment
     * (e.g. https://your-username.github.io/your-repo) so URLs and canonical tags are correct.
     */
    'url' => env('APP_URL', ''),

    /**
     * Glide / image transform handling.
     * - directory: directory inside destination where transformed images will be written
     * - override: ensure generated transforms are written during SSG run
     */
    'glide' => [
        // writes to {destination}/img so transformed images are available in the static output
        'directory' => 'img',
        'override'  => true,
    ],

    /**
     * Additional URLs to explicitly include in the static output.
     * Useful for endpoints or routes not discovered by the SSG.
     */
    'urls' => [
        // '/extra-route',
    ],

    /**
     * Controls build failure policy. Use 'errors' for CI to fail on missing pages.
     * Allowed values: 'ignore', 'warnings', 'errors'
     */
    'failures' => env('SSG_FAILURES', 'errors'),

    /**
     * Exclude specific paths from the generated site (optional patterns).
     * Useful to avoid admin routes, ajax endpoints, or large media.
     */
    'exclude' => [
        '/cp*',        // admin control panel
        '/nova*',      // if using Nova or other admin routes
        '/api*',       // API endpoints
        '/storage*',
    ],

    /**
     * If your site uses dynamic assets that live in public/ (fonts, favicons, css, js)
     * the SSG::after() callback (see AppServiceProvider snippet below) will copy them
     * into the destination directory. You can list extra folders here to copy.
     */
    'copy' => [
        'public/css',
        'public/js',
        'public/fonts',
        'public/favicon.ico',
    ],

    /**
     * Any additional configuration you want to surface to the SSG in future.
     */
    'extra' => [
        // 'generate_sitemap' => true,
    ],
];


/**
 * ---------------------------
 * AppServiceProvider snippet
 * ---------------------------
 * Paste this into your AppServiceProvider::boot() to run after SSG generation.
 * This will copy configured public assets and ensure glide/output images are present.
 * (This is not part of config file; copy into app/Providers/AppServiceProvider.php)
 */

/*
use Statamic\StaticSite\SSG;

public function boot()
{
    SSG::after(function () {
        $destination = config('statamic.ssg.destination') ?: storage_path('app/static');

        // copy public assets configured in the ssg.php -> 'copy' array
        $toCopy = config('statamic.ssg.copy', []);
        foreach ($toCopy as $path) {
            $from = base_path($path);
            $target = rtrim($destination, '/') . '/' . ltrim(str_replace('public/', '', $path), '/');
            if (is_dir($from)) {
                app('files')->copyDirectory($from, $target);
            } elseif (is_file($from)) {
                app('files')->ensureDirectoryExists(dirname($target));
                app('files')->copy($from, $target);
            }
        }

        // If Glide writes to public/img during runtime, ensure any existing public/img
        // is mirrored into the static destination img folder as a safety-net.
        $publicImg = public_path('img');
        $destImg   = rtrim($destination, '/') . '/img';
        if (is_dir($publicImg)) {
            app('files')->copyDirectory($publicImg, $destImg);
        }
    });
}
*/

/**
 * ---------------------------
 * Quick notes
 * ---------------------------
 * 1) Set APP_URL and APP_KEY in your CI environment/secrets so generated URLs and internal
 *    helpers work correctly. In GitHub Actions add them as repo secrets.
 * 2) Confirm the 'destination' path matches the path you upload in CI (storage/app/static).
 * 3) If you prefer a different destination (eg. public/export) update both this file and CI.
 */
