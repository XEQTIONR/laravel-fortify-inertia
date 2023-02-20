<?php

namespace App\Services;

class PDF extends \FPDF
{
    function Header()
    {
        // Arial bold 15
        $this->SetFont('Arial','B',15);
        // Move to the right
        $this->Cell(80);
        // Title
        $this->Cell(30,10,'Title',0,'C');
        // Line break
        $this->Ln(20);
    }

    function printOrderTable($order)
    {
        $headers = [ '#', 'Item', 'Qty', 'Unit Price', 'Total' ];
        // Colors, line width and bold font
        $this->SetFillColor(128,128,128);
        $this->SetTextColor(255);
        $this->SetDrawColor(0,0,0);
        $this->SetLineWidth(.3);
        $this->SetFont('','B');
        // Header
        $w = array(10, 80, 25, 35, 40);
        for($i=0;$i<count($headers);$i++)
            $this->Cell($w[$i],7,$headers[$i],1,0,'C',true);
        $this->Ln();
        // Color and font restoration
        $this->SetFillColor(224,235,255);
        $this->SetTextColor(0);
        $this->SetFont('');
        // Data
        $fill = false;
        $i = 1;
        foreach($order->items as $row)
        {
            $this->Cell($w[0],6,$i,'LR',0,'C',$fill);
            $this->Cell($w[1],6,$row->product->english_name,'LR',0,'L',$fill);
            $this->Cell($w[2],6,$row->qty,'LR',0,'C',$fill);
            $this->Cell($w[3],6,number_format($row->price, 2, '.', ''),'LR',0,'R',$fill);
            $this->Cell($w[4],6,number_format($row->price * $row->qty, 2, '.', ''),'LR',0,'R',$fill);
            $this->Ln();
            $fill = !$fill;
            $i++;
        }
        $this->SetFillColor(128,128,128);
        $this->SetFont('','B');
        $this->SetTextColor(255);
        $this->Cell($w[0],6,'','LR',0,'C',true);
        $this->Cell($w[1],6,'Sub-Total','LR',0,'L',true);
        $this->Cell($w[2],6,$order->items->reduce(fn($carry, $item) => $carry+$item->qty, 0),'LR',0,'C',true);
        $this->Cell($w[3],6,'','LR',0,'C',true);
        $this->Cell($w[4],6,number_format($order->subtotal,2,'.',''),'LR',0,'R',true);
        $this->Ln();

        // Closing line
        $this->Cell(array_sum($w),0,'','T');
    }
}
