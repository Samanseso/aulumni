<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Notifications\AccountActivatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Concerns\PasswordValidationRules;

class UserController extends Controller
{
    use PasswordValidationRules;

    public function activate(User $user): RedirectResponse
    {
        $this->activateUser($user);

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
        $validated = $request->validate([
            'user_ids' => ['required', 'array', 'min:1'],
            'user_ids.*' => ['integer', 'exists:users,user_id'],
        ]);

        User::query()
            ->whereIn('user_id', $validated['user_ids'])
            ->where('status', '!=', 'active')
            ->get()
            ->each(fn (User $user) => $this->activateUser($user));

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Activation successful!",
            'modal_message' => "Users were activated successfully.",
            'signal_deselect' => (string) Str::uuid(),
        ]);
    }

    public function bulk_deactivate(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => ['required', 'array', 'min:1'],
            'user_ids.*' => ['integer', 'exists:users,user_id'],
        ]);

        User::query()
            ->whereIn('user_id', $validated['user_ids'])
            ->update(['status' => 'inactive']);

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Deactivation successful!",
            'modal_message' => "Users were deactivated successfully.",
            'signal_deselect' => (string) Str::uuid(),
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
        $validated = $request->validated();
        $wasActive = $user->status === 'active';

        $user->fill($validated);
        $user->save();

        if (! $wasActive && $user->status === 'active') {
            $this->sendActivationEmail($user);
        }

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Update successful!",
            'modal_message' => "User was updated successfully.",
        ]);
    }

    public function bulk_delete(Request $request) {
        $validated = $request->validate([
            'password' => $this->currentPasswordRules(),
            'user_ids' => ['required', 'array', 'min:1'],
            'user_ids.*' => ['integer', 'exists:users,user_id'],
        ]);

        User::destroy($validated['user_ids']);

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => "Deletion successful!",
            'modal_message' => "Users were deleted successfully.",
            'signal_deselect' => (string) Str::uuid(),
        ]);
    }

    private function activateUser(User $user): void
    {
        if ($user->status === 'active') {
            return;
        }

        $user->status = 'active';
        $user->save();

        $this->sendActivationEmail($user);
    }

    private function sendActivationEmail(User $user): void
    {
        $user->notify(new AccountActivatedNotification());
    }
}
