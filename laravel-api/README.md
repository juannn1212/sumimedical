# Laravel API - Sistema de Órdenes

## 📋 Descripción

API REST desarrollada en Laravel que procesa órdenes desde archivos CSV/JSON, las gestiona de forma asíncrona mediante Jobs y colas, y se comunica con un servicio externo NestJS.

## 🏗️ Arquitectura

La aplicación sigue una **arquitectura limpia** con separación clara de responsabilidades:

```
Controllers → Services → Repositories → Models
     ↓
   DTOs (Data Transfer Objects)
     ↓
   Jobs (Procesamiento Asíncrono)
```

### Componentes Principales

- **Controllers**: Manejan las peticiones HTTP y respuestas
- **Services**: Lógica de negocio
- **Repositories**: Acceso a datos (abstracción de la base de datos)
- **DTOs**: Objetos de transferencia de datos con validación
- **Jobs**: Procesamiento asíncrono de órdenes
- **Models**: Entidades de Eloquent

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
composer install
```

2. **Configurar entorno:**
```bash
cp .env.example .env
php artisan key:generate
```

3. **Configurar base de datos en `.env`:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_orders
DB_USERNAME=laravel
DB_PASSWORD=laravel

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

NESTJS_API_URL=http://localhost:3000
```

4. **Ejecutar migraciones:**
```bash
php artisan migrate
```

5. **Iniciar worker de colas:**
```bash
php artisan queue:work redis
```

## 📡 Endpoints

### POST /api/orders/import
Importa órdenes desde un archivo CSV o JSON.

**Request:**
```bash
curl -X POST http://localhost:8000/api/orders/import \
  -F "file=@ejemplo_ordenes.csv"
```

**Response:**
```json
{
  "message": "Archivo procesado correctamente",
  "total_orders": 3,
  "created": 3,
  "skipped": 0
}
```

### GET /api/orders
Lista todas las órdenes con paginación.

**Query Parameters:**
- `page`: Número de página
- `status`: Filtrar por estado (pending, processing, completed, failed)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "order_number": "ORD-001",
      "customer": "Juan Perez",
      "product": "Servicio A",
      "quantity": 2,
      "status": "completed"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 1,
    "per_page": 15,
    "total": 1
  }
}
```

### GET /api/orders/{id}
Obtiene una orden específica.

### GET /api/orders/{id}/status
Obtiene el estado de una orden (con cache).

## 🔄 Flujo de Procesamiento

1. **Upload de archivo** → `OrderController::import()`
2. **Procesamiento de archivo** → `FileProcessorService`
3. **Creación de órdenes** → `OrderService::importOrders()`
4. **Despacho de Jobs** → `ProcessOrderJob`
5. **Procesamiento asíncrono** → Envío a NestJS
6. **Actualización de estado** → Cache invalidado automáticamente

## 💾 Cache

- **Listado de órdenes**: Cache de 1 hora
- **Estado de orden**: Cache de 30 minutos
- **Invalidación**: Automática al cambiar estado

## 🧪 Testing

```bash
php artisan test
```

## 📝 Principios SOLID Aplicados

- **S**ingle Responsibility: Cada clase tiene una responsabilidad única
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Interfaces bien definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependencias inyectadas
