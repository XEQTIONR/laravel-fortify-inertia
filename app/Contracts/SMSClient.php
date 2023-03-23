<?php

namespace App\Contracts;

interface SMSClient {

    public function sms( string $text, string $to );
}

