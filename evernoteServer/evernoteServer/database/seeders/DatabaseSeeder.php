<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(UsersTableSeeder::class);
        $this->call(EvernotelistsTableSeeder::class);
        $this->call(NotesTableSeeder::class);
        $this->call(TodosTableSeeder::class);
        $this->call(TagsTableSeeder::class);
    }
}
