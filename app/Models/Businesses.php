<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Businesses extends Model
{
    protected $table = 'businesses';
    protected $fillable = [
        'business_id',
        'location_id',
        'company_id',
        'name',
        'email',
        'phone',
        'description',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'website',
        'facebook_url',
        'instagram_url',
        'linkedin_url',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];
}
