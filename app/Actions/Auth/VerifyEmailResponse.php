<?php

namespace App\Actions\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Laravel\Fortify\Contracts\VerifyEmailResponse as VerifyEmailResponseContract;

class VerifyEmailResponse implements VerifyEmailResponseContract
{
    public function toResponse($request)
    {
        if ($request->wantsJson()) {
            return new JsonResponse('', 204);
        }

        $user = $request->user();

        $shouldRedirectToSurvey = $this->shouldRedirectToSurvey($user);

        $destination = $shouldRedirectToSurvey
            ? route('survey.personal', ['verified' => 1])
            : url(config('fortify.home')).'?verified=1';

        return redirect()->intended($destination);
    }

    private function shouldRedirectToSurvey(?User $user): bool
    {
        if (! $user || $user->user_type !== 'alumni') {
            return false;
        }

        if ($user->survey_completed) {
            return false;
        }

        $alumni = $user->alumni()
            ->with(['personal_details', 'academic_details', 'contact_details'])
            ->first();

        if (! $alumni) {
            return true;
        }

        return ! (
            filled($alumni->personal_details?->first_name)
            && filled($alumni->personal_details?->last_name)
            && filled($alumni->academic_details?->student_number)
            && filled($alumni->contact_details?->email)
        );
    }
}
