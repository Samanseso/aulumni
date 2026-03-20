<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->user_type === 'admin') {
            return Inertia::render('admin/notifications');
        } else {
            return Inertia::render('alumni/notifications');
        }
    }

    public function store(Request $request)
    {
        // Logic to create a new notification based on the request data
    }
}
