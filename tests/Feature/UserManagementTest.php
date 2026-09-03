<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_information_can_be_updated(): void
    {
        $admin = User::factory()->create();
        $user = User::factory()->create([
            'name' => 'Old Name',
            'email' => 'old@example.com',
            'location_id' => 'old-location',
        ]);

        $response = $this
            ->actingAs($admin)
            ->withSession(['_token' => 'test-token'])
            ->from(route('users'))
            ->put(route('users.update', $user), [
                '_token' => 'test-token',
                'name' => 'Updated Name',
                'email' => 'updated@example.com',
                'location_id' => 'new-location',
                'password' => '',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users'));

        // $user->refresh();

        $this->assertSame('Updated Name', $user->name);
        $this->assertSame('updated@example.com', $user->email);
        $this->assertSame('new-location', $user->location_id);
    }
}
