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
        Schema::create('ghl_contact_custom_fields', function (Blueprint $table) {
            $table->id();

            $table->foreignId('contact_id')
                ->constrained('contacts')
                ->cascadeOnDelete();

            $table->string('field_id')->index();
            $table->text('value')->nullable();

            $table->timestamps();

            $table->unique(['contact_id', 'field_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ghl_contact_custom_fields');
    }
};
