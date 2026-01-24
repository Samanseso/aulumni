<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Symfony\Component\HttpFoundation\RedirectResponse;

class UserController extends Controller
{
    public function activate(User $user): RedirectResponse
    {
        $user->status = 'active';
        $user->save();

        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'update',
            'modal_title'   => 'Activation successful!',
            'modal_message' => 'User was activated successfully.',
        ]);
    }

    public function deactivate(User $user): RedirectResponse
    {
        $user->status = 'inactive';
        $user->save();

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Deactivation successful!",
            'modal_message' => "User was deactivated successfully.",
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        $user->delete();

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "delete",
            'modal_title' => "Delete successful!",
            'modal_message' => "User was deleted successfully.",
        ]);
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validate());

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "User was updated successfully.",
        ]);
    }




}
