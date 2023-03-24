<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use App\Http\Rules\Password;

class CreateNewUser implements CreatesNewUsers
{

    /**
     * Validate and create a newly registered user.
     *
     * @param array $input
     * @return \App\Models\User
     * @throws \Exception
     */
    public function create(array $input)
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255', 'min:3'],
            'email' => [
                'nullable',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'primary_contact_number' => [
                'required',
                'string',
                'max:20',
                Rule::unique(User::class),
            ],
            'secondary_contact_number' => ['nullable','string','max:20'],
            'password' => ['required', 'string', new Password, 'confirmed'],
        ], [
            'primary_contact_number' => 'This mobile number is already registered.'
        ])->validate();

        $code =  ( config('app.env') === 'production' ) ? strval( random_int(100000, 999999) ) : 123456;
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'primary_contact_number' => $input['primary_contact_number'],
            'secondary_contact_number' => $input['secondary_contact_number'],
            'password' => Hash::make( $input['password'] ),
            'sms_verification_code' => $code,
        ]);
        //TODO: text the code to the users primary_contact_number;
        $verification_code = config('app.env') === 'production' ? strval( random_int(10000000, 99999999) ) : 123456;

        $smsClient = app()->make(\App\Contracts\SMSClient::class);
        $smsClient->send("Your account verification code is : $verification_code", $input['primary_contact_number']);

        return $user;
    }
}
