<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PermissionGuardTest extends TestCase
{
    use RefreshDatabase;

    public function test_permission_ids_from_other_guards_are_rejected(): void
    {
        Role::create(['name' => 'super_admin', 'guard_name' => 'web']);
        $role = Role::create(['name' => 'editor', 'guard_name' => 'web']);

        $admin = User::factory()->create();
        $admin->assignRole('super_admin');

        $webPermission = Permission::create(['name' => 'view dashboard', 'guard_name' => 'web']);
        $apiPermission = Permission::create(['name' => 'view api dashboard', 'guard_name' => 'api']);

        $response = $this
            ->actingAs($admin)
            ->from(route('dashboard'))
            ->post(route('permissions.update'), [
                'role_id' => $role->id,
                'permissions' => [$apiPermission->id, $webPermission->id],
            ]);

        $response->assertSessionHasErrors(['permissions.0']);

        $this->assertDatabaseMissing('role_has_permissions', [
            'role_id' => $role->id,
            'permission_id' => $apiPermission->id,
        ]);
    }
}
