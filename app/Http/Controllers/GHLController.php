<?php

namespace App\Http\Controllers;

use App\Models\GhlAuth;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GHLController extends Controller
{
    private function resolveGhlContext(?User $user = null): array
    {
        $user = $user ?? auth()->user();

        if (!$user) {
            abort(401, 'User not authenticated');
        }

        if ($user->hasRole('super_admin')) {
            return [
                'user' => $user,
                'user_type' => 'Company',
                'scope' => 'locations.readonly',
            ];
        }

        if ($user->hasRole('admin')) {
            return [
                'user' => $user,
                'user_type' => 'Location',
                'scope' => 'locations.readonly',
            ];
        }

        abort(403, 'You are not authorized to connect GHL.');
    }

    private function getStoredGhlToken(User $user): ?GhlAuth
    {
        $context = $this->resolveGhlContext($user);

        return GhlAuth::where('user_id', $user->id)
            ->where('user_type', strtolower($context['user_type']))
            ->first();
    }

    public function connect()
    {
        Log::info('GHL Connect: Started');

        $context = $this->resolveGhlContext();
        $user = $context['user'];
        $userType = $context['user_type'];
        $scope = $context['scope'];

        Log::info('GHL Connect: Authenticated user', [
            'user_id' => $user->id,
            'role' => $user->getRoleNames()->toArray(),
            'user_type' => $userType,
        ]);

        $params = [
            'response_type' => 'code',
            'client_id' => config('services.ghl.client_id'),
            'redirect_uri' => config('services.ghl.redirect_uri'),
            'scope' => $scope,
            'user_type' => $userType,
        ];

        Log::info('GHL Connect: OAuth parameters', $params);

        $url = 'https://marketplace.gohighlevel.com/oauth/chooselocation?' .
            http_build_query($params);

        Log::info('GHL Connect: Redirecting to GHL OAuth');

        return redirect($url);
    }


    public function callback(Request $request)
    {
        Log::info('GHL Callback: Started', [
            'request_params' => $request->except([
                'code',
                'client_secret',
                'access_token',
                'refresh_token',
            ]),
        ]);

        /*
        |--------------------------------------------------------------------------
        | Check Authorization Code
        |--------------------------------------------------------------------------
        */

        if (!$request->code) {

            // Log::error('GHL Callback: Authorization code missing');

            return response()->json([
                'error' => 'Authorization code not received'
            ], 400);
        }

        // Log::info('GHL Callback: Authorization code received');

        /*
        |--------------------------------------------------------------------------
        | Authenticated User
        |--------------------------------------------------------------------------
        */

        $user = auth()->user();

        if (!$user) {

            Log::error('GHL Callback: User not authenticated');

            return response()->json([
                'error' => 'User not authenticated'
            ], 401);
        }

        // Log::info('GHL Callback: User authenticated', [
        //     'user_id' => $user->id,
        //     'roles' => $user->getRoleNames()->toArray(),
        // ]);

        $context = $this->resolveGhlContext($user);
        $ghlUserType = $context['user_type'];

        /*
        |--------------------------------------------------------------------------
        | Exchange Code For Token
        |--------------------------------------------------------------------------
        */

        // Log::info('GHL Callback: Sending token request to GHL', [
        //     'user_id' => $user->id,
        //     'ghl_user_type' => $ghlUserType,
        //     'redirect_uri' => config('services.ghl.redirect_uri'),
        // ]);

        $response = Http::asForm()
            ->post(
                'https://services.leadconnectorhq.com/oauth/token',
                [
                    'client_id' => config('services.ghl.client_id'),
                    'client_secret' => config('services.ghl.client_secret'),
                    'grant_type' => 'authorization_code',
                    'code' => $request->code,
                    'user_type' => $ghlUserType,
                    'redirect_uri' => config('services.ghl.redirect_uri'),
                ]
            );

        /*
        |--------------------------------------------------------------------------
        | Log GHL Response
        |--------------------------------------------------------------------------
        */

        // Log::info('GHL Callback: Token API response received', [
        //     'status' => $response->status(),
        //     'successful' => $response->successful(),
        // ]);

        if ($response->failed()) {

            Log::error('GHL Callback: Token request failed', [
                'status' => $response->status(),
                'response' => $response->json(),
            ]);

            return response()->json([
                'error' => 'GHL token request failed',
                'status' => $response->status(),
                'response' => $response->json(),
            ], 400);
        }

        $token = $response->json();

        /*
        |--------------------------------------------------------------------------
        | Log Safe Token Information
        |--------------------------------------------------------------------------
        */

        // Log::info('GHL Callback: Token received', [
        //     'user_id' => $user->id,
        //     'user_type' => $ghlUserType,
        //     'has_access_token' => !empty($token['access_token']),
        //     'has_refresh_token' => !empty($token['refresh_token']),
        //     'expires_in' => $token['expires_in'] ?? null,
        //     'company_id' => $token['companyId'] ?? null,
        //     'location_id' => $token['locationId'] ?? null,
        // ]);

        /*
        |--------------------------------------------------------------------------
        | Save Authentication
        |--------------------------------------------------------------------------
        */

        try {

            $ghlAuth = GhlAuth::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'user_type' => strtolower($ghlUserType),
                ],
                [
                    'access_token' => $token['access_token'] ?? null,
                    'token_type' => $token['token_type'] ?? 'Bearer',
                    'refresh_token' => $token['refresh_token'] ?? null,
                    'expires_in' => $token['expires_in'] ?? null,
                    'company_id' => $token['companyId'] ?? null,
                    'location_id' => $token['locationId'] ?? null,
                ]
            );

            // Log::info('GHL Callback: Authentication saved successfully', [
            //     'ghl_auth_id' => $ghlAuth->id,
            //     'user_id' => $user->id,
            //     'user_type' => $ghlAuth->user_type,
            //     'company_id' => $ghlAuth->company_id,
            //     'location_id' => $ghlAuth->location_id,
            // ]);

        } catch (\Throwable $e) {

            Log::error('GHL Callback: Database save failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'error' => 'Failed to save GHL authentication.',
            ], 500);
        }

        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        // Log::info('GHL Callback: Completed successfully', [
        //     'user_id' => $user->id,
        //     'ghl_auth_id' => $ghlAuth->id,
        //     'user_type' => $ghlAuth->user_type,
        // ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $ghlUserType === 'Company'
                ? 'GHL Agency connected successfully.'
                : 'GHL Sub-account connected successfully.',
        ]);

        return to_route('settings.info');
    }

    public function locations()
    {
        $user = auth()->user();

        if (!$user) {
            abort(401, 'User not authenticated');
        }

        $context = $this->resolveGhlContext($user);

        if ($context['user_type'] !== 'Company') {
            abort(403, 'Only agency users can sync locations.');
        }

        $ghlAuth = $this->getStoredGhlToken($user);

        if (!$ghlAuth) {
            return redirect()->back()->with('error', 'GHL Agency is not connected.');
        }

        $response = Http::withToken($ghlAuth->access_token)
            ->withHeaders([
                'Version' => '2023-02-21',
            ])
            ->get('https://services.leadconnectorhq.com/locations/search');

        if ($response->failed()) {
            return redirect()->back()->with('error', 'Unable to fetch GHL locations.');
        }

        $locations = $response->json('locations', []);

        foreach ($locations as $location) {
            Location::updateOrCreate(
                ['location_id' => $location['id'] ?? null],
                [
                    'name' => $location['name'] ?? null,
                    'company_name' => $location['company_name'] ?? null,
                    'email' => $location['email'] ?? null,
                    'address' => $location['address'] ?? null,
                    'city' => $location['city'] ?? null,
                    'state' => $location['state'] ?? null,
                    'postal_code' => $location['postalCode'] ?? null,
                    'country' => $location['country'] ?? null,
                ]
            );
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'GHL Agency locations synced successfully.',
        ]);

        return to_route('settings.info');
    }
}