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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->id();
            $table->string('contact_name');
            $table->string('business_name')->nullable();
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->string('primary_contact_number')->nullable();
            $table->string('secondary_phone_number')->nullable();
            $table->text('notes')->nullable();
            $table->string('status');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('suppliers');
    }
};
