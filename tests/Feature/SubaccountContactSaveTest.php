<?php

use App\Http\Controllers\SubaccountController;
use App\Models\GhlContact;
use App\Models\GhlContactAttribution;
use App\Models\GhlContactCustomField;
use App\Models\GhlContactTag;

it('saves contact information into the related contact tables', function () {
    $controller = new SubaccountController();

    $contacts = [[
        'id' => 'ghl-contact-123',
        'locationId' => 'location-1',
        'businessId' => 'business-1',
        'name' => 'John Doe',
        'firstName' => 'John',
        'lastName' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '+123456789',
        'timezone' => 'UTC',
        'country' => 'PK',
        'source' => 'Website',
        'dateAdded' => '2026-09-10T10:00:00Z',
        'tags' => ['VIP', 'Customer'],
        'customFields' => [
            ['id' => 'field-1', 'value' => ['Alumni', 'VIP']],
            ['fieldId' => 'field-2', 'value' => 'High Value'],
        ],
        'attribution' => [
            'url' => 'https://example.com',
            'campaign' => 'Summer',
            'utm_source' => 'google',
            'utm_medium' => 'cpc',
            'utm_content' => 'landing-page',
            'referrer' => 'https://google.com',
            'fbclid' => 'fbclid-123',
            'gclid' => 'gclid-123',
        ],
    ]];

    $method = new ReflectionMethod(SubaccountController::class, 'saveContacts');
    $method->setAccessible(true);
    $method->invoke($controller, $contacts, 'location-1');

    $contact = GhlContact::query()->where('ghl_contact_id', 'ghl-contact-123')->first();

    expect($contact)->not->toBeNull()
        ->and($contact->name)->toBe('John Doe')
        ->and($contact->email)->toBe('john@example.com')
        ->and($contact->business_id)->toBe('business-1');

    $customField = GhlContactCustomField::query()
        ->where('contact_id', $contact->id)
        ->where('field_id', 'field-1')
        ->first();

    expect(GhlContactTag::query()->where('contact_id', $contact->id)->count())->toBe(2)
        ->and(GhlContactCustomField::query()->where('contact_id', $contact->id)->count())->toBe(2)
        ->and($customField?->value)->toBe('["Alumni","VIP"]')
        ->and(GhlContactAttribution::query()->where('contact_id', $contact->id)->count())->toBe(1);
});
