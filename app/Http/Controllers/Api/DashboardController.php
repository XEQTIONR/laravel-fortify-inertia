<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function __invoke()
    {
        $now = Carbon::now();
        $today = [
            'date' => $now->toDateString(),
            'dayOfWeek' => $now->englishDayOfWeek,
            'day' => $now->day,
            'month' => $now->englishMonth,
            'year' => $now->year,
        ];
        $tomorrow = Carbon::now()->addDay();

        $incomplete = Order::whereIn('status', ['created', 'prepared'])->get();
        $past = $incomplete->where('delivery_date', '<', $now->toDateString());
        $future = $incomplete->where('delivery_date', '>=', $now->toDateString());

        $pastGrouped = $past->groupBy('delivery_date')->sortKeys();
        $futureGrouped = $future->groupBy('delivery_date')->sortKeys();

        return [
            'today' => $today,
            'tomorrowString' => $tomorrow->toDateString(),
            'past' => $pastGrouped,
            'future' => $futureGrouped,
        ];
    }
}
