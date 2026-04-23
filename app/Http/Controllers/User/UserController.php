<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Models\User;
use App\Notifications\AccountActivatedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;
use Symfony\Component\HttpFoundation\RedirectResponse;
use App\Concerns\PasswordValidationRules;

class UserController extends Controller
{
    use PasswordValidationRules;

    public function activate(User $user): RedirectResponse
    {
        $emailSent = $this->activateUser($user);

        return back()->with([
            'modal_status'  => 'success',
            'modal_action'  => 'update',
            'modal_title'   => $emailSent
                ? 'Activation successful!'
                : 'Activation completed with email warning',
            'modal_message' => 'User was activated successfully.'.$this->activationEmailWarningMessage($emailSent ? 0 : 1),
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

        $failedEmailCount = User::query()
            ->whereIn('user_id', $validated['user_ids'])
            ->where('status', '!=', 'active')
            ->get()
            ->reduce(
                fn (int $count, User $user) => $count + ($this->activateUser($user) ? 0 : 1),
                0,
            );

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => $failedEmailCount === 0
                ? "Activation successful!"
                : "Activation completed with email warning",
            'modal_message' => "Users were activated successfully."
                .$this->activationEmailWarningMessage($failedEmailCount),
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

        $activationEmailFailed = false;

        if (! $wasActive && $user->status === 'active') {
            $activationEmailFailed = ! $this->sendActivationEmail($user);
        }

        return back()->with([
            'modal_status' => "success",
            'modal_action' => "update",
            'modal_title' => $activationEmailFailed
                ? "Update successful with email warning"
                : "Update successful!",
            'modal_message' => "User was updated successfully."
                .$this->activationEmailWarningMessage($activationEmailFailed ? 1 : 0),
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

    private function activateUser(User $user): bool
    {
        if ($user->status === 'active') {
            return true;
        }

        $user->status = 'active';
        $user->save();

        return $this->sendActivationEmail($user);
    }

    private function sendActivationEmail(User $user): bool
    {
        try {
            $user->notify(new AccountActivatedNotification());

            return true;
        } catch (Throwable $exception) {
            Log::error('Failed to send activation email.', [
                'user_id' => $user->user_id,
                'email' => $user->email,
                'mailer' => config('mail.default'),
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return false;
        }
    }

    private function activationEmailWarningMessage(int $failedEmailCount): string
    {
        return match (true) {
            $failedEmailCount <= 0 => '',
            $failedEmailCount === 1 => ' The account was activated, but the activation email could not be sent. Check the mail configuration or the logs for details.',
            default => " {$failedEmailCount} activation emails could not be sent. Check your mail configuration or the Laravel log for details.",
        };
    }
}
