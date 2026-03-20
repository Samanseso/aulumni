<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    // use user_id because your users table uses user_id as the PK
    return (int) $user->user_id === (int) $id;
});
