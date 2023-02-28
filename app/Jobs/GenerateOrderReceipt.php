<?php

namespace App\Jobs;

use App\Contracts\PDF;
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

        $pdf = app(PDF::class);

        $pdf->WriteHTML("<html><head><style>
          table {
            border-top: 1px solid black;
            border-collapse: collapse;
            page-break-inside:avoid;
          }

          td, th {
              border-left: 1px solid black;
              border-right: 1px solid black;
              border-bottom: 1px solid black;
              border-collapse: collapse;
	      }

	      tfoot tr td {
	        font-weight: bold;
	      }

	      </style></head><body>"
        );

        $pdf->WriteHTML("<h2 style='text-align: center'>Order receipt</h2>");

        $pdf->WriteHTML("<h3>Order # {$this->order->id}</h3>");

        $pdf->WriteHTML("<p>{$this->order->user->name}</p>");

        if ($this->order->address->business_name) {
            $pdf->WriteHTML("<p>{$this->order->address->business_name}</p>");
        }
        $address = explode("\n", $this->order->address->address);

        foreach($address as $addressLine) {
            $pdf->WriteHTML("{$addressLine}");
        }

        $dateObj = new \Carbon\Carbon($this->order->delivery_date);
        $dateStr = $dateObj->format('jS F Y');
        $slot = \App\Models\Order::$timeSlots[$this->order->time_slot];
        $pdf->WriteHTML("<p>Deliver on: $dateStr $slot</p>");

        $table_headers = [
            '#' => [ 'width' => '10%', 'align' => 'center'],
            'Item' => [ 'width' => '45%', 'align' => 'left'],
            'Qty' => [ 'width' => '10%', 'align' => 'center'],
            'Unit Price' => [ 'width' => '15%', 'align' => 'center'],
            'Total' => [ 'width' => '20%', 'align' => 'center'],
        ];

        $pdf->WriteHTML('<table width="100%">');
        $pdf->WriteHTML('<thead><tr style="background-color: #AAA;">');

        foreach ($table_headers as $header => $props) {
            $pdf->WriteHTML("<th align='{$props['align']}' width='{$props['width']}'>{$header}</th>");
        }

        $pdf->WriteHTML('</tr></thead>');
        $pdf->WriteHTML('<tbody>');
        $i=0;

        foreach($this->order->items as $row)
        {
            $tr = $i%2 === 0 ? '<tr>' : '<tr style="background-color: #DDD;">';
            $pdf->WriteHTML($tr);
            $sl = $i+1;
            $pdf->WriteHTML("<td align='center'>{$sl}</td>");
            $pdf->WriteHTML("<td>{$row->product->english_name} / {$row->product->bangla_name} - {$row->product->amount} {$row->product->uom}</td>");
            $pdf->WriteHTML("<td align='center'>$row->qty</td>");
            $price = number_format($row->price, 2, '.', '');
            $pdf->WriteHTML("<td align='right'>{$price}</td>");
            $rowtotal = number_format($row->price * $row->qty, 2, '.', '');
            $pdf->WriteHTML("<td align='right'>{$rowtotal}</td>");
            $pdf->WriteHTML('</tr>');
            $i++;
        }
        $pdf->WriteHTML('</tobdy>');
        $pdf->WriteHTML('<tfoot>');
        $subtotal = number_format($this->order->subtotal,2,'.','');
        $pdf->WriteHTML("<tr style='background-color: #BBB;'><td></td><td>Subtotal</td><td></td><td></td><td align='right'>{$subtotal}</td></tr>");

        $delivery_charge = number_format($this->order->delivery_charge,2,'.','');
        $pdf->WriteHTML("<tr style='background-color: #AAA;'><td></td><td>Delivery Charge</td><td></td><td></td><td align='right'>{$delivery_charge}</td></tr>");

        $total = number_format($this->order->total,2,'.','');
        $pdf->WriteHTML("<tr style='background-color: #999;'><td></td><td>Grand Total</td><td></td><td></td><td align='right'>{$total}</td></tr>");

        $pdf->WriteHTML('</tfoot>');
        $pdf->WriteHTML('</table>');

        $fileName = "receipts/order-{$this->order->id}-v1.pdf";
        Storage::put( $fileName, $pdf->Output('', 'S') );

        OrderReceipt::create([
           'order_id' => $this->order->id,
           'version' => 1,
           'current' => true,
           'file' => $fileName,
        ]);
    }
}
