<?php

namespace Database\Seeders;

use App\Models\Evernotelist;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EvernotelistsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Evernotelist::create([
            'name' => 'Personal Tasks',
            'created_by' => 1,
            'is_public' => false
        ]);

        Evernotelist::create([
            'name' => 'Work Tasks',
            'created_by' => 2,
            'is_public' => true
        ]);
    }
}
