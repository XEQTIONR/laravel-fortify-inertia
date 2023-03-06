<?php

namespace App\Http\Controllers;

use App\Contracts\PDF;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\SupplierListController as Controller;
use Illuminate\Http\Response;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SupplierListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return StreamedResponse|Response
     */
    public function __invoke(Request $request)
    {

        $date = $request->input('date');
        $products = parent::__invoke($request);

        if ( get_class($products) === AnonymousResourceCollection::class ) {
            return response()->stream(function() use ($date, $products) {

                $pdf = app(PDF::class);

                $pdf->WriteHTML("<html><head><style>
                  table {
                    font-size: 12px;
                    border-top: 1px solid black;
                    border-collapse: collapse;
                  }

                  td, th {
                      border-left: 1px solid black;
                      border-right: 1px solid black;
                      border-bottom: 1px solid black;
                      border-collapse: collapse;
                  }</style></head><body>");
                $pdf->WriteHTML("<h2 style='text-align: center'>Supplier List</h2>");
                $pdf->WriteHTML("<h6  style='text-align: right'>{$date}</h6>");
                $pdf->WriteHTML('<table width="100%">');
                $pdf->WriteHTML('<thead><tr style="background-color: #AAA;">');


                $table_headers = [
                    'Product' => [ 'width' => '30%', 'align' => 'left'],
                    'Suppliers' => [ 'width' => '70%', 'align' => 'left'],
                ];

                foreach ($table_headers as $header => $props) {
                    $pdf->WriteHTML("<th align='{$props['align']}' width='{$props['width']}'>{$header}</th>");
                }

                $pdf->WriteHTML('</tr></thead>');
                $pdf->WriteHTML('<tbody>');

                $i=0;
                foreach ( $products as $product ) {
                    $tr = $i%2 === 0 ? '<tr>' : '<tr style="background-color: #DDD;">';
                    $pdf->WriteHTML($tr);
                    $pdf->WriteHTML("<td style='1px solid black'>{$product['id']} - {$product['english_name']} / {$product['bangla_name']} - {$product['amount']} {$product['uom']}</td>");

                    //$orders = $vals->map(fn($thing) => "({$thing['order_id']}){$thing['qty']}");
                    //$orders = $orders->join(', ');

                    $suppliers = $product['suppliers']->map(fn($supplier) => "{$supplier->contact_name}-{$supplier->business_name} ({$supplier->address}-{$supplier->primary_contact_number})");
                    $suppliers = $suppliers->join(', ');
                    $pdf->WriteHTML("<td>$suppliers</td>");

                    $pdf->WriteHTML('</tr>');
                    $i++;
                }

                $pdf->WriteHTML('</tbody>');
                $pdf->WriteHTML('</table>');
                $pdf->WriteHTML("</body></html>");
                $pdf->Output();
            }, 200, [ 'Content-type' => 'application/pdf' ]);
        }

        return $products; // return the error
    }
}
