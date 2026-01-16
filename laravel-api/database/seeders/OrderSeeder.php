<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing orders
        DB::table('orders')->truncate();

        // Create sample orders
        $orders = [
            [
                'order_number' => 'ORD-001',
                'customer' => 'Juan Perez',
                'product' => 'Servicio A',
                'quantity' => 2,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_number' => 'ORD-002',
                'customer' => 'Ana Gomez',
                'product' => 'Medicamento B',
                'quantity' => 1,
                'status' => 'completed',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_number' => 'ORD-003',
                'customer' => 'Carlos Ruiz',
                'product' => 'Servicio C',
                'quantity' => 3,
                'status' => 'processing',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'order_number' => 'ORD-004',
                'customer' => 'Maria Lopez',
                'product' => 'Consulta Médica',
                'quantity' => 1,
                'status' => 'completed',
                'created_at' => now()->subDays(1),
                'updated_at' => now()->subDays(1),
            ],
            [
                'order_number' => 'ORD-005',
                'customer' => 'Pedro Martinez',
                'product' => 'Análisis de Sangre',
                'quantity' => 5,
                'status' => 'pending',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDays(2),
            ],
        ];

        DB::table('orders')->insert($orders);

        $this->command->info('Created ' . count($orders) . ' sample orders');
    }
}
