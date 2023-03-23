<?php

namespace App\Contracts;

interface SMSClient {

    public function send( string $text, string $to );
}

