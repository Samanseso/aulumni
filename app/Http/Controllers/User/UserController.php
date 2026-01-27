<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use Illuminate\Http\Request;
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

    public function bulk_activate(Request $request)
    {
        foreach ($request->all()["user_ids"] as $user_id) {
            $user = User::find($user_id);
            if ($user) {
                $user->status = 'active';
                $user->save();
            }
        }

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Activation successful!",
            'modal_message' => "Users were activated successfully.",
        ]);
    }

    public function bulk_deactivate(Request $request)
    {
        foreach ($request->all()["user_ids"] as $user_id) {
            $user = User::find($user_id);
            if ($user) {
                $user->status = 'inactive';
                $user->save();
            }
        }

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Deactivation successful!",
            'modal_message' => "Users were deactivated successfully.",
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

    public function bulk_delete(Request $request) {
        foreach ($request->all()["user_ids"] as $user_id) {
            $user = User::find($user_id);
            if ($user) {
                $user->destroy();
            }
        }

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Deletion successful!",
            'modal_message' => "Users were deleted successfully.",
        ]);
    }
}
