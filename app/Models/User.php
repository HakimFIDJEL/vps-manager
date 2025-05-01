<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'firstname',
        'lastname',
        'email',
        'password',
        'password_expires_at',
       
        'pfp_label',
        'pfp_url',
        'pfp_extension',
        'pfp_mime',
        'pfp_size',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'password_expires_at',
        'remember_token',
        'user_token',
        'user_token_expires_at',
        'password_token',
        'password_token_expires_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_expires_at' => 'datetime',
            'user_token_expires_at' => 'datetime',
            'password_token_expires_at' => 'datetime',
            'remember_token' => 'string',
            'user_token' => 'string',
            'password_token' => 'string',
        ];
    }

    public function getFullResumePathAttribute() {
        return Storage::url($this->resume_path);
    }

    public function getFullPfpUrlAttribute() {
        return Storage::url($this->pfp_url);
    }

    protected $appends = [
        'full_resume_path',
        'full_pfp_url',
    ];

    public function getImageUrl() {
        return Storage::url($this->pfp_url);
    }

    public function generatePasswordToken() {
        $this->password_token = Str::random(30);
        $this->password_token_expires_at = now()->addDay();
        $this->save();
    }

    public function removePasswordToken() {
        $this->password_token = null;
        $this->password_token_expires_at = null;
        $this->save();
    }
}
