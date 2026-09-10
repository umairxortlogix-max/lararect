<?php

namespace App\Http\Controllers;

use App\Models\GhlContact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    public function index()
    {
        $auth = Auth::user();
        $location = $auth->location_id;

        $contacts = GhlContact::with([
            'tags',
            'customFields',
            'attributions',
        ])
            ->where('location_id', $location)
            ->get();

        return inertia('contacts', [
            'contacts' => $contacts,
        ]);
    }
}
