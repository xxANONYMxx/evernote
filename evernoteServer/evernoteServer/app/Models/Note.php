<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Note extends Model
{
    use HasFactory;

    protected $fillable = ['list_id', 'title', 'description', 'image', 'created_by'];

    public function list():BelongsTo
    {
        return $this->belongsTo(Evernotelist::class, 'list_id');
    }

    public function creator():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function todos():HasMany
    {
        return $this->hasMany(Todo::class, 'note_id');
    }

    public function tags():BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'notes_tags');
    }
}
