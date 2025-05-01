<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

class PasswordForgetRequest extends FormRequest
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
            'email' => 'required|string|max:100',
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
            'email.required' => 'Veuillez entrer votre adresse email',
            'email.string' => 'Votre adresse email doit être une chaîne de caractères',
            'email.max' => 'Votre adresse email ne doit pas dépasser 100 caractères',
        ];
    }
}
