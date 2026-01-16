<?php

namespace App\Http\Controllers;

use App\Http\Requests\ImportOrdersRequest;
use App\Services\FileProcessorService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(
        private OrderService $orderService,
        private FileProcessorService $fileProcessorService
    ) {
    }

    /**
     * Importa órdenes desde un archivo CSV o JSON
     * 
     * @param ImportOrdersRequest $request
     * @return JsonResponse
     */
    public function import(ImportOrdersRequest $request): JsonResponse
    {
        try {
            $file = $request->file('file');
            $orderDTOs = $this->fileProcessorService->processFile($file);
            $result = $this->orderService->importOrders($orderDTOs);

            return response()->json([
                'message' => 'Archivo procesado correctamente',
                'total_orders' => $result['total'],
                'created' => $result['created'],
                'skipped' => $result['skipped'],
            ], 201);

        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'message' => 'Error de validación',
                'error' => $e->getMessage(),
            ], 422);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('IMPORT ERROR FATAL: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error al procesar el archivo',
                'error' => $e->getMessage(),
                'details' => 'Revisa laravel.log para ver el stack trace completo.'
            ], 500);
        }
    }

    /**
     * Lista todas las órdenes
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            \Illuminate\Support\Facades\Log::info('OrderController::index - Fetching orders', [
                'queryParams' => $request->all()
            ]);

            $filters = $request->only(['status']);
            $orders = $this->orderService->getAllOrders($filters);

            return response()->json([
                'data' => $orders->items(),
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'last_page' => $orders->lastPage(),
                    'per_page' => $orders->perPage(),
                    'total' => $orders->total(),
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener las órdenes',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Exporta órdenes a CSV
     * 
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function export(Request $request)
    {
        $filters = $request->only(['status']);
        $orders = $this->orderService->exportOrders($filters);

        $filename = "reporte_ordenes_" . date('Y-m-d_H-i') . ".csv";

        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=" . $filename,
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        $callback = function () use ($orders) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['ID', 'No. Orden', 'Cliente', 'Producto', 'Cantidad', 'Estado', 'Fecha Creación', 'Fecha Proceso']);

            foreach ($orders as $order) {
                fputcsv($file, [
                    $order->id,
                    $order->order_number,
                    $order->customer,
                    $order->product,
                    $order->quantity,
                    $order->status,
                    $order->created_at->toDateTimeString(),
                    $order->processed_at?->toDateTimeString() ?? 'N/A'
                ]);
            }

            fclose($file);
        };

        return response()->streamDownload($callback, $filename, $headers);
    }

    /**
     * Obtiene una orden específica
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $order = $this->orderService->getOrderById($id);

            return response()->json([
                'id' => $order->id,
                'order_number' => $order->order_number,
                'customer' => $order->customer,
                'product' => $order->product,
                'quantity' => $order->quantity,
                'status' => $order->status,
                'external_order_id' => $order->external_order_id,
                'processed_at' => $order->processed_at?->toIso8601String(),
                'created_at' => $order->created_at->toIso8601String(),
                'updated_at' => $order->updated_at->toIso8601String(),
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Orden no encontrada',
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener la orden',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtiene el estado de una orden
     * 
     * @param int $id
     * @return JsonResponse
     */
    public function status(string $id): JsonResponse
    {
        try {
            // Note: We changed the type hint to string to accept "ORD-104"
            $order = $this->orderService->getOrderStatus($id);

            return response()->json([
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'updated_at' => $order->updated_at->toIso8601String(),
            ]);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Orden no encontrada',
            ], 404);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al obtener el estado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
