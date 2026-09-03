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

        return inertia('settings', ['settings' => $settings]);
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
        return $this->save($request);
    }

    public function save(Request $request)
    {
        $settings = $request->input('settings', []);

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
