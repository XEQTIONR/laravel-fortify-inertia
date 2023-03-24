<?php

namespace App\Http\Rules;

use Illuminate\Support\Facades\Cache;
use Laravel\Fortify\Rules\Password as Rule;

class Password extends Rule
{
    /**
     * Override the validation error messages.
     *
     * @return string
     */
    public function message()
    {
        if ($this->message) {
            return $this->message;
        }

        switch (true) {
            case $this->requireUppercase
                && !$this->requireNumeric
                && !$this->requireSpecialCharacter:
                return __('validation.password.uppercase', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireNumeric
                && !$this->requireUppercase
                && !$this->requireSpecialCharacter:
                return __('validation.password.alphanum', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireSpecialCharacter
                && !$this->requireUppercase
                && !$this->requireNumeric:
                return __('validation.password.sc', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireUppercase
                && $this->requireNumeric
                && !$this->requireSpecialCharacter:
                return __('validation.password.alphanum_uc', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireUppercase
                && $this->requireSpecialCharacter
                && !$this->requireNumeric:
                return __('validation.password.uc_sc', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireUppercase
                && $this->requireNumeric
                && $this->requireSpecialCharacter:
                return __('validation.password.alphanum_uc_sc', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            case $this->requireNumeric
                && $this->requireSpecialCharacter
                && !$this->requireUppercase:
                return __('validation.alphanum_sc', [
                    'length' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));

            default:
                return __('validation.min.string', [
                    'min' => $this->length,
                ], Cache::get('locale') ?? config('app.locale'));
        }
    }
}
