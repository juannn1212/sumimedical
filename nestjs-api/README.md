# NestJS API - Servicio Externo de Órdenes

## 📋 Descripción

API REST desarrollada en NestJS que recibe órdenes desde Laravel, las procesa de forma asíncrona simulando tareas pesadas, y retorna el estado de las órdenes.

## 🏗️ Arquitectura

La aplicación sigue los principios de **NestJS** con:

- **Controllers**: Manejan las peticiones HTTP
- **Services**: Lógica de negocio
- **DTOs**: Validación de datos con `class-validator`
- **Entities**: Entidades de TypeORM
- **Pipes**: Validación global con `ValidationPipe`

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar entorno:**

Ejecuta uno de los scripts de configuración:
```bash
# Windows PowerShell
.\setup-env.ps1

# Windows CMD
setup-env.bat
```

O crea manualmente el archivo `.env` con:
```env
# Para desarrollo local (sin Docker)
DB_HOST=localhost
DB_PORT=3309
DB_USERNAME=nestjs
DB_PASSWORD=nestjs
DB_DATABASE=nestjs_orders
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANTE:**
- Si ejecutas NestJS **localmente** (fuera de Docker): usa `DB_HOST=localhost` y `DB_PORT=3309`
- Si ejecutas NestJS **dentro de Docker**: usa `DB_HOST=mysql-nestjs` y `DB_PORT=3306`

3. **Asegúrate de que MySQL esté corriendo:**

Si usas Docker:
```bash
docker-compose up -d mysql-nestjs
```

4. **Ejecutar migraciones:**
```bash
npm run migration:run
```

5. **Iniciar aplicación:**
```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

## 📡 Endpoints

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
  "status": "pending",
  "message": "Orden recibida y en procesamiento"
}
```

### GET /external/orders/:id
Obtiene el estado de una orden procesada.

**Response:**
```json
{
  "id": 1,
  "order_number": "ORD-001",
  "customer": "Juan Perez",
  "product": "Servicio A",
  "quantity": 2,
  "status": "completed",
  "processed_at": "2024-01-01T00:00:00.000Z",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

## 🔄 Flujo de Procesamiento

1. **Recepción de orden** → `OrdersController::create()`
2. **Validación** → `CreateOrderDto` con `class-validator`
3. **Creación en BD** → `OrdersService::create()`
4. **Procesamiento asíncrono** → Simulación de tarea pesada (5-10 segundos)
5. **Actualización de estado** → `pending` → `processing` → `completed`

## ✅ Validación

La validación se realiza automáticamente mediante `ValidationPipe` y DTOs:

- `order_number`: String requerido
- `customer`: String requerido
- `product`: String requerido
- `quantity`: Entero positivo requerido

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## 📝 Características

- ✅ Validación robusta con DTOs y Pipes
- ✅ Procesamiento asíncrono simulado
- ✅ Manejo de errores
- ✅ TypeORM para persistencia
- ✅ Código limpio y mantenible

## 🔧 Solución de Problemas

### Error: "Access denied for user 'nestjs'@'localhost'"

1. Verifica que el contenedor MySQL esté corriendo:
   ```bash
   docker ps | grep mysql-nestjs
   ```

2. Verifica que el archivo `.env` tenga los valores correctos:
   - `DB_HOST=localhost` (para desarrollo local)
   - `DB_PORT=3309`
   - `DB_USERNAME=nestjs`
   - `DB_PASSWORD=nestjs`

3. Si el contenedor no está corriendo, inícialo:
   ```bash
   docker-compose up -d mysql-nestjs
   ```

4. Verifica que la base de datos exista:
   ```bash
   docker exec -it mysql-nestjs mysql -u nestjs -pnestjs -e "SHOW DATABASES;"
   ```
