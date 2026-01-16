# Prueba Técnica - Sistema de Procesamiento de Órdenes

Hola, este es el repositorio con mi solución para la prueba técnica. He implementado una arquitectura de microservicios orientada a eventos, contenerizada totalmente con Docker para facilitar su despliegue y pruebas.

## 🚀 Cómo correr mi proyecto (Recomendado: Docker)

Para que no tengas que configurar entornos locales, he preparado un `docker-compose` que levanta todo el ecosistema (Laravel, NestJS, MySQL, Redis y Next.js) con un solo comando.

Pasos que debes seguir:

```bash
git clone https://github.com/juannn1212/sumimedical.git
cd sumimedical

# Levantar todos los contenedores
docker-compose up -d --build

# --- Configuración de Laravel (Orquestador) ---
# Instalar dependencias backend
docker-compose exec laravel-api composer install
# Generar key y correr migraciones
docker-compose exec laravel-api php artisan key:generate
docker-compose exec laravel-api php artisan migrate

# --- Configuración de NestJS (Worker) ---
# Instalar dependencias y correr migraciones
docker-compose exec nestjs-api npm install
docker-compose exec nestjs-api npm run migration:run
```

Una vez termine, tendrás todo corriendo en estos puertos:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | `http://localhost:3001` | La interfaz que construí para cargar archivos y ver estados. |
| **Laravel API** | `http://localhost:8000` | El backend principal que recibe peticiones y orquesta todo. |
| **NestJS API** | `http://localhost:3000` | El microservicio worker que procesa la lógica pesada. |

---

## 🏗️ Mis Decisiones de Arquitectura

Para cumplir con los requerimientos de robustez y escalabilidad, diseñé la solución de la siguiente manera:

1.  **Laravel como Orquestador:** Decidí usar Laravel para la API principal por su facilidad para manejar validaciones y su potente sistema de colas. Es el punto de entrada.
2.  **NestJS como Worker Especializado:** Para la lógica de "procesamiento pesado", elegí NestJS. Este servicio actúa de forma independiente y asíncrona.
3.  **Comunicación Asíncrona:** Implementé un flujo donde Laravel no espera a NestJS.
    *   Laravel recibe el CSV -> Valida -> Crea un Job en **Redis**.
    *   El worker toma el Job -> Llama a NestJS -> NestJS procesa y guarda.
    *   Esto asegura que la API principal nunca se bloquee, incluso con archivos grandes.
4.  **Frontend en Next.js:** Aunque era opcional, quise agregar una interfaz gráfica simple en Next.js para facilitar las pruebas de carga de archivos CSV.

### Stack Tecnológico que utilicé
*   **PHP 8.2 & Laravel 9**
*   **Node.js 20 & NestJS** (con TypeORM)
*   **MySQL 8** (Una base de datos por servicio para mantener independencia)
*   **Redis 7** (Para la gestión de colas)
*   **Docker Compose** (Para la orquestación de contenedores)

## 🧪 Cómo probar la solución

1.  Abre el Frontend en `http://localhost:3001`.
2.  Usa el archivo de prueba `ejemplo_ordenes.csv` que dejé en la raíz del proyecto.
3.  Sube el archivo. Verás como las órdenes aparecen en estado `pending` y cambian a `processed` automáticamente a medida que el worker de NestJS las procesa.

Cualquier duda con el código, estoy atento.
