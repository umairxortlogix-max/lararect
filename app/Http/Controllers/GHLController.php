<?php

namespace App\Http\Controllers;

use App\Models\GhlAuth;
use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GHLController extends Controller
{
    private const BASE_URL = 'https://services.leadconnectorhq.com';

    private const GHL_SCOPES = [
        'locations.readonly',
        'locations.write',
        'oauth.write',
        'contacts.readonly',
        'contacts.write',
        'conversations.readonly',
        'conversations.write',
        'opportunities.readonly',
        'opportunities.write',
        'calendars.readonly',
        'calendars.write',
        'users.readonly',
        'users.write',
        'companies.readonly',
        'businesses.readonly',
        'businesses.write',
        'products.readonly',
        'products.write',
    ];

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
                'scope' => implode(' ', self::GHL_SCOPES),
            ];
        }

        if ($user->hasRole('admin')) {
            return [
                'user' => $user,
                'user_type' => 'Location',
                'scope' => implode(' ', self::GHL_SCOPES),
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

    private function saveLocation(array $location): ?string
    {
        $locationId = $location['id'] ?? null;

        if (!$locationId) {
            return null;
        }

        Location::updateOrCreate(
            ['location_id' => $locationId],
            [
                'name' => $location['name'] ?? null,
                'company_name' => $location['companyName'] ?? $location['company_name'] ?? null,
                'email' => $location['email'] ?? null,
                'address' => $location['address'] ?? null,
                'city' => $location['city'] ?? null,
                'state' => $location['state'] ?? null,
                'postal_code' => $location['postalCode'] ?? null,
                'country' => $location['country'] ?? null,
            ]
        );

        return $locationId;
    }

    private function generateLocationToken(
        User $user,
        string $companyId,
        string $locationId,
        string $agencyAccessToken
    ): ?GhlAuth {
        try {
            $response = Http::asForm()
                ->withToken($agencyAccessToken)
                ->withHeaders([
                    'Version' => 'v3',
                    'Accept' => 'application/json',
                ])
                ->post(
                    self::BASE_URL . '/oauth/location-token',
                    [
                        'companyId' => $companyId,
                        'locationId' => $locationId,
                    ]
                );

            if ($response->failed()) {
                Log::error('GHL Location Token Generation Failed', [
                    'location_id' => $locationId,
                    'company_id' => $companyId,
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);

                return null;
            }

            $token = $response->json();

            return GhlAuth::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'user_type' => 'location',
                    'location_id' => $locationId,
                ],
                [
                    'access_token' => $token['access_token'] ?? null,
                    'token_type' => $token['token_type'] ?? 'Bearer',
                    'refresh_token' => $token['refresh_token'] ?? null,
                    'expires_in' => $token['expires_in'] ?? null,
                    'company_id' => $token['companyId'] ?? $companyId,
                    'location_id' => $token['locationId'] ?? $locationId,
                ]
            );

        } catch (\Throwable $e) {
            Log::error('GHL Location Token Exception', [
                'location_id' => $locationId,
                'company_id' => $companyId,
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }
    private function syncLocationUser(array $location): void
    {
        $locationId = $location['id'] ?? null;
        $email = trim((string) ($location['email'] ?? ''));

        if (!$locationId || !$email) {
            Log::warning('GHL location user skipped: location id or email missing', [
                'location_id' => $locationId,
            ]);

            return;
        }

        $user = User::where('location_id', $locationId)->first();
        $isNewUser = false;

        if (!$user) {
            $existingEmailUser = User::where('email', $email)->first();

            if ($existingEmailUser) {
                Log::warning('GHL location user skipped: email already belongs to another user', [
                    'location_id' => $locationId,
                    'email' => $email,
                    'user_id' => $existingEmailUser->id,
                ]);

                return;
            }

            $user = new User([
                'email' => $email,
                'password' => bcrypt($locationId),
            ]);
            $isNewUser = true;
        }

        $user->name = $location['name'] ?? $location['company_name'] ?? $email;
        $user->email = $email;
        $user->location_id = $locationId;
        $user->save();

        if ($isNewUser) {
            $user->assignRole('admin');
        }
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
        Log::info('GHL OAuth callback started', [
            'code_present' => $request->has('code'),
        ]);

        if (!$request->code) {
            return redirect()
                ->route('settings.info')
                ->with('error', 'GHL authorization code is missing.');
        }

        $user = auth()->user();

        if (!$user) {
            abort(401, 'User not authenticated');
        }

        $context = $this->resolveGhlContext($user);

        $ghlUserType = $context['user_type'];

        try {
            /*
            |--------------------------------------------------------------------------
            | 1. Exchange authorization code for Agency/Location token
            |--------------------------------------------------------------------------
            */

            $response = Http::asForm()
                ->acceptJson()
                ->post(
                    self::BASE_URL . '/oauth/token',
                    [
                        'client_id' => config('services.ghl.client_id'),
                        'client_secret' => config('services.ghl.client_secret'),
                        'grant_type' => 'authorization_code',
                        'code' => $request->code,
                        'user_type' => $ghlUserType,
                        'redirect_uri' => config('services.ghl.redirect_uri'),
                    ]
                );

            if ($response->failed()) {
                Log::error('GHL OAuth token exchange failed', [
                    'status' => $response->status(),
                    'response' => $response->json(),
                ]);

                return redirect()
                    ->route('settings.info')
                    ->with('error', 'Failed to connect GHL.');
            }

            $token = $response->json();

            /*
            |--------------------------------------------------------------------------
            | 2. Save Company / Agency token
            |--------------------------------------------------------------------------
            */

            GhlAuth::updateOrCreate(
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

            /*
            |--------------------------------------------------------------------------
            | 3. If Agency/Company connected,
            |    automatically generate Location tokens
            |--------------------------------------------------------------------------
            */

            if ($ghlUserType === 'Company') {

                $companyId = $token['companyId'] ?? null;
                $agencyAccessToken = $token['access_token'] ?? null;

                if (!$companyId || !$agencyAccessToken) {
                    Log::warning('GHL Company token missing companyId/access_token');

                    return redirect()
                        ->route('settings.info')
                        ->with('error', 'Agency connected, but company information is missing.');
                }

                /*
                |--------------------------------------------------------------------------
                | Fetch all installed locations
                |--------------------------------------------------------------------------
                */

                $locationsResponse = Http::withToken($agencyAccessToken)
                    ->acceptJson()
                    ->withHeaders([
                        'Version' => '2023-02-21',
                    ])
                    ->get(
                        self::BASE_URL . '/locations/search',
                        [
                            'companyId' => $companyId,
                            'limit' => 100,
                            'skip' => 0,
                        ]
                    );

                if ($locationsResponse->successful()) {

                    $locations = $locationsResponse->json('locations', []);

                    foreach ($locations as $location) {
                        $locationId = $this->saveLocation($location);

                        if (!$locationId) {
                            continue;
                        }

                        $this->syncLocationUser($location);

                        $locationToken = $this->generateLocationToken(
                            $user,
                            $companyId,
                            $locationId,
                            $agencyAccessToken
                        );

                        if ($locationToken) {
                            Log::info('GHL Location token generated', [
                                'location_id' => $locationId,
                            ]);
                        }
                    }

                } else {
                    Log::error('Failed to fetch GHL locations', [
                        'status' => $locationsResponse->status(),
                        'response' => $locationsResponse->json(),
                    ]);
                }
            }

            /*
            |--------------------------------------------------------------------------
            | 4. Redirect
            |--------------------------------------------------------------------------
            */

            return redirect()
                ->route('settings.info')
                ->with('success', 'GHL connected successfully.');

        } catch (\Throwable $e) {

            Log::error('GHL OAuth callback exception', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()
                ->route('settings.info')
                ->with('error', 'Something went wrong while connecting GHL.');
        }
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
            ->get(self::BASE_URL . '/locations/search', [
                'companyId' => $ghlAuth->company_id,
                'limit' => 100,
                'skip' => 0,
            ]);

        if ($response->failed()) {
            return redirect()->back()->with('error', 'Unable to fetch GHL locations.');
        }

        $locations = $response->json('locations', []);

        foreach ($locations as $location) {
            if (!$this->saveLocation($location)) {
                continue;
            }

            $this->syncLocationUser($location);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'GHL Agency locations synced successfully.',
        ]);

        return to_route('settings.info');
    }
}