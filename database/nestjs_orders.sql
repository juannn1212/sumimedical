-- Base de datos para NestJS API
-- Servicio Externo de Procesamiento de Órdenes

CREATE DATABASE IF NOT EXISTS nestjs_orders CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE nestjs_orders;

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(255) NOT NULL UNIQUE,
    customer VARCHAR(255) NOT NULL,
    product VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed') NOT NULL DEFAULT 'pending',
    processed_at DATETIME NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX IDX_ORDER_NUMBER (order_number),
    INDEX IDX_STATUS (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar datos de ejemplo (opcional)
INSERT INTO orders (order_number, customer, product, quantity, status, created_at, updated_at) VALUES
('ORD-001', 'Juan Perez', 'Servicio A', 2, 'pending', NOW(), NOW()),
('ORD-002', 'Ana Gomez', 'Medicamento B', 1, 'pending', NOW(), NOW()),
('ORD-003', 'Carlos Ruiz', 'Servicio C', 3, 'pending', NOW(), NOW());
