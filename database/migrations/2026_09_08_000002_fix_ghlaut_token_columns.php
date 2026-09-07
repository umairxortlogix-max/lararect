<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('ghlaut')) {
            Schema::table('ghlaut', function (Blueprint $table) {
                $table->text('access_token')->change();
                $table->string('token_type', 50)->change();
                $table->text('refresh_token')->change();
                $table->integer('expires_in')->nullable()->change();
                $table->unsignedBigInteger('user_id')->change();
                $table->string('user_type', 50)->nullable()->change();
            });

            if (! Schema::hasColumn('ghlaut', 'company_id')) {
                Schema::table('ghlaut', function (Blueprint $table) {
                    $table->string('company_id', 255)->nullable()->after('user_type');
                });
            }

            if (! Schema::hasColumn('ghlaut', 'location_id')) {
                Schema::table('ghlaut', function (Blueprint $table) {
                    $table->string('location_id', 255)->nullable()->after('company_id');
                });
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('ghlaut')) {
            Schema::table('ghlaut', function (Blueprint $table) {
                $table->string('access_token')->change();
                $table->string('token_type')->change();
                $table->string('refresh_token')->change();
                $table->string('expires_in')->change();
                $table->string('user_id')->change();
                $table->string('user_type')->nullable()->change();
            });
        }
    }
};
