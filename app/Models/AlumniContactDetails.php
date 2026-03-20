<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AlumniContactDetails extends Model
{
    protected $table = 'alumni_contact_details';
    protected $primaryKey = 'alumni_id';
    protected $keyType = 'string';
    public $timestamps = true;
    
    protected $fillable = [
        'alumni_id',
        'email',
        'contact',
        'telephone',
        'mailing_address',
        'present_address',
        'provincial_address',
        'company_address',
        'facebook_url',
        'twitter_url',
        'gmail_url',
        'link_url',
        'other_url',
    ];

    public function alumni(): BelongsTo
    {
        return $this->belongsTo(Alumni::class, 'alumni_id', 'alumni_id');
    }
}
