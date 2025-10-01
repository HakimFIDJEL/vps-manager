<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Variables extends FormRequest
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
            // Inode
            'inode'                             => ['required', 'integer'],

            // Project
            'project'                           => ['required', 'array'],
            'project.path'                      => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9_-]+$/'],

            // Variables
            'project.variables'                 => ['present', 'array'],
            'project.variables.*.key'           => ['required', 'string', 'regex:/^[A-Z][A-Z0-9_]*$/'],
            'project.variables.*.value'         => ['required', 'string'],
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
            // Inode
            'inode.required'                      => 'The inode is required.',
            'inode.integer'                       => 'The inode must be an integer.',
            
            // Project
            'project.required'                      => 'The project is required.',
            'project.array'                         => 'The project must be an array.',
            'project.path.required'                 => 'The project path is required.',
            'project.path.string'                   => 'The project path must be a string.',
            'project.path.min'                      => 'The project path must be at least 6 characters long.',
            'project.path.regex'                    => 'The project path may only contain letters, numbers, underscores, and dashes.',

            // Variables
            'project.variables.present'             => 'The variables must be present.',
            'project.variables.array'               => 'The variables must be an array.',
            'project.variables.*.key.required'      => 'The variable #:index key is required.',
            'project.variables.*.key.string'        => 'The variable #:index key must be a string.',
            'project.variables.*.key.regex'         => 'The variable #:index key must not contain spaces.',
            'project.variables.*.value.required'    => 'The variable #:index value is required.',
            'project.variables.*.value.string'      => 'The variable #:index value must be a string.',
        ];
    }
}
