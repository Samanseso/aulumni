@php
    $appName = config('app.name', 'aulumni');
@endphp

<x-mail::message>
<div style="text-align: center; margin-bottom: 55px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <img
        src="{{ url('https://upload.wikimedia.org/wikipedia/en/8/8b/Arellano_University_logo.png') }}"
        alt="{{ $appName }} logo"
        width="85"
        height="85"
        style="display: inline-block; margin-bottom: 5px;"
    >
    <div style="font-size: 34px; font-weight: 700; color: #0f172a; letter-spacing: 0.02em;">
        {{ $appName }}
    </div>
</div>

# Hello {{ $name }},

<div style="font-size: 15px; line-height: 1.7; color: #334155; margin-bottom: 20px;">
    Your account has been activated. You can now sign in and start using your alumni portal.
</div>

<x-mail::panel>
<div style="color: #334155; font-size: 14px; line-height: 1.7;">
    Use the button below to enter your account. If you're having trouble clicking the button, copy and paste the URL below into your web browser: {{ config('app.url') }}/login
</div>
</x-mail::panel>

<x-mail::button :url="$loginUrl" color="primary">
Sign in
</x-mail::button>

<div style="font-size: 14px; line-height: 1.7; color: #475569; margin-top: 12px;">
    If you did not expect this update, you can safely ignore this email.
</div>

<div style="margin-top: 28px; font-size: 13px; color: #64748b;">
    Thanks,<br>
    {{ $appName }}
</div>
</x-mail::message>
