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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('english_name');
            $table->string('bangla_name')->nullable();
            $table->string('english_description')->nullable();
            $table->string('bangla_description')->nullable();
            $table->string('notes')->nullable();
            $table->string('uom');
            $table->integer('current_selling_price')->nullable();
            $table->integer('in_stock')->nullable();
            $table->string('image')->nullable();
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
        Schema::dropIfExists('products');
    }
};
