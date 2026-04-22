<?php

namespace App\Actions\Auth;

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

        $shouldRedirectToSurvey = $user?->user_type === 'alumni'
            && $user->show_survey_onboarding;

        if ($shouldRedirectToSurvey) {
            $user->forceFill(['show_survey_onboarding' => false])->save();
        }

        $destination = $shouldRedirectToSurvey
            ? route('survey.personal', ['verified' => 1])
            : url(config('fortify.home')).'?verified=1';

        return redirect()->intended($destination);
    }
}
