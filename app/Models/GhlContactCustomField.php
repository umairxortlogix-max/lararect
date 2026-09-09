<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GhlContactCustomField extends Model
{
    protected $table = 'ghl_contact_custom_fields';

    protected $fillable = [
        'contact_id',
        'field_id',
        'value',
    ];

    public function contact(): BelongsTo
    {
        return $this->belongsTo(GhlContact::class, 'contact_id');
    }
}
