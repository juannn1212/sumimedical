# Sistema de Procesamiento de Órdenes (Clinical Luxe)

**Estado:** � Completado | **Cumplimiento:** 100% Requerimientos

Sistema distribuido de procesamiento de órdenes médicas con arquitectura de microservicios, diseñado para alta disponibilidad y escalabilidad.

## 📦 Instalación Rápida (Docker)

Todo el entorno está contenerizado. No requiere PHP/Node local.

```bash
# 1. Clonar repositorio
git clone https://github.com/juannn1212/sumimedical.git
cd sumimedical

# 2. Iniciar servicios
docker-compose up -d --build

# 3. Configurar Backend (Solo primera vez)
docker-compose exec laravel-api composer install
docker-compose exec laravel-api php artisan key:generate
docker-compose exec laravel-api php artisan migrate

# 4. Configurar Microservicio (Solo primera vez)
docker-compose exec nestjs-api npm install
docker-compose exec nestjs-api npm run migration:run
```

## 🌐 Accesos

| Plataforma | URL | Credenciales |
|------------|-----|--------------|
| **Frontend** | [http://localhost:3001](http://localhost:3001) | N/A |
| **Laravel API** | [http://localhost:8000](http://localhost:8000) | N/A |
| **NestJS API** | [http://localhost:3000](http://localhost:3000) | N/A |

## 🏗️ Arquitectura Técnica

El sistema opera bajo un flujo de datos unidireccional y asíncrono:

1.  **Ingesta:** Frontend Next.js sube CSV → Laravel API.
2.  **Procesamiento:** Laravel encola el trabajo en Redis.
3.  **Ejecución:** Job de Laravel envía la orden a NestJS.
4.  **Cálculo:** NestJS simula "Heavy Processing" y actualiza estado.
5.  **Visualización:** Frontend muestra cambios en tiempo real.

### Stack Tecnológico
*   **Orquestador:** Laravel 10 (Rest API, Jobs, Scheduler).
*   **Microservicio:** NestJS (TypeORM, DTO Validation).
*   **Cliente:** Next.js 14 (React, Tailwind, Axios).
*   **Infraestructura:** Docker Compose, MySQL 8, Redis 7.

---
*Desarrollado por [Tu Nombre/Equipo] para SumiMedical.*
## 🚀 Tecnologías

### Backend Laravel
- **Framework:** Laravel 10+
- **Base de datos:** MySQL/PostgreSQL
- **Cache:** Redis
- **Colas:** Redis Queue
- **Arquitectura:** Clean Architecture (Controllers → Services → Repositories)

### Backend NestJS
- **Framework:** NestJS
- **Base de datos:** MySQL/PostgreSQL
- **Validación:** DTOs y Pipes
- **Procesamiento:** Simulación de tareas pesadas

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Estilos:** Tailwind CSS
- **UI:** Componentes modernos y responsivos

## 📁 Estructura del Proyecto

```
sumimedical2/
├── laravel-api/          # API principal Laravel
├── nestjs-api/           # Servicio externo NestJS
├── frontend/             # Frontend Next.js (opcional)
├── docker-compose.yml    # Orquestación de servicios
└── README.md
```

## 🔧 Requisitos Previos

- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- PHP 8.1+ (para desarrollo local)
- Composer (para desarrollo local)

## 🐳 Instalación con Docker

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd sumimedical2
```

2. **Iniciar servicios:**
```bash
docker-compose up -d
```

3. **Instalar dependencias Laravel:**
```bash
cd laravel-api
composer install
php artisan key:generate
php artisan migrate
php artisan queue:work
```

4. **Instalar dependencias NestJS:**
```bash
cd nestjs-api
npm install
npm run migration:run
npm run start:dev
```

5. **Instalar dependencias Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 📡 Endpoints Laravel

### POST /api/orders/import
Importa órdenes desde un archivo CSV o JSON.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (archivo CSV o JSON)

**Response:**
```json
{
  "message": "Archivo procesado correctamente",
  "total_orders": 10,
  "job_id": "uuid-del-job"
}
```

### GET /api/orders
Lista todas las órdenes (con cache).

**Query Parameters:**
- `page`: Número de página (default: 1)
- `per_page`: Items por página (default: 15)
- `status`: Filtrar por estado

**Response:**
```json
{
  "data": [...],
  "meta": {
    "current_page": 1,
    "total": 100
  }
}
```

### GET /api/orders/{id}
Obtiene una orden específica.

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "customer": "Juan Perez",
  "product": "Servicio A",
  "quantity": 2,
  "status": "processing",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### GET /api/orders/{id}/status
Obtiene el estado de una orden (con cache).

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "status": "completed",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 📡 Endpoints NestJS

### POST /external/orders
Recibe una orden desde Laravel para procesamiento.

**Request:**
```json
{
  "order_number": "ORD-001",
  "customer": "Juan Perez",
  "product": "Servicio A",
  "quantity": 2
}
```

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "status": "processing",
  "message": "Orden recibida y en procesamiento"
}
```

### GET /external/orders/{id}
Obtiene el estado de una orden procesada.

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "status": "completed",
  "processed_at": "2024-01-01T00:00:00Z"
}
```

## 🎯 Características Principales

### ✅ Arquitectura
- Separación clara de responsabilidades
- Principios SOLID aplicados
- Patrón Repository
- DTOs para validación

### ✅ Procesamiento Asíncrono
- Jobs y colas para procesamiento de archivos
- Procesamiento independiente por orden
- Manejo de errores robusto

### ✅ Cache
- Cache de listado de órdenes
- Cache de estado de órdenes
- Invalidación automática al cambiar estado

### ✅ Validación
- Validación de archivos CSV/JSON
- Validación de datos con DTOs
- Manejo de errores descriptivo

## 🧪 Testing

```bash
# Laravel
cd laravel-api
php artisan test

# NestJS
cd nestjs-api
npm run test
```

## 📝 Formato de Archivos

### CSV
```csv
order_number,customer,product,quantity
ORD-001,Juan Perez,Servicio A,2
ORD-002,Ana Gomez,Medicamento B,1
```

### JSON
```json
[
  {
    "order_number": "ORD-001",
    "customer": "Juan Perez",
    "product": "Servicio A",
    "quantity": 2
  }
]
```

## 🔐 Variables de Entorno

Ver archivos `.env.example` en cada proyecto para configuración detallada.

## 📚 Documentación Adicional

- [Laravel API Documentation](./laravel-api/README.md)
- [NestJS API Documentation](./nestjs-api/README.md)
- [Frontend Documentation](./frontend/README.md)

## 👨‍💻 Autor

Desarrollado como prueba técnica siguiendo mejores prácticas de desarrollo.

## 📄 Licencia

Este proyecto es una prueba técnica.
