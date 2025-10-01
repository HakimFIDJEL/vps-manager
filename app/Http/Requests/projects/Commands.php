<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Commands extends FormRequest
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

            // Commands
            'project.commands'                  => ['present', 'array'],
            'project.commands.*.target'         => ['required', 'string', 'regex:/^[a-z_][a-z0-9_]*$/'],
            'project.commands.*.description'    => ['required', 'string'],
            'project.commands.*.command'        => ['required', 'string'],
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

            // Commands
            'project.commands.present'                  => 'The commands must be present.',
            'project.commands.array'                    => 'The commands must be an array.',
            'project.commands.*.target.required'        => 'The command #:index target is required.',
            'project.commands.*.target.string'          => 'The command #:index target must be a string.',
            'project.commands.*.target.regex'           => 'The command #:index target must start with a lowercase letter or underscore, and can only contain lowercase letters, numbers and underscores.',
            'project.commands.*.description.required'   => 'The command #:index description is required.',
            'project.commands.*.description.string'     => 'The command #:index description must be a string.',
            'project.commands.*.command.required'       => 'The command #:index command is required.',
            'project.commands.*.command.string'         => 'The command #:index command must be a string.',
        ];
    }
}
