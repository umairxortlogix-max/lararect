<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        abort_unless(
            $user?->hasRole('super_admin'),
            403
        );

        $permissions = Permission::where(
            'guard_name',
            'web'
        )
            ->orderBy('name')
            ->get(['id', 'name', 'guard_name']);

        $roles = Role::where('guard_name', 'web')
            ->with('permissions:id,name')
            ->orderBy('name')
            ->get(['id', 'name']);

        $users = User::with('roles')
            ->orderBy('name')
            ->get()
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'roles' => $user->getRoleNames()->values()->all(),
                'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
            ])
            ->values();

        return inertia('permissions/permissions', [
            'permissions' => $permissions,
            'roles' => $roles,
            'users' => $users,
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        abort_unless(
            $user?->hasRole('super_admin'),
            403
        );

        $validated = $request->validate([
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'permissions' => ['nullable', 'array'],
            'permissions.*' => [
                'integer',
                Rule::exists('permissions', 'id')->where('guard_name', 'web'),
            ],
        ]);

        $role = Role::where('guard_name', 'web')
            ->findOrFail($validated['role_id']);

        $role->syncPermissions(
            $validated['permissions'] ?? []
        );

        return back()->with(
            'success',
            'Permissions updated successfully.'
        );
    }
}
