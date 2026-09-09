<?php

namespace App\Models;

use App\Models\GhlContactAttribution;
use App\Models\GhlContactCustomField;
use App\Models\GhlContactTag;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GhlContact extends Model
{
    protected $table = 'contacts';

    protected $fillable = [
        'ghl_contact_id',
        'location_id',
        'business_id',
        'name',
        'first_name',
        'last_name',
        'email',
        'phone',
        'timezone',
        'country',
        'source',
        'ghl_date_added',
        'raw_data',
    ];

    protected $casts = [
        'ghl_date_added' => 'datetime',
        'raw_data' => 'array',
    ];

    public function tags(): HasMany
    {
        return $this->hasMany(GhlContactTag::class, 'contact_id');
    }

    public function attributions(): HasMany
    {
        return $this->hasMany(GhlContactAttribution::class, 'contact_id');
    }

    public function customFields(): HasMany
    {
        return $this->hasMany(GhlContactCustomField::class, 'contact_id');
    }
}
