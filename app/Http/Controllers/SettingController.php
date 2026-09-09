<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $settings = Setting::where('User_id', auth()->id())->get();
        $user = auth()->user();

        return inertia('settings', [
            'settings' => $settings,
            'isSuperAdmin' => $user->hasRole('super_admin'),
            'isAdmin' => $user->hasAnyRole(['admin', 'super_admin']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    // public function create()
    // {

    // }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'settings.dashboard_image' => ['nullable', 'image', 'max:5120'],
        ]);

        return $this->save($request);
    }

    public function save(Request $request)
    {
        $settings = $request->input('settings', []);

        if ($request->hasFile('settings.dashboard_image')) {
            $settings['dashboard_image'] = $request->file('settings.dashboard_image')
                ->store('settings', 'public');
        }

        foreach ($settings as $key => $value) {

            if (!is_string($key) || trim($key) === '') {
                continue;
            }

            Setting::updateOrCreate(
                [
                    'User_id' => auth()->id(),
                    'key' => $key,
                ],
                [
                    'value' => (string) $value,
                    'group' => 'ghl',
                ]
            );
        }

        return redirect()
            ->back()
            ->with('success', 'Settings saved successfully.');
    }
    /**
     * Display the specified resource.
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Setting $setting)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Setting $setting)
    {
        //
    }
}
