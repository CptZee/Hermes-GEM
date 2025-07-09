<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Roles

        $adminRole = Role::create([
            "name" => UserRole::Admin,
        ]);

        $reviewerRole = Role::create([
            "name" => UserRole::Reviewer,
        ]);

        $leadRole = Role::create(attributes: [
            "name" => UserRole::Lead,
        ]);

        $revieweeRole = Role::create([
            "name" => UserRole::Reviewee,
        ]);

        // AJ
        $user = User::factory()->create([
            'name' => 'Aaron James R. Mission',
            'email' => 'ajmission@gemcodeit.com',
        ]);

        $user->roles()->attach($adminRole);

        // Sir Aaron
        $user = User::factory()->create([
            'name' => 'Aaron Abigania',
            'email' => 'aaronabigania@gemcodeit.com',
        ]);

        $user->roles()->attach($adminRole);

        // Gab
        $user = User::factory()->create([
            'name' => 'Gabriel De la Vega',
            'email' => 'gabdelavega@gemcodeit.com',
        ]);

        $user->roles()->attach($adminRole);

        // Mikkay
        $user = User::factory()->create([
            'name' => 'Mikkay',
            'email' => 'mikkay@gemcodeit.com',
        ]);

        $user->roles()->attach($leadRole);

        // Elly
        $user = User::factory()->create([
            'name' => 'Ellysa Mae Kayo',
            'email' => 'ellypagcaliwangan@gemcodeit.com',
        ]);

        $user->roles()->attach($revieweeRole);

        // Vlad
        $user = User::factory()->create([
            'name' => 'Vlad',
            'email' => 'vlad@gemcodeit.com',
        ]);

        $user->roles()->attach($revieweeRole);
    }
}
