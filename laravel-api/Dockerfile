FROM php:8.2-cli

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Instalar Redis extension
RUN pecl install redis && docker-php-ext-enable redis

# Establecer directorio de trabajo
WORKDIR /var/www/html

# Copiar todos los archivos
COPY . .

# Instalar dependencias (sin scripts porque artisan aún no está configurado)
RUN composer install --no-dev --no-scripts --optimize-autoloader

# Crear directorios necesarios (si no existen)
RUN mkdir -p storage/framework/sessions storage/framework/views storage/framework/cache \
    && mkdir -p storage/logs \
    && mkdir -p bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache || true

EXPOSE 8000

CMD php artisan serve --host=0.0.0.0 --port=8000
