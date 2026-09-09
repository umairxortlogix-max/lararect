<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contacts', function (Blueprint $table) {
            $table->id();

            // GHL identifiers
            $table->string('ghl_contact_id')->unique();
            $table->string('location_id')->index();
            $table->string('business_id')->nullable()->index();

            // Basic contact information
            $table->string('name')->nullable();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();

            $table->string('email')->nullable()->index();
            $table->string('phone')->nullable()->index();

            // Contact information
            $table->string('timezone')->nullable();
            $table->string('country')->nullable();
            $table->string('source')->nullable();

            // GHL dates
            $table->timestamp('ghl_date_added')->nullable();

            // Optional raw response
            $table->json('raw_data')->nullable();

            $table->timestamps();

            $table->index(['location_id', 'business_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contacts');
    }
};
