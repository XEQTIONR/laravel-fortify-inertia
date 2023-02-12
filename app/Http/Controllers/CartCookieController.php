<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;

class CartCookieController extends Controller
{
    /**
     * Handle the incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    private $cookieName = 'shopping-cart';

    public function __invoke(Request $request)
    {
        $cookie = $request->cookie($this->cookieName);

        $response = new Response('Cookie Set');
        if ( is_null( $cookie ) ) {
            $response->withCookie(Cookie::make(
                name: $this->cookieName,
                value: Str::random(),
                minutes: 100000,
                httpOnly: false,
            ));
        }
        return $response;
    }
}
