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
        Schema::create('ghl_contact_attributions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('contact_id')
                ->constrained('contacts')
                ->cascadeOnDelete();
            $table->string('location_id')->index();
            $table->string('url')->nullable();
            $table->string('campaign')->nullable();
            $table->string('utm_source')->nullable();
            $table->string('utm_medium')->nullable();
            $table->string('utm_content')->nullable();

            $table->text('referrer')->nullable();

            $table->string('campaign_id')->nullable();
            $table->string('fbclid')->nullable();
            $table->string('gclid')->nullable();
            $table->string('msclikid')->nullable();
            $table->string('dclid')->nullable();

            $table->string('fbc')->nullable();
            $table->string('fbp')->nullable();
            $table->string('fb_event_id')->nullable();

            $table->text('user_agent')->nullable();
            $table->string('ip')->nullable();

            $table->string('medium')->nullable();
            $table->string('medium_id')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ghl_contact_attributions');
    }
};
