<?php

namespace App\Http\Requests\auth;

use Illuminate\Foundation\Http\FormRequest;

class Login extends FormRequest
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
            'username' => ['required', 'string', 'not_in:root'],
            'password' => ['required', 'string'],
            'remember' => ['boolean'],
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
            "*.required"    => "The field :attribute is required.",
            "*.string"      => "The field :attribute must be a string.",
            // "*.min"         => "The field :attribute must be at least :min characters.",
            // "*.max"         => "The field :attribute must not exceed :max characters.",
            "*.not_in"      => "The field :attribute must not be :values.",
            "*.boolean"     => "The field :attribute must be true or false.",
        ];
    }
}
