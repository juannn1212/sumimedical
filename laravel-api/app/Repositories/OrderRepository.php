<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository
{
    public function create(array $data): Order
    {
        return Order::create($data);
    }

    public function findById(int $id): ?Order
    {
        return Order::find($id);
    }

    public function findByOrderNumber(string $orderNumber): ?Order
    {
        return Order::where('order_number', $orderNumber)->first();
    }

    public function findByIdOrOrderNumber(string|int $idOrNumber): ?Order
    {
        // Try to find by ID if it's numeric
        if (is_numeric($idOrNumber)) {
            $order = Order::find($idOrNumber);
            if ($order) {
                return $order;
            }
        }

        // Fallback: try to find by order_number (string comparison)
        return Order::where('order_number', (string) $idOrNumber)->first();
    }

    public function getAll(array $filters = []): LengthAwarePaginator
    {
        $query = Order::query();

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->paginate(15);
    }

    public function getForExport(array $filters = []): Collection
    {
        $query = Order::query();

        if (isset($filters['status']) && $filters['status'] !== '') {
            $query->where('status', $filters['status']);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function update(Order $order, array $data): bool
    {
        return $order->update($data);
    }

    public function updateStatus(Order $order, string $status, ?int $externalOrderId = null): bool
    {
        $updateData = ['status' => $status];

        if ($externalOrderId) {
            $updateData['external_order_id'] = $externalOrderId;
        }

        if ($status === Order::STATUS_COMPLETED) {
            $updateData['processed_at'] = now();
        }

        $updated = $order->update($updateData);

        if ($updated) {
            $order->invalidateCache();
        }

        return $updated;
    }
}
