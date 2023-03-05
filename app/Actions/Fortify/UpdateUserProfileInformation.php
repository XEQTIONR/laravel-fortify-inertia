<?php

namespace App\Actions\Fortify;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    protected static array $fields = [
        'name',
        'email',
        'password',
        'primary_contact_number',
        'secondary_contact_number',
    ];
    /**
     * Validate and update the given user's profile information.
     *
     * @param  mixed  $user
     * @param  array  $input
     * @return void
     */
    public function update($user, array $input)
    {
        Validator::make($input, [
            'field' => [
                'required',
                Rule::in(self::$fields),
            ],
            'name' => ['required_if:field,name', 'string', 'max:255'],
            'email' => [
                'required_if:field,email',
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
            'primary_contact_number' => 'required_if:field,primary_contact_number|regex:/01\d{9}/',
            'secondary_contact_number' => 'required_if:field,secondary_contact_number|regex:/(01\d{9}|02\d{7})/',
        ])->validateWithBag('updateProfileInformation');

//        if ($input['email'] !== $user->email &&
//            $user instanceof MustVerifyEmail) {
//            $this->updateVerifiedUser($user, $input);
//        } else {
            $user->forceFill([
                $input['field'] => $input[$input['field']]
            ])->save();
//        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  mixed  $user
     * @param  array  $input
     * @return void
     */
    protected function updateVerifiedUser($user, array $input)
    {
        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
