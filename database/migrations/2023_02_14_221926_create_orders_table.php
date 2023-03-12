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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('payment_type')->default('cash');
            $table->foreignId('address_id')->nullable();
            $table->integer('subtotal');
            $table->string('delivery_charge_type');
            $table->float('delivery_charge_amount');
            $table->integer('delivery_charge');
            $table->integer('total');
            $table->integer('payments_total')->default(0);
            $table->date('delivery_date');
            $table->integer('time_slot');
            $table->string('status');
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
        Schema::dropIfExists('orders');
    }
};
