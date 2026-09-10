<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = ['super_admin', 'admin', 'user'];

        foreach ($roles as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
        $user = User::firstOrCreate(
            ['email' => 'superadmin@gmail.com'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
            ]
        );
        $user->assignRole('super_admin');


        $permissions = [
            'view dashboard',
            'view permissions',
            'view contact',
            'view products',
            'create products',
            'edit products',
            'delete products',

            'view users',
            'create users',
            'edit users',
            'delete users',

            'view settings',
            'edit settings',
        ];
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }
        $rolePermissions = [
            'super_admin' => $permissions,
            'admin' => [
                'view dashboard',
                'view products',
                'create products',
                'edit products',
                'delete products',
                'view users',
                'create users',
                'edit users',
                'delete users',
                'view settings',
                'edit settings',
            ],
            'user' => [
                'view dashboard',
                'view products',
            ],
        ];

        foreach ($rolePermissions as $roleName => $rolePermissionNames) {
            Role::findByName($roleName, 'web')->syncPermissions(
                Permission::whereIn('name', $rolePermissionNames)
                    ->where('guard_name', 'web')
                    ->get()
            );
        }

        User::query()->each(fn(User $user) => $user->syncPermissions([]));
    }
}
