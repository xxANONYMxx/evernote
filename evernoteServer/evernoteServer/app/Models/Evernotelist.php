<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Evernotelist extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'created_by', 'is_public'];

    public function creator():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function notes():HasMany
    {
        return $this->hasMany(Note::class, 'list_id')->with(['creator', 'tags', 'todos'=> function ($query) {
            $query->with('tags', 'assignee', 'creator');
        }]);
    }

    public function users():BelongsToMany
    {
        return $this->belongsToMany(User::class, 'evernotelists_users', 'list_id')->withPivot('is_accepted');
    }
}
