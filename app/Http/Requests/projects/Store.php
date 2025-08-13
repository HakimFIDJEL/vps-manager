<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Store extends FormRequest
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
            'description' => 'You must be logged in to create a project.'
        ]]);
    }

    /**
     * Handle a failed authorization attempt.
     */
    protected function failedAuthorization(): void
    {
        throw new AuthorizationException('You must be logged in to create a project.');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Project
            'project'                           => ['required', 'array'],
            'project.path'                      => ['required', 'string', 'min:6', 'regex:/^[a-zA-Z0-9_\-\/]+$/'],

            // Variables
            'project.variables'                 => ['present', 'array'],
            'project.variables.*.key'           => ['required', 'string', 'regex:/^[A-Z][A-Z0-9_]*$/'],
            'project.variables.*.value'         => ['required', 'string'],

            // Commands
            'project.commands'                  => ['present', 'array'],
            'project.commands.*.target'         => ['required', 'string', 'regex:/^[a-z_][a-z0-9_]*$/'],
            'project.commands.*.description'    => ['required', 'string'],
            'project.commands.*.command'        => ['required', 'string'],

            // Docker
            'project.docker'                    => ['required', 'array'],
            'project.docker.content'            => ['required', 'string'],
            'project.docker.isSaved'            => ['required', 'accepted'],
            'project.docker.isStrict'           => ['required', 'boolean'],
        ];
    }

    public function messages(): array 
    {
        return [
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

            // Docker
            'project.docker.required'           => 'The docker configuration is required.',
            'project.docker.array'              => 'The docker configuration must be an array.',
            'project.docker.content.required'   => 'The docker content is required.',
            'project.docker.content.string'     => 'The docker content must be a string.',
            'project.docker.isSaved.required'   => 'The docker isSaved flag is required.',
            'project.docker.isSaved.boolean'    => 'The docker isSaved flag must be a boolean.',
            'project.docker.isStrict.required'  => 'The docker isStrict flag is required.',
            'project.docker.isStrict.boolean'   => 'The docker isStrict flag must be a boolean.',
        ];
    }
}
