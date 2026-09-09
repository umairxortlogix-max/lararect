<?php

namespace App\Models;

use App\Models\GhlContact;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GhlContactTag extends Model
{
    protected $table = 'ghl_contact_tags';

    protected $fillable = [
        'contact_id',
        'location_id',
        'tag',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(GhlContact::class, 'contact_id');
    }
}
