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
        Schema::table('ghlaut', function (Blueprint $table) {
            $table->string('company_id', 255)->nullable()->index();
            $table->string('location_id', 255)->nullable()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ghlaut', function (Blueprint $table) {
            //
        });
    }
};
