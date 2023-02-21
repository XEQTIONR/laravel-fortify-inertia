<?php

namespace App\Jobs;

use App\Models\Order;
use App\Models\OrderReceipt;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class GenerateOrderReceipt implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $order;
    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(Order $order)
    {
        $order->load(['items.product', 'address']);
        $this->order = $order;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->order->load('address', 'items.product', 'user');

        $pdf = app(\App\Services\PDF::class);

        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);

        $pdf->Cell(200, 10, "Order Receipt", '', 1, 'C');

        $pdf->Ln(10);

        $pdf->Cell(40,10, "Order # {$this->order->id}", '', 1);

        $pdf->SetFont('Arial','',12);
        $pdf->Cell(40, 10, $this->order->user->name, '', 1);

        if ($this->order->address->business_name) {
            $pdf->Cell(120, 6, $this->order->address->business_name, '', 1);
        }
        $address = explode("\n", $this->order->address->address);

        foreach($address as $addressLine) {
            $pdf->Cell(120, 6, $addressLine, '', 1);
        }

        $pdf->Ln(4);

        $pdf->SetFont('Arial','B',12);
        $pdf->Cell(25, 6, 'Deliver on: ', '', 0);

        $dateObj = new \Carbon\Carbon($this->order->delivery_date);
        $dateStr = $dateObj->format('jS F Y');

        $pdf->SetFont('Arial','',12);
        $pdf->Cell(40, 6, $dateStr. '  ' . \App\Models\Order::$timeSlots[$this->order->time_slot], '', 1);

        $pdf->Ln(10);

        $pdf->printOrderTable($this->order);
        $fileName = "receipts/order-{$this->order->id}-1.pdf";
        Storage::put( $fileName, $pdf->Output('S') );

        OrderReceipt::create([
           'order_id' => $this->order->id,
           'version' => 1,
           'current' => true,
           'file' => $fileName,
        ]);
    }
}
