<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\PostController;

Route::get('/', function () {
    logger('Rendering Welcome page');
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('posts', [PostController::class, 'index'])->name("posts");

    Route::put('/posts/new', [PostController::class, 'store'])->name('posts.new');

    Route::put('/posts/{id}/remark', [PostController::class, 'addRemark'])->name('posts.remark');

    Route::put('/posts/{id}/approval-status', [PostController::class, 'updateApprovalStatus'])->name('posts.updateApproval');
    Route::put('/posts/{id}/material-status', [PostController::class, 'updateMaterialStatus'])->name('posts.updateMaterial');
    Route::put('/posts/{id}/post-status', [PostController::class, 'updatePostStatus'])->name('posts.updatePost');
    Route::put('/posts/{id}/details', [PostController::class, 'updateDetails'])->name('posts.update.details');

    Route::post('/posts/import', [PostController::class, 'importExcel']);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
