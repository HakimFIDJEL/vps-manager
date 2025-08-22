<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Rename extends FormRequest
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
            'old_path' => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9_\-\/]+$/'],
            'new_path' => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9_\-\/]+$/', 'different:old_path']
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
            'old_path.required' => 'The folder path is required.',
            'old_path.string'   => 'The folder path must be a string.',
            'old_path.min'      => 'The folder path must be at least 6 characters long.',
            'old_path.regex'    => 'The folder path may only contain letters, numbers, underscores, and dashes.',

            'new_path.required' => 'The new folder path is required.',
            'new_path.string'   => 'The new folder path must be a string.',
            'new_path.min'      => 'The new folder path must be at least 6 characters long.',
            'new_path.regex'    => 'The new folder path may only contain letters, numbers, underscores, and dashes.',
            'new_path.different'=> 'The new folder path must be different from the old folder path.',
        ];
    }


}
