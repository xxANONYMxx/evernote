<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Todo extends Model
{
    use HasFactory;

    protected $fillable = ['note_id', 'title', 'description', 'due_date', 'assigned_to', 'created_by'];

    public function note():BelongsTo
    {
        return $this->belongsTo(Note::class, 'note_id')->with('list');
    }

    public function creator():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function assignee():BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function tags():BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'todos_tags');
    }
}
