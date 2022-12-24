<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

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
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'primary_contact_number' => ['required', 'string', 'max:20'],
            'secondary_contact_number' => ['nullable','string','max:20'],
            'password' => $this->passwordRules(),
        ])->validate();

        return User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'primary_contact_number' => $input['primary_contact_number'],
            'secondary_contact_number' => $input['secondary_contact_number'],
            'password' => Hash::make( $input['password'] ),
            'sms_verification_code' => strval( random_int(100000, 999999) ),
        ]);
    }
}
