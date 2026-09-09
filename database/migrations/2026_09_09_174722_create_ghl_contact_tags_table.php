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
        Schema::create('ghl_contact_tags', function (Blueprint $table) {
            $table->id();

            $table->foreignId('contact_id')
                ->constrained('contacts')
                ->cascadeOnDelete();
            $table->string('location_id')->index();  
            $table->string('tag')->index();

            $table->timestamps();

            $table->unique(['contact_id', 'tag']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ghl_contact_tags');
    }
};
