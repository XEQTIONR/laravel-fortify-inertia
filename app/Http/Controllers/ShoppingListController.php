<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Contracts\PDF;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\ShoppingListController as Controller;

class ShoppingListController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|Response
     */
    public function __invoke( Request $request )
    {

        $items = parent::__invoke($request);
        if( get_class($items) === Collection::class ) {

            return response()->stream(function() use ($items) {
                $defaultConfig = (new \Mpdf\Config\ConfigVariables())->getDefaults();
                $fontDirs = $defaultConfig['fontDir'];

                $defaultFontConfig = (new \Mpdf\Config\FontVariables())->getDefaults();
                $fontData = $defaultFontConfig['fontdata'];

                $pdf = new \Mpdf\Mpdf([
                    'fontDir' => array_merge($fontDirs, [
                        public_path(''),
                    ]),
                    'fontdata' => $fontData + [ // lowercase letters only in font key
                            'bangla' => [
                                'R' => 'Nikosh.ttf',
                                'useOTL' => 0xFF,
                            ]
                        ],
                    'default_font' => 'bangla'
                ]);
                $pdf->SetHTMLFooter("<h6 style='text-align: center'>{PAGENO}</h6>");
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
                $pdf->WriteHTML("<h2 style='text-align: center'>Shopping List</h2>");
                $pdf->WriteHTML('<table width="100%">');
                $pdf->WriteHTML('<thead><tr style="background-color: #AAA;">');


                $table_headers = [
                    'Product' => [ 'width' => '40%', 'align' => 'left'],
                    'Qty' => [ 'width' => '50%', 'align' => 'center'],
                    'Total' => [ 'width' => '10%', 'align' => 'center'],
                ];

                foreach ($table_headers as $header => $props) {
                    $pdf->WriteHTML("<th align='{$props['align']}' width='{$props['width']}'>{$header}</th>");
                }

                $pdf->WriteHTML('</tr></thead>');
                $pdf->WriteHTML('<tbody>');

                $i=0;
                foreach ( $items as $key => $vals ) {
                    $tr = $i%2 === 0 ? '<tr>' : '<tr style="background-color: #DDD;">';
                    $pdf->WriteHTML($tr);
                    $pdf->WriteHTML("<td style='1px solid black'>$key - {$vals[0]['product']['english_name']} / {$vals[0]['product']['bangla_name']} - {$vals[0]['product']['amount']} {$vals[0]['product']['uom']}</td>");

                    $orders = $vals->map(fn($thing) => "({$thing['order_id']}){$thing['qty']}");
                    $orders = $orders->join(', ');
                    $pdf->WriteHTML("<td>$orders</td>");

                    $total_qty =  $vals->reduce(fn($carry, $thing) => $carry + $thing['qty'], 0);

                    $pdf->WriteHTML("<td align='center'>$total_qty</td>");
                    $pdf->WriteHTML('<tr>');
                    $i++;
                }

                $pdf->WriteHTML('</tbody>');
                $pdf->WriteHTML('</table>');
                $pdf->WriteHTML("</body></html>");
                $pdf->Output();


            }, 200, [ 'Content-type' => 'application/pdf' ]);
        }

        return $items; // return the error

    }
}
