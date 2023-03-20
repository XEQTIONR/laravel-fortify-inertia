<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use App\Contracts\HierarchicalCategories;
use App\Models\User;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Contracts\LogoutResponse as LogoutResponseContract;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\Http\Responses\LogoutResponse;
use Laravel\Fortify\Contracts\ProfileInformationUpdatedResponse;
use Laravel\Fortify\Contracts\PasswordUpdateResponse;

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

        app()->bind(ProfileInformationUpdatedResponse::class, function() {
           return redirect(route('security.index'));
        });

        app()->bind(PasswordUpdateResponse::class, function() {
            return redirect(route('security.index'));
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
        Fortify::registerView( function(Request $request) {
            $validated = $request->validate([
                'primary_contact_number' => 'nullable|numeric'
            ]);

            return Inertia::render('Register', [
                'primary_contact_number' => $validated['primary_contact_number'] ?? null,
                'categories' => app(HierarchicalCategories::class)
            ]);
        });

        Fortify::requestPasswordResetLinkView( function () {
            return Inertia::render('ForgotPasswordRequest');
        });

        Fortify::confirmPasswordView( function () {
           return Inertia::render('ConfirmPassword');
        });

        Fortify::resetPasswordView( function () {
            return view('auth.reset-password');
        });

        Fortify::authenticateUsing( function(Request $request) {
            App::setLocale( Cache::get('locale'));
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
