<?php

namespace App\Console\Commands;

use App\Contracts\SearchClient;
use App\Services\Search\ElasticsearchClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Console\Command\Command as CommandAlias;
use Elastic\Elasticsearch\Exception\ClientResponseException;

class CreateSearchIndexes extends Command
{
    /**
     * Create (or delete) search index command.
     *
     * @var string
     */
    protected $signature = 'search:index {--remove}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create (or delete) indexes for search.';

    protected string $indexName = 'product_index';
    protected string $removeFlag = 'remove';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {

        $client = app(SearchClient::class);

        if ( $this->option($this->removeFlag) ) {
            try {
                $client->deleteIndex( $this->indexName );
                $this->info("$this->indexName deleted.");
            } catch (ClientResponseException $e) {
                $this->printError($e);
                return CommandAlias::FAILURE;
            }

        } else {
            try {
                $client->createIndex( $this->indexName );
                $this->info("$this->indexName created.");
            } catch (ClientResponseException $e) {
                $this->printError($e);
                return CommandAlias::FAILURE;
            }
        }

        return CommandAlias::SUCCESS;
    }

    /**
     * Helper function.
     *
     * @param ClientResponseException $e
     * @return void
     */
    private function printError(ClientResponseException $e) {
        $stream = (string) $e->getResponse()->getBody();
        $data = json_decode($stream, true);
        $this->error($data['error']['root_cause'][0]['reason']);
    }
}
