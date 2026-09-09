<?php

namespace App\Http\Controllers;

use App\Models\Businesses;
use App\Models\GhlAuth;
use App\Models\GhlContact;
use App\Models\GhlContactAttribution;
use App\Models\GhlContactCustomField;
use App\Models\GhlContactTag;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubaccountController extends Controller
{
    private string $baseUrl = 'https://services.leadconnectorhq.com';


    /*
    |--------------------------------------------------------------------------
    | Main Method
    |--------------------------------------------------------------------------
    */

    public function locationData(): JsonResponse
    {
        $user = Auth::user();

        $locationId = $this->getLocationId($user);

        if (!$locationId) {
            return $this->errorResponse(
                'No GoHighLevel location is assigned to this user.',
                422
            );
        }

        $ghlAuth = $this->getGhlAuth($locationId);

        if (!$ghlAuth) {
            return $this->errorResponse(
                'GoHighLevel authentication not found.',
                404
            );
        }

        $client = $this->getClient($ghlAuth->access_token);

        try {

            /*
            |--------------------------------------------------------------------------
            | Get Contacts
            |--------------------------------------------------------------------------
            */

            $contactsResponse = $this->getContacts(
                $client,
                $locationId
            );

            $savedContacts = $this->saveContacts(
                $contactsResponse,
                $locationId
            );


            /*
            |--------------------------------------------------------------------------
            | Get Businesses
            |--------------------------------------------------------------------------
            */

            $businessesResponse = $this->getBusinesses(
                $client,
                $locationId
            );


            /*
            |--------------------------------------------------------------------------
            | Save Businesses
            |--------------------------------------------------------------------------
            */

            $savedBusinesses = $this->saveBusinesses(
                $businessesResponse,
                $locationId,
                $ghlAuth
            );


            /*
            |--------------------------------------------------------------------------
            | Response
            |--------------------------------------------------------------------------
            */

            return response()->json([
                'success' => true,
                'businesses' => $savedBusinesses,
                'contacts' => $savedContacts,
            ]);

        } catch (\Throwable $e) {

            return $this->errorResponse(
                $e->getMessage(),
                500
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Get Location ID
    |--------------------------------------------------------------------------
    */

    private function getLocationId($user): ?string
    {
        $locationId = trim((string) $user->location_id);

        return $locationId !== ''
            ? $locationId
            : null;
    }


    /*
    |--------------------------------------------------------------------------
    | Get GHL Authentication
    |--------------------------------------------------------------------------
    */

    private function getGhlAuth(string $locationId): ?GhlAuth
    {
        return GhlAuth::where('location_id', $locationId)
            ->where('user_type', 'location')
            ->first();
    }


    /*
    |--------------------------------------------------------------------------
    | Guzzle Client
    |--------------------------------------------------------------------------
    */

    private function getClient(string $accessToken): Client
    {
        return new Client([
            'base_uri' => $this->baseUrl,

            'timeout' => 30,

            'http_errors' => false,

            'headers' => [
                'Authorization' => 'Bearer ' . $accessToken,
                'Version' => 'v3',
                'Accept' => 'application/json',
            ],
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Generic GET Request
    |--------------------------------------------------------------------------
    */

    private function get(
        Client $client,
        string $endpoint,
        array $query = []
    ): array {

        $response = $client->get($endpoint, [
            'query' => $query,
        ]);

        $status = $response->getStatusCode();

        $body = $response->getBody()->getContents();

        $data = json_decode($body, true);

        Log::info('GHL API request completed.', [
            'endpoint' => $endpoint,
            'query' => $query,
            'status' => $status,
        ]);

        if ($status < 200 || $status >= 300) {
            $message = $data['message'] ?? null;

            if (is_array($message)) {
                $message = json_encode($message, JSON_UNESCAPED_SLASHES);
            }

            if (!is_string($message) || trim($message) === '') {
                $message = $body !== ''
                    ? $body
                    : 'GoHighLevel API request failed.';
            }

            Log::error('GHL API request failed.', [
                'endpoint' => $endpoint,
                'query' => $query,
                'status' => $status,
                'response' => $data ?? $body,
            ]);

            throw new \Exception($message);
        }

        return $data ?? [];
    }


    /*
    |--------------------------------------------------------------------------
    | Get Contacts
    |--------------------------------------------------------------------------
    */

    private function getContacts(
        Client $client,
        string $locationId
    ): array {

        $data = $this->get(
            $client,
            '/contacts/',
            [
                'locationId' => $locationId,
                'limit' => 100,
            ]
        );

        return $data['contacts'] ?? [];
    }


    /*
    |--------------------------------------------------------------------------
    | Get Businesses
    |--------------------------------------------------------------------------
    */

    private function getBusinesses(
        Client $client,
        string $locationId
    ): array {

        $data = $this->get(
            $client,
            '/businesses/',
            [
                'locationId' => $locationId,
                'limit' => 100,
                'skip' => 0,
            ]
        );

        return $data['businesses'] ?? [];
    }


    /*
    |--------------------------------------------------------------------------
    | Save Contacts
    |--------------------------------------------------------------------------
    */

    private function saveContacts(
        array $contacts,
        string $locationId
    ): array {
        return collect($contacts)->map(function ($contact) use ($locationId) {
            $ghlContactId = $contact['id'] ?? $contact['contactId'] ?? null;

            if (!$ghlContactId) {
                return null;
            }

            $contactModel = GhlContact::updateOrCreate(
                [
                    'ghl_contact_id' => $ghlContactId,
                ],
                [
                    'location_id' => $locationId,
                    'business_id' => $contact['businessId'] ?? $contact['business_id'] ?? null,
                    'name' => $contact['name'] ?? null,
                    'first_name' => $contact['firstName'] ?? $contact['first_name'] ?? null,
                    'last_name' => $contact['lastName'] ?? $contact['last_name'] ?? null,
                    'email' => $this->extractContactEmail($contact),
                    'phone' => $this->extractContactPhone($contact),
                    'timezone' => $contact['timezone'] ?? null,
                    'country' => $contact['country'] ?? null,
                    'source' => $contact['source'] ?? null,
                    'ghl_date_added' => $this->extractDateAdded($contact),
                    'raw_data' => $contact,
                ]
            );

            $this->saveContactTags($contactModel, $contact, $locationId);
            $this->saveContactCustomFields($contactModel, $contact);
            $this->saveContactAttribution($contactModel, $contact, $locationId);

            return $contactModel;
        })->filter()->values()->all();
    }

    private function extractContactEmail(array $contact): ?string
    {
        if (!empty($contact['email'])) {
            return $contact['email'];
        }

        $emailAddresses = $contact['emailAddresses'] ?? [];

        if (is_array($emailAddresses) && !empty($emailAddresses)) {
            $first = $emailAddresses[0] ?? null;

            if (is_array($first) && !empty($first['value'])) {
                return $first['value'];
            }
        }

        return null;
    }

    private function extractContactPhone(array $contact): ?string
    {
        if (!empty($contact['phone'])) {
            return $contact['phone'];
        }

        $phones = $contact['phones'] ?? [];

        if (is_array($phones) && !empty($phones)) {
            $first = $phones[0] ?? null;

            if (is_array($first) && !empty($first['value'])) {
                return $first['value'];
            }
        }

        return null;
    }

    private function extractDateAdded(array $contact): ?string
    {
        $dateAdded = $contact['dateAdded'] ?? $contact['date_added'] ?? null;

        if (!$dateAdded) {
            return null;
        }

        return $dateAdded;
    }

    private function saveContactTags(GhlContact $contactModel, array $contact, string $locationId): void
    {
        $tags = $contact['tags'] ?? [];

        if (!is_array($tags) || $tags === []) {
            return;
        }

        foreach ($tags as $tag) {
            $tagName = is_array($tag)
                ? ($tag['name'] ?? $tag['tag'] ?? null)
                : $tag;

            if (!is_string($tagName) || trim($tagName) === '') {
                continue;
            }

            GhlContactTag::updateOrCreate(
                [
                    'contact_id' => $contactModel->id,
                    'tag' => trim($tagName),
                ],
                [
                    'location_id' => $locationId,
                ]
            );
        }
    }

    private function saveContactCustomFields(GhlContact $contactModel, array $contact): void
    {
        $customFields = $contact['customFields'] ?? $contact['custom_fields'] ?? [];

        if (!is_array($customFields) || $customFields === []) {
            return;
        }

        foreach ($customFields as $field) {
            if (!is_array($field)) {
                continue;
            }

            $fieldId = $field['id'] ?? $field['fieldId'] ?? $field['field_id'] ?? null;
            $value = $this->normalizeCustomFieldValue($field['value'] ?? $field['fieldValue'] ?? null);

            if (!$fieldId) {
                continue;
            }

            GhlContactCustomField::updateOrCreate(
                [
                    'contact_id' => $contactModel->id,
                    'field_id' => (string) $fieldId,
                ],
                [
                    'value' => $value,
                ]
            );
        }
    }

    private function normalizeCustomFieldValue(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        if (is_array($value) || is_object($value)) {
            return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        }

        if (is_bool($value)) {
            return $value ? 'true' : 'false';
        }

        return (string) $value;
    }

    private function saveContactAttribution(GhlContact $contactModel, array $contact, string $locationId): void
    {
        $attribution = $contact['attribution'] ?? $contact['attributions'] ?? [];

        if (!is_array($attribution) || $attribution === []) {
            return;
        }

        GhlContactAttribution::updateOrCreate(
            [
                'contact_id' => $contactModel->id,
            ],
            [
                'location_id' => $locationId,
                'url' => $attribution['url'] ?? $attribution['pageUrl'] ?? null,
                'campaign' => $attribution['campaign'] ?? null,
                'utm_source' => $attribution['utm_source'] ?? $attribution['utmSource'] ?? null,
                'utm_medium' => $attribution['utm_medium'] ?? $attribution['utmMedium'] ?? null,
                'utm_content' => $attribution['utm_content'] ?? $attribution['utmContent'] ?? null,
                'referrer' => $attribution['referrer'] ?? null,
                'campaign_id' => $attribution['campaign_id'] ?? $attribution['campaignId'] ?? null,
                'fbclid' => $attribution['fbclid'] ?? null,
                'gclid' => $attribution['gclid'] ?? null,
                'msclikid' => $attribution['msclikid'] ?? null,
                'dclid' => $attribution['dclid'] ?? null,
                'fbc' => $attribution['fbc'] ?? null,
                'fbp' => $attribution['fbp'] ?? null,
                'fb_event_id' => $attribution['fb_event_id'] ?? $attribution['fbEventId'] ?? null,
                'user_agent' => $attribution['user_agent'] ?? $attribution['userAgent'] ?? null,
                'ip' => $attribution['ip'] ?? null,
                'medium' => $attribution['medium'] ?? null,
                'medium_id' => $attribution['medium_id'] ?? $attribution['mediumId'] ?? null,
            ]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Save Businesses
    |--------------------------------------------------------------------------
    */

    private function saveBusinesses(
        array $businesses,
        string $locationId,
        GhlAuth $ghlAuth
    ) {

        return collect($businesses)->map(function ($business) use ($locationId, $ghlAuth) {

            return Businesses::updateOrCreate(
                [
                    'business_id' => $business['id'],
                ],
                [
                    'location_id' => $locationId,
                    'company_id' => $ghlAuth->company_id,

                    'name' => $business['name'] ?? null,
                    'email' => $business['email'] ?? null,
                    'phone' => $business['phone'] ?? null,

                    'description' => $business['description'] ?? null,

                    'address' => $business['address'] ?? null,
                    'city' => $business['city'] ?? null,
                    'state' => $business['state'] ?? null,
                    'postal_code' => $business['postalCode'] ?? null,
                    'country' => $business['country'] ?? null,

                    'website' => $business['website'] ?? null,

                    'facebook_url' =>
                        $business['facebookUrl'] ?? null,

                    'instagram_url' =>
                        $business['instagramUrl'] ?? null,

                    'linkedin_url' =>
                        $business['linkedinUrl'] ?? null,

                    'metadata' => $business,
                ]
            );
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Error Response
    |--------------------------------------------------------------------------
    */

    private function errorResponse(
        string $message,
        int $status = 500
    ): JsonResponse {

        return response()->json([
            'success' => false,
            'message' => $message,
        ], $status);
    }
}
