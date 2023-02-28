<?php

namespace App\Http\Controllers;

use App\Contracts\PDF;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\DeliveryListController as Controller;

class DeliveryListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function __invoke(Request $request)
    {
        $orders = parent::__invoke($request);

        $delivery_date = $request->input('date');

        $table_headers = [
            'Product' => [ 'width' => '80%', 'align' => 'left'],
            'Qty' => [ 'width' => '20%', 'align' => 'center']
        ];

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
	      }</style></head><body>"
        );

        $pdf->WriteHTML("<h2 style='text-align: center'>Delivery List - {$delivery_date}</h2>");

        foreach($orders->toArray($request) as $order) {
            $pdf->WriteHTML("<h4>Order # {$order['id']}</h4>");
            $pdf->WriteHTML("<p>{$order['address']['full_name']} - {$order['address']['business_name']} -  </p>");
            $pdf->WriteHTML("<p>{$order['address']['address']}</p>");
            $pdf->WriteHTML("<p>{$order['delivery_date']} - {$order['time_slot']}</p>");
            $pdf->WriteHTML('<table width="100%">');
            $pdf->WriteHTML('<thead><tr style="background-color: #AAA;">');

            foreach ($table_headers as $header => $props) {
                $pdf->WriteHTML("<th align='{$props['align']}' width='{$props['width']}'>{$header}</th>");
            }

            $pdf->WriteHTML('</tr></thead>');
            $pdf->WriteHTML('<tbody>');
            $i=0;
            foreach($order['items'] as $item) {
                $tr = $i%2 === 0 ? '<tr>' : '<tr style="background-color: #DDD;">';
                $pdf->WriteHTML($tr);
                $pdf->WriteHTML("<td style='1px solid black'>{$item['product']['english_name']} / {$item['product']['bangla_name']} - {$item['product']['amount']} {$item['product']['uom']}</td>");
                $pdf->WriteHTML("<td align='center'>{$item['qty']}</td>");
                $pdf->WriteHTML('<tr>');
                $i++;
            }

            $total = number_format($order['total'], '2', '.' ,'');
            $pdf->WriteHTML("<tr><th style='background-color: #AAA;' >Total : {$total}/-</th></tr>");
            $pdf->WriteHTML('</tbody>');

            $pdf->WriteHTML('</table>');
        }
        $pdf->WriteHTML("</body></html>");
        $pdf->Output();

    }
}
