<?php

namespace App\Http\Middleware;

use App\Models\ShoppingCart;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Defines the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function share(Request $request): array
    {
        $user = auth()->user();
        $cookie = $request->cookie('shopping-cart', false);
        if ( ! $user ) {
           $items =  ShoppingCart::with('product')
                        ->where([
                            ['session_cookie', '=', $cookie],
                            ['user_id', '=', null]
                        ])
                        ->get();
        } else {
            $items = ShoppingCart::with('product')
                        ->whereIn('status', ['new', 'updated'])
                        ->where('session_cookie', $cookie)
                        ->orWhere(function(Builder $query) use ($user) {
                            $query->whereIn('status', ['new', 'updated'])
                                ->where('user_id', $user->id);
                        })
                        ->get();

            $cookies_only = $items->filter(fn($item) => $item->user_id === null);

            if ($cookies_only->count() > 0) {
                ShoppingCart::whereIn('id', $cookies_only->map(fn($item, $key) => $item->id ))
                    ->update(['user_id' => $user->id]);
            }
        }

        return array_merge(parent::share($request), [
            'flash' => [
                'title'   => fn () => $request->session()->get('title'),
                'message' => fn () => $request->session()->get('message'),
                'status'  => fn () => $request->session()->get('status'),
            ],
            'user' => $user,
            'shopping_cart' => $items
        ]);
    }
}
