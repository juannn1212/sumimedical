<?php

namespace App\Jobs;

use App\Models\Order;
use App\Repositories\OrderRepository;
use App\Services\ExternalOrderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $orderId
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(
        OrderRepository $orderRepository,
        ExternalOrderService $externalOrderService
    ): void {
        $order = $orderRepository->findById($this->orderId);

        if (!$order) {
            Log::error("Orden no encontrada: {$this->orderId}");
            return;
        }

        try {
            // Actualizar estado a procesando
            $orderRepository->updateStatus($order, Order::STATUS_PROCESSING);

            // Enviar orden al servicio externo NestJS
            $externalOrder = $externalOrderService->sendOrder($order);

            // Actualizar con el ID externo
            $orderRepository->updateStatus(
                $order,
                Order::STATUS_PROCESSING,
                $externalOrder['id'] ?? null
            );

            Log::info("Orden {$order->order_number} procesada exitosamente", [
                'order_id' => $order->id,
                'external_order_id' => $externalOrder['id'] ?? null,
            ]);

            // Despachar job para verificar estado (opcional, para polling)
            // CheckOrderStatusJob::dispatch($order->id)->delay(now()->addMinutes(5));

        } catch (\Throwable $e) {
            Log::error("Error Fatal en ProcessOrderJob para orden {$order->order_number}: " . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            // Actualizar estado a fallido
            $orderRepository->updateStatus($order, Order::STATUS_FAILED);

            // IMPORTANTE: No re-lanzamos la excepción si estamos en modo sync (local)
            // para evitar que el controlador falle con 500 Error.
            // En producción con colas reales, esto debería re-lanzarse con $this->release() o throw.
            if (config('queue.default') !== 'sync') {
                throw $e;
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        $orderRepository = app(OrderRepository::class);
        $order = $orderRepository->findById($this->orderId);

        if ($order) {
            $orderRepository->updateStatus($order, Order::STATUS_FAILED);

            Log::error("Job falló después de todos los intentos para orden {$order->order_number}", [
                'error' => $exception->getMessage(),
            ]);
        }
    }
}
