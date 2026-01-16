<?php

namespace App\Services;

use App\DTOs\OrderDTO;
use App\Jobs\ProcessOrderJob;
use App\Repositories\OrderRepository;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private OrderRepository $orderRepository
    ) {
    }

    /**
     * Importa órdenes desde un archivo
     */
    public function importOrders(array $orderDTOs): array
    {
        $created = 0;
        $skipped = 0;

        foreach ($orderDTOs as $orderDTO) {
            // Verificar si la orden ya existe
            $existingOrder = $this->orderRepository->findByOrderNumber($orderDTO->orderNumber);

            if ($existingOrder) {
                $skipped++;
                Log::info("Orden {$orderDTO->orderNumber} ya existe, se omite.");
                continue;
            }

            // Crear orden
            $order = $this->orderRepository->create([
                'order_number' => $orderDTO->orderNumber,
                'customer' => $orderDTO->customer,
                'product' => $orderDTO->product,
                'quantity' => $orderDTO->quantity,
                'status' => \App\Models\Order::STATUS_PENDING,
            ]);

            // Despachar job para procesamiento asíncrono
            ProcessOrderJob::dispatch($order->id);

            $created++;
        }

        // Invalidar cache de listado
        Cache::flush();

        return [
            'created' => $created,
            'skipped' => $skipped,
            'total' => count($orderDTOs),
        ];
    }

    /**
     * Obtiene todas las órdenes con cache
     */
    public function getAllOrders(array $filters = []): \Illuminate\Contracts\Pagination\LengthAwarePaginator
    {
        $cacheKey = 'orders:list:' . md5(json_encode($filters));

        return Cache::remember($cacheKey, 3600, function () use ($filters) {
            return $this->orderRepository->getAll($filters);
        });
    }

    /**
     * Obtiene datos para exportación
     */
    public function exportOrders(array $filters = []): \Illuminate\Database\Eloquent\Collection
    {
        return $this->orderRepository->getForExport($filters);
    }

    /**
     * Obtiene una orden por ID
     */
    public function getOrderById(string|int $id): \App\Models\Order
    {
        return $this->orderRepository->findByIdOrOrderNumber($id)
            ?? throw new \Illuminate\Database\Eloquent\ModelNotFoundException("Orden no encontrada: {$id}");
    }

    /**
     * Obtiene el estado de una orden con cache
     */
    public function getOrderStatus(string|int $id): \App\Models\Order
    {
        $cacheKey = "orders:status:{$id}";

        return Cache::remember($cacheKey, 1800, function () use ($id) {
            return $this->getOrderById($id);
        });
    }
}
