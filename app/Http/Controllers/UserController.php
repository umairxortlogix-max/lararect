<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::all();
        return inertia('user/user', ['users' => $users]);
    }
    public function save(Request $request)
    {

        $req = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'location_id' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $req['name'],
            'email' => $req['email'],
            'location_id' => $req['location_id'],
            'password' => bcrypt($req['password']),
        ]);
        $user->assignRole('user');
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
        ]);
        $user->name = $req['name'];
        $user->email = $req['email'];
        $user->location_id = $req['location_id'];
        if (!empty($req['password'])) {
            $user->password = bcrypt($req['password']);
        }
        $user->save();
        return redirect()->back()->with('success', 'User updated successfully.');
    }
    public function delete($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return redirect()->back()->with('success', 'User deleted successfully.');
    }

}
