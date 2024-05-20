<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'password' => bcrypt('password'),
            'profile_image' => null,
            'admin' => true
        ]);

        User::create([
            'first_name' => 'Jane',
            'last_name' => 'Doe',
            'email' => 'jane.doe@example.com',
            'password' => bcrypt('password'),
            'profile_image' => null
        ]);

        User::create([
            'first_name' => 'Samuel',
            'last_name' => 'Lange',
            'email' => 'samuel.lange@example.com',
            'password' => bcrypt('password'),
            'profile_image' => null
        ]);

        User::create([
            'first_name' => 'Julia',
            'last_name' => 'Schön',
            'email' => 'julia.schoen@example.com',
            'password' => bcrypt('password'),
            'profile_image' => null
        ]);
    }
}
