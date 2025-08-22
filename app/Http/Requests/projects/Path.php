<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Path extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool | RedirectResponse
    {
        if(session()->has('vps_user')) {
            return true;
        }
        return redirect()->route('auth.login')->with(['error' => [
            'title' => 'Unauthorized',
            'description' => 'You must be logged in to access this resource.'
        ]]);
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('You must be logged in to access this resource.');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'path' => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9_-]+$/'],
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
            'path.required' => 'The folder path is required.',
            'path.string'   => 'The folder path must be a string.',
            'path.min'      => 'The folder path must be at least 6 characters long.',
            'path.regex'    => 'The folder path may only contain letters, numbers, underscores, and dashes.',
        ];
    }


}
