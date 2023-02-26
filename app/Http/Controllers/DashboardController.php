<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\DashboardController as Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke()
    {
        return Inertia::render('Admin/Dashboard', parent::__invoke());
    }
}
