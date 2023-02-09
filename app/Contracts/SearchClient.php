<?php

namespace App\Contracts;

interface SearchClient {

    public function search( string $query, array $fields, int $numResults );
    public function index( $id, array $data );
    public function update( $id, array $data );
    public function delete( $id );
}

