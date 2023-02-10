<?php

namespace App\Services\Search;

use App\Contracts\SearchClient;
use Elastic\Elasticsearch\ClientBuilder;
use Elastic\Elasticsearch\Client;

class ElasticsearchClient implements SearchClient
{
    protected Client $client;
    protected string $index;

    /**
     * @param string $index
     * @param array $hosts
     * @throws \Elastic\Elasticsearch\Exception\AuthenticationException
     */
    public function __construct(string $index, array $hosts = ['localhost:9200'])
    {
        $this->client = ClientBuilder::create()
            ->setHosts($hosts)
            ->build();
        $this->index = $index;
    }

    public function search(string $query, array $fields, $numResults = 10)
    {
        $params = [
            'index' => $this->index,
            'size'   => $numResults,
            'body' => [
                'query' => [
                    'multi_match' => [
                        'query' => $query,
                        'fields' => $fields
                    ],

                ]
            ]
        ];

        return $this->client->search($params)->asArray();
    }

    /**
     * @param string|int $id
     * @param array $data
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function index($id, array $data) {
        $params = [
            'index' => $this->index,
            'id' => $id,
            'body' => $data
        ];

        $this->client->index($params);
    }

    /**
     * @param array $ids
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     */
    public function indexMany(array $ids, array $data){
        $params = [ 'body' => [] ];

        for ($i = 0; $i < count($ids); $i++) {
            $params['body'][] = [
                'index' => [
                    '_index' => $this->index,
                    '_id' => $ids[$i],
                ]
            ];
            $params['body'][] = $data[$i];
        }

        $this->client->bulk($params);
    }

    /**
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function update($id, array $data) {
        if ( isset($data['status']) && $data['status'] === 'inactive' ) {
            $this->delete($id);
        } else {
            $params = [
                'index' => $this->index,
                'id' => $id,
                'body' => [
                    'doc' => $data
                ]
            ];

            $this->client->update($params);
        }
    }

    /**
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function delete($id) {
        $params = [
            'index' => $this->index,
            'id'    => $id
        ];

        $this->client->delete($params);
    }

    /**
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function deleteMany(array $ids) {
        $stringIDs = array_map(fn($id) => strval($id), $ids);
        $params = [
            'index' => $this->index,
            'body' => [
                'query' => [
                    'ids' => [
                        'values' => $stringIDs
                    ]
                ]
            ]
        ];
        $this->client->deleteByQuery($params);
    }

    /**
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function createIndex($indexParam) {
        $this->client->indices()->create(['index' => $indexParam ?? $this->index]);
    }

    /**
     * @throws \Elastic\Elasticsearch\Exception\ServerResponseException
     * @throws \Elastic\Elasticsearch\Exception\ClientResponseException
     * @throws \Elastic\Elasticsearch\Exception\MissingParameterException
     */
    public function deleteIndex($indexParam) {
        $this->client->indices()->delete(['index' => $indexParam ?? $this->index]);
    }
}
