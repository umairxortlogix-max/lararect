<?php

namespace App\Http\Controllers;

use App\Models\Businesses;
use App\Models\GhlAuth;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Request;
use Illuminate\Support\Facades\Auth;

class SubaccountController extends Controller
{
    public function locationData()
    {
        $baseurl = 'https://services.leadconnectorhq.com';

        $user = Auth::user();

        $locationId = $user->location_id;

        $ghlAuth = GhlAuth::where('location_id', $locationId)
            ->where('user_type', 'location')
            ->firstOrFail();

        $headers = [
            'Authorization' => 'Bearer ' . $ghlAuth->access_token,
            'Version' => 'v3',
            'Accept' => 'application/json',
        ];

        $client = new Client();

        /*
        |--------------------------------------------------------------------------
        | 1. Get Businesses for the location
        |--------------------------------------------------------------------------
        */

        $request = new Request(
            'GET',
            $baseurl . '/businesses/?' . http_build_query([
                'locationId' => $locationId,
                'limit' => 100,
                'skip' => 0,
            ]),
            $headers
        );

        $res = $client->sendAsync($request)->wait();

        $businesses = json_decode($res->getBody()->getContents(), true)['businesses'] ?? [];

        if (!$businesses) {
            return response()->json([
                'success' => true,
                'businesses' => [],
                'message' => 'No businesses found for this location.',
            ]);
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Save Business
        |--------------------------------------------------------------------------
        */

        $savedBusinesses = collect($businesses)->map(function (array $businessData) use ($locationId, $ghlAuth) {
            return Businesses::updateOrCreate(
                ['business_id' => $businessData['id']],
                [
                    'location_id' => $locationId,
                    'company_id' => $ghlAuth->company_id,
                    'name' => $businessData['name'] ?? null,
                    'email' => $businessData['email'] ?? null,
                    'phone' => $businessData['phone'] ?? null,
                    'description' => $businessData['description'] ?? null,
                    'address' => $businessData['address'] ?? null,
                    'city' => $businessData['city'] ?? null,
                    'state' => $businessData['state'] ?? null,
                    'postal_code' => $businessData['postalCode'] ?? null,
                    'country' => $businessData['country'] ?? null,
                    'website' => $businessData['website'] ?? null,
                    'facebook_url' => $businessData['facebookUrl'] ?? null,
                    'instagram_url' => $businessData['instagramUrl'] ?? null,
                    'linkedin_url' => $businessData['linkedinUrl'] ?? null,
                    'metadata' => $businessData,
                ]
            );
        });

        return response()->json([
            'success' => true,
            'businesses' => $savedBusinesses,
        ]);


    }
}
