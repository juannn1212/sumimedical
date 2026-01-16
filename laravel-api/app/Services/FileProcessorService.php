<?php

namespace App\Services;

use App\DTOs\OrderDTO;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;

class FileProcessorService
{
    /**
     * Procesa un archivo CSV o JSON y retorna un array de OrderDTO
     */
    public function processFile(UploadedFile $file): array
    {
        $extension = $file->getClientOriginalExtension();
        
        return match (strtolower($extension)) {
            'csv' => $this->processCsv($file),
            'json' => $this->processJson($file),
            default => throw new \InvalidArgumentException('Formato de archivo no soportado. Use CSV o JSON.'),
        };
    }

    /**
     * Procesa un archivo CSV
     */
    private function processCsv(UploadedFile $file): array
    {
        $orders = [];
        $handle = fopen($file->getRealPath(), 'r');
        
        if ($handle === false) {
            throw new \RuntimeException('No se pudo abrir el archivo CSV.');
        }

        // Leer encabezados
        $headers = fgetcsv($handle);
        
        if ($headers === false) {
            fclose($handle);
            throw new \RuntimeException('El archivo CSV está vacío o es inválido.');
        }

        // Normalizar encabezados
        $headers = array_map('trim', $headers);
        $headers = array_map('strtolower', $headers);

        // Validar encabezados requeridos
        $requiredHeaders = ['order_number', 'customer', 'product', 'quantity'];
        foreach ($requiredHeaders as $required) {
            if (!in_array($required, $headers)) {
                fclose($handle);
                throw new \InvalidArgumentException("El archivo CSV debe contener la columna: {$required}");
            }
        }

        // Leer filas
        $lineNumber = 1;
        while (($row = fgetcsv($handle)) !== false) {
            $lineNumber++;
            
            if (count($row) !== count($headers)) {
                Log::warning("Línea {$lineNumber} ignorada: número de columnas incorrecto");
                continue;
            }

            $data = array_combine($headers, $row);
            
            try {
                $this->validateOrderData($data);
                $orders[] = OrderDTO::fromArray($data);
            } catch (\Exception $e) {
                Log::warning("Línea {$lineNumber} ignorada: {$e->getMessage()}");
            }
        }

        fclose($handle);

        if (empty($orders)) {
            throw new \RuntimeException('No se encontraron órdenes válidas en el archivo.');
        }

        return $orders;
    }

    /**
     * Procesa un archivo JSON
     */
    private function processJson(UploadedFile $file): array
    {
        $content = file_get_contents($file->getRealPath());
        $data = json_decode($content, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \InvalidArgumentException('El archivo JSON es inválido: ' . json_last_error_msg());
        }

        if (!is_array($data)) {
            throw new \InvalidArgumentException('El archivo JSON debe contener un array de órdenes.');
        }

        $orders = [];
        foreach ($data as $index => $orderData) {
            try {
                $this->validateOrderData($orderData);
                $orders[] = OrderDTO::fromArray($orderData);
            } catch (\Exception $e) {
                Log::warning("Elemento {$index} ignorado: {$e->getMessage()}");
            }
        }

        if (empty($orders)) {
            throw new \RuntimeException('No se encontraron órdenes válidas en el archivo.');
        }

        return $orders;
    }

    /**
     * Valida los datos de una orden
     */
    private function validateOrderData(array $data): void
    {
        $required = ['order_number', 'customer', 'product', 'quantity'];
        
        foreach ($required as $field) {
            if (!isset($data[$field]) || empty(trim($data[$field]))) {
                throw new \InvalidArgumentException("El campo '{$field}' es requerido.");
            }
        }

        if (!is_numeric($data['quantity']) || (int)$data['quantity'] <= 0) {
            throw new \InvalidArgumentException("El campo 'quantity' debe ser un número positivo.");
        }
    }
}
