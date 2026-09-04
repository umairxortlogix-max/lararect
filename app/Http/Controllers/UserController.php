<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get()->map(fn (User $user) => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'location_id' => $user->location_id,
            'roles' => $user->getRoleNames()->values()->all(),
        ]);

        $roles = Role::where('guard_name', 'web');

        if (! auth()->user()->hasRole('super_admin')) {
            $roles->where('name', '!=', 'super_admin');
        }

        return inertia('user/user', [
            'users' => $users,
            'roles' => $roles->pluck('name')->values(),
        ]);
    }
    public function save(Request $request)
    {

        $req = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'location_id' => 'nullable|string|max:255',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        if (($req['role'] ?? null) === 'super_admin' && ! $request->user()->hasRole('super_admin')) {
            abort(403);
        }

        $user = User::create([
            'name' => $req['name'],
            'email' => $req['email'],
            'location_id' => $req['location_id'],
            'password' => bcrypt($req['password']),
        ]);
        $user->assignRole('admin');
        if (!empty($req['role'])) {
            $user->syncRoles([$req['role']]);
        }
        return redirect()->back()->with('success', 'User created successfully.');
    }
    public function update($id, Request $request)
    {
        $user = User::findOrFail($id);

        $req = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8|confirmed',
            'location_id' => 'nullable|string|max:255',
            'role' => 'nullable|string|exists:roles,name',
        ]);

        if (($req['role'] ?? null) === 'super_admin' && ! $request->user()->hasRole('super_admin')) {
            abort(403);
        }
        $user->name = $req['name'];
        $user->email = $req['email'];
        $user->location_id = $req['location_id'];
        if (!empty($req['password'])) {
            $user->password = bcrypt($req['password']);
        }
        $user->save();
        $user->syncRoles(!empty($req['role']) ? [$req['role']] : []);
        return redirect()->back()->with('success', 'User updated successfully.');
    }
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

}
