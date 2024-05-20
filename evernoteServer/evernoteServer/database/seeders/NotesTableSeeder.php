<?php

namespace Database\Seeders;

use App\Models\Note;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Note::create([
            'list_id' => 1,
            'title' => 'Grocery Shopping',
            'description' => 'List of items to buy: bread, milk, eggs',
            'created_by' => 1
        ]);

        Note::create([
            'list_id' => 2,
            'title' => 'Project Plan',
            'description' => 'Outline the project plan for the new website launch',
            'created_by' => 2
        ]);
    }
}
