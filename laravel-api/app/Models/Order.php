<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number',
        'customer',
        'product',
        'quantity',
        'status',
        'external_order_id',
        'processed_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'processed_at' => 'datetime',
    ];

    /**
     * Estados posibles de una orden
     */
    const STATUS_PENDING = 'pending';
    const STATUS_PROCESSING = 'processing';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';

    /**
     * Obtiene todas las órdenes con cache
     */
    public static function getCachedList($filters = [])
    {
        $cacheKey = 'orders:list:' . md5(json_encode($filters));
        
        return cache()->remember($cacheKey, 3600, function () use ($filters) {
            $query = static::query();
            
            if (isset($filters['status'])) {
                $query->where('status', $filters['status']);
            }
            
            return $query->orderBy('created_at', 'desc')->paginate(15);
        });
    }

    /**
     * Obtiene el estado de una orden con cache
     */
    public static function getCachedStatus($id)
    {
        $cacheKey = "orders:status:{$id}";
        
        return cache()->remember($cacheKey, 1800, function () use ($id) {
            return static::findOrFail($id);
        });
    }

    /**
     * Invalida el cache relacionado con esta orden
     */
    public function invalidateCache()
    {
        cache()->forget("orders:status:{$this->id}");
        cache()->forget('orders:list:*');
    }

    /**
     * Verifica si la orden está completada
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Verifica si la orden está en procesamiento
     */
    public function isProcessing(): bool
    {
        return $this->status === self::STATUS_PROCESSING;
    }
}
