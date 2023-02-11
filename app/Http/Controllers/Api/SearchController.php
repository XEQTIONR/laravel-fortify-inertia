<?php

namespace App\Http\Controllers\Api;

use App\Contracts\SearchClient;
use App\Http\Controllers\Controller;

class SearchController extends Controller
{
    /**
     * Search and display results
     *
     */
    public function __invoke(string $query)
    {
        $fields = ['english_name', 'bangla_name'];
        $client = app(SearchClient::class);
        return $client->search($query, $fields);

    }
}
