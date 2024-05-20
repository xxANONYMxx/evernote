<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use PHPOpenSourceSaver\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fist_name',
        'last_name',
        'email',
        'password',
        'profile_image'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function evernoteListsCreated():HasMany
    {
        return $this->hasMany(Evernotelist::class, 'created_by');
    }

    public function notesCreated():HasMany
    {
        return $this->hasMany(Note::class, 'created_by');
    }

    public function todosCreated():HasMany
    {
        return $this->hasMany(Todo::class, 'created_by');
    }

    public function tagsCreated():HasMany
    {
        return $this->hasMany(Tag::class, 'created_by');
    }

    public function sharedLists():BelongsToMany
    {
        return $this->belongsToMany(Evernotelist::class, 'evernotelists_users')
            ->withPivot('is_accepted')
            ->wherePivot('is_accepted', true);
    }

    public function listsInvitations():BelongsToMany
    {
        return $this->belongsToMany(EvernoteList::class, 'evernotelists_users', 'user_id')
            ->withPivot('is_accepted')
            ->wherePivot('is_accepted', false);
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return ['user' => ['id' => $this->id]];
    }
}
