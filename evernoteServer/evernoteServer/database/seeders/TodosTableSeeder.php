<?php

namespace Database\Seeders;

use App\Models\Todo;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TodosTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Todo::create([
            'note_id' => 1,
            'title' => 'Buy milk',
            'description' => '2 litres of milk',
            'due_date' => now()->addDays(1),
            'assigned_to' => 1,
            'created_by' => 1
        ]);

        Todo::create([
            'note_id' => 2,
            'title' => 'Draft project',
            'description' => 'Draft the initial stages of the project',
            'due_date' => now()->addDays(7),
            'assigned_to' => 2,
            'created_by' => 2
        ]);
    }
}
