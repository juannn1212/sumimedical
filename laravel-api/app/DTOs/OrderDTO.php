<?php

namespace App\DTOs;

class OrderDTO
{
    public function __construct(
        public string $orderNumber,
        public string $customer,
        public string $product,
        public int $quantity,
    ) {
    }

    public static function fromArray(array $data): self
    {
        return new self(
            orderNumber: $data['order_number'],
            customer: $data['customer'],
            product: $data['product'],
            quantity: (int) $data['quantity'],
        );
    }

    public function toArray(): array
    {
        return [
            'order_number' => $this->orderNumber,
            'customer' => $this->customer,
            'product' => $this->product,
            'quantity' => $this->quantity,
        ];
    }
}
