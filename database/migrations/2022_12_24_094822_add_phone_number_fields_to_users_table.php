<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {

            $table->string('primary_contact_number', 20)
                ->after('remember_token');
            $table->string('other_contact_number', 20)->nullable()
                ->after('primary_contact_number');
            $table->string('sms_verification_code', 10)
                ->after('other_contact_number');
            $table->timestamp('sms_verified_at')->nullable()
                ->after('other_contact_number');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'primary_contact_number',
                'other_contact_number',
                'sms_verification_code',
                'sms_verified_at'
            ]);
        });
    }
};
