<?php

namespace App\Models;

use App\Models\GhlContact;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GhlContactAttribution extends Model
{
    protected $table = 'ghl_contact_attributions';

    protected $fillable = [
        'contact_id',
        'location_id',
        'url',
        'campaign',
        'utm_source',
        'utm_medium',
        'utm_content',
        'referrer',
        'campaign_id',
        'fbclid',
        'gclid',
        'msclikid',
        'dclid',
        'fbc',
        'fbp',
        'fb_event_id',
        'user_agent',
        'ip',
        'medium',
        'medium_id',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(GhlContact::class, 'contact_id');
    }
}
