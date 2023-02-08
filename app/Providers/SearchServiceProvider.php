<?php

namespace App\Providers;

use App\Contracts\SearchClient;
use App\Services\Search\ElasticsearchClient;
use Elastic\Elasticsearch\ClientBuilder;
use Illuminate\Support\ServiceProvider;

class SearchServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        app()->singleton(SearchClient::class, function($app) {
            return new ElasticsearchClient('product_index', ['localhost:9200']);
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
