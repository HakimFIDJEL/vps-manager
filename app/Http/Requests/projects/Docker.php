<?php

namespace App\Http\Requests\projects;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Auth\Access\AuthorizationException;

class Docker extends FormRequest
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
        throw new AuthorizationException('You must be logged in to create a docker-compose.yaml file.');
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
