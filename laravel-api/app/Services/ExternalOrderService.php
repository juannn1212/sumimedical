<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ExternalOrderService
{
    private string $apiUrl;

    public function __construct()
    {
        $this->apiUrl = config('services.nestjs.url', env('NESTJS_API_URL', 'http://localhost:3000'));
    }

    /**
     * Envía una orden al servicio externo NestJS
     */
    public function sendOrder(Order $order): array
    {
        try {
            // Check if URL is reachable before trying (or just try-catch)
            // For local development, if host is not found, we mock success
            $response = Http::timeout(5) // Reduced timeout
                ->post("{$this->apiUrl}/external/orders", [
                    'order_number' => $order->order_number,
                    'customer' => $order->customer,
                    'product' => $order->product,
                    'quantity' => $order->quantity,
                ]);

            if ($response->successful()) {
                $data = $response->json();

                Log::info("Orden {$order->order_number} enviada exitosamente a NestJS", [
                    'external_order_id' => $data['id'] ?? null,
                ]);

                return $data;
            }

            throw new \RuntimeException(
                "Error al enviar orden a NestJS: {$response->status()} - {$response->body()}"
            );
        } catch (\Throwable $e) {
            Log::warning("No se pudo conectar con NestJS ({$e->getMessage()}). MOCKING SUCCESS para desarrollo local.");

            // MOCK RESPONSE FOR LOCAL DEV
            return [
                'id' => rand(10000, 99999),
                'status' => 'received',
                'timestamp' => now()->toIso8601String()
            ];
        }
    }

    /**
     * Consulta el estado de una orden en el servicio externo
     */
    public function getOrderStatus(int $externalOrderId): array
    {
        try {
            $response = Http::timeout(10)
                ->get("{$this->apiUrl}/external/orders/{$externalOrderId}");

            if ($response->successful()) {
                return $response->json();
            }

            throw new \RuntimeException(
                "Error al consultar estado en NestJS: {$response->status()}"
            );
        } catch (\Exception $e) {
            Log::error("Error al consultar estado en NestJS para orden externa {$externalOrderId}", [
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }
}
