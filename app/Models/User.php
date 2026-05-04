<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Log;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Throwable;

/**
 * @method \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Notifications\DatabaseNotification> notifications()
 * @method \Illuminate\Database\Eloquent\Collection<int, \Illuminate\Notifications\DatabaseNotification> unreadNotifications()
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $primaryKey = 'user_id';
    public $incrementing = true;
    protected $keyType = 'int';


    protected $fillable = [
        'user_id',
        'user_name',
        'name',
        'email',
        'google_id',
        'avatar',
        'survey_completed',
        'user_type',
        'password',
        'status',
        'created_by',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'survey_completed' => 'boolean',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function alumni(): HasOne
    {
        return $this->hasOne(Alumni::class, 'user_id', 'user_id');
    }

    public function employeeDetail(): HasOne
    {
        return $this->hasOne(Employee::class, 'user_id', 'user_id');
    }

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class, 'user_id', 'user_id');
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'user_id', 'user_id');
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(Reaction::class, 'user_id', 'user_id');
    }

    public function savedPosts(): HasMany
    {
        return $this->hasMany(SavedPost::class, 'user_id', 'user_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(Share::class, 'user_id', 'user_id');
    }

    public function sendEmailVerificationNotification(): void
    {
        $mailer = config('mail.default');

        if ($mailer === 'log') {
            Log::warning('Verification email was written to the Laravel log because the log mailer is active.', [
                'user_id' => $this->user_id,
                'email' => $this->email,
                'mailer' => $mailer,
                'log_path' => storage_path('logs/laravel.log'),
            ]);
        }

        try {
            $this->notify(new VerifyEmailNotification);
        } catch (Throwable $exception) {
            Log::error('Failed to send verification email.', [
                'user_id' => $this->user_id,
                'email' => $this->email,
                'mailer' => $mailer,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}
