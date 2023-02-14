<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Responses\LogoutResponse;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->instance(LogoutResponse::class, new class implements LogoutResponseContract {
            public function toResponse($request)
            {
                return $request->wantsJson()
                    ? new JsonResponse('', 204)
                    : redirect()->route(Fortify::redirects('logout', 'welcome'))
                        ->withCookie(Cookie::make(
                            name: 'shopping-cart',
                            value: Str::random(),
                            minutes: 100000,
                            httpOnly: false,
                        ));
            }
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);

        Fortify::loginView( function() {
            return Inertia::render('Login');
        });
        Fortify::registerView( function() {
            return Inertia::render('Register');
        });

        Fortify::requestPasswordResetLinkView( function () {
            return Inertia::render('ForgotPasswordRequest');
        });

        Fortify::resetPasswordView( function () {
            return view('auth.reset-password');
        });

        Fortify::authenticateUsing( function(Request $request) {
            $user = User::where('email', $request->email)->first();

            if (! $user) {
                $user = User::where('primary_contact_number', $request->email)->first();
            }

            if ($user &&
                Hash::check($request->password, $user->password)) {
                return $user;
            }

            return null;
        });

        RateLimiter::for('login', function (Request $request) {
            $email = (string) $request->email;

            return Limit::perMinute(5)->by($email.$request->ip());
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });
    }
}
