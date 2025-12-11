<?php

use Illuminate\Support\Facades\Route;

// Route::statamic('example', 'example-view', [
//    'title' => 'Example'
// ]);

 // Route::statamic('px', 'minecraft_converter', ['title' => 'Minecraft Converter']);
 
Route::statamic('apps', 'app-library', [
'title' => 'Apps Library',
'layout' => 'layouts/main',

]);
Route::statamic('px', 'minecraft_converter', [
'title' => 'Minecraft Converter',
'layout' => 'layouts/main',

]);
