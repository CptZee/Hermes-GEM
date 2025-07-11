<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->post('/save-subscription', function (Request $request) {
    Log::info('Hit /save-subscription with payload:', $request->all());
    $request->user()->updatePushSubscription(
        $request->input('endpoint'),
        $request->input('keys.p256dh'),
        $request->input('keys.auth')
    );

    return response()->json(['success' => true]);
});
