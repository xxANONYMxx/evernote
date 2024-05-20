<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    public function creator():BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function notes():BelongsToMany
    {
        return $this->belongsToMany(Note::class, 'notes_tags');
    }

    public function todos():BelongsToMany
    {
        return $this->belongsToMany(Todo::class, 'todos_tags');
    }
}
