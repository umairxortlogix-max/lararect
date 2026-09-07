<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GhlAuth extends Model
{
    protected $table = 'ghlaut';
    protected $fillable = [
        'access_token',
        'company_id',
        'location_id',
        'token_type',
        'refresh_token',
        'user_type',
        'expires_in',
        'user_id',
    ];
}
