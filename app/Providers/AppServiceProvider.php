<?php

namespace App\Providers;

use App\Contracts\HierarchicalCategories;
use App\Contracts\PDF;
use App\Contracts\SMSClient;
use App\Models\Category;
use App\Services\HierarchicalCategoriesService;
use App\Services\PDF\FPDF;
use App\Services\SMS\SMSNetBDClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        app()->singleton(HierarchicalCategories::class, function() {
            $service = new HierarchicalCategoriesService();
            return $service->categoryTree(Category::all());
        });

        app()->singleton(SMSClient::class, function() {
           return new SMSNetBDClient();
        });

        app()->bind(PDF::class, function() {
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

            return $pdf;
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
