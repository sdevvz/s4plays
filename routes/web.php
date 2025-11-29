<?php

use Illuminate\Support\Facades\Route;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);
 
Route::statamic('apps', 'app-library', [
'title' => 'Apps Library',
'layout' => 'layouts/main',

]);
