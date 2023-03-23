<?php

namespace App\Services\SMS;

use App\Contracts\SMSClient;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SMSNetBDClient implements SMSClient
{
    protected $apiKey;
    protected $apiEndpoint;

    public function __construct() {
        $this->apiKey = config('app.sms.api_key');
        $this->apiEndpoint = config('app.sms.api_endpoint');
    }

    public function send(string $text, string $to)
    {
        $response = json_encode([
            'endpoint' => $this->apiEndpoint,
            'api_key' => $this->apiKey,
            'to' => $to,
            'msg' => $text,
        ]);
//        $response = Http::get($this->apiEndpoint, [
//            'api_key' => $this->apiKey,
//            'to' => $to,
//            'msg' => $text,
//        ]);

        Log::info($response);

        return $response;
    }
}
