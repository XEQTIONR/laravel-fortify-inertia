<?php

namespace App\Contracts;

interface SearchClient {

    public function search( string $query, array $fields, int $numResults );
    public function index( $id, array $data );
}

