<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

class PasswordResetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'password_token' => 'required|string',
            'password' => 'required|string|min:8|max:60|confirmed',
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'password_token.required' => 'Le token de réinitialisation est requis',
            'password_token.string' => 'Le token de réinitialisation doit être une chaîne de caractères',

            'password.required' => 'Le mot de passe est requis',
            'password.string' => 'Le mot de passe doit être une chaîne de caractères',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères',
            'password.max' => 'Le mot de passe ne doit pas dépasser 60 caractères',
            'password.confirmed' => 'Les mots de passe ne correspondent pas',
        ];
    }
}
