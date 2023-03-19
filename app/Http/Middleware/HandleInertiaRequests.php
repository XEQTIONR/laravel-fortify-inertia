<?php

namespace App\Http\Middleware;

use App\Http\Resources\ShoppingCartResource;
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
            $items = ShoppingCart::whereIn('status', ['new', 'updated'])
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

            $collection = ShoppingCart::where('user_id', $user->id)
                ->whereIn('status', ['new', 'updated'])
                ->get();

            $groups =  $collection->groupBy('product_id');
            $deleteIds = collect();
            $groups->each(function($group) use (&$deleteIds) {
                if ($group->count() > 1) {
                    $first = $group->first();
                    $rest = $group->skip(1);
                    $sum = $group->reduce(fn($carry, $item) => $carry + $item->qty, 0);
                    $ids = $rest->map(fn($item) => $item->id);

                    $deleteIds = $deleteIds->merge($ids);

                    $first->qty = $sum;
                    $first->save();
                }
            });
            if ($deleteIds->count() > 0) {
                ShoppingCart::whereIn('id', $deleteIds)->delete();
            }
            $items = ShoppingCart::with('product')
                        ->where('user_id', $user->id)
                        ->whereIn('status', ['new', 'updated'])
                        ->get();
        }

        return array_merge(parent::share($request), [
            'flash' => [
                'title'   => fn () => $request->session()->get('title'),
                'message' => fn () => $request->session()->get('message'),
                'status'  => fn () => $request->session()->get('status'),
            ],
            'locale' => config('app.locale'),
            'user' => $user,
            'shopping_cart' => ShoppingCartResource::collection($items)
        ]);
    }
}
