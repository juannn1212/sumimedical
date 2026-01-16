@echo off
REM Script para configurar el archivo .env de NestJS API

if exist .env (
    echo El archivo .env ya existe.
    set /p overwrite="¿Deseas sobrescribirlo? (S/N): "
    if /i not "%overwrite%"=="S" (
        echo Operación cancelada.
        exit /b
    )
)

echo Creando archivo .env...

(
echo # Database Configuration
echo # Para desarrollo local (sin Docker), usa estos valores:
echo DB_HOST=localhost
echo DB_PORT=3309
echo DB_USERNAME=nestjs
echo DB_PASSWORD=nestjs
echo DB_DATABASE=nestjs_orders
echo.
echo # Server Configuration
echo PORT=3000
echo NODE_ENV=development
) > .env

echo.
echo ✅ Archivo .env creado exitosamente!
echo.
echo Configuración aplicada:
echo   DB_HOST=localhost
echo   DB_PORT=3309
echo   DB_USERNAME=nestjs
echo   DB_PASSWORD=nestjs
echo   DB_DATABASE=nestjs_orders
echo.
echo ⚠️  IMPORTANTE: Asegúrate de que:
echo   1. Docker esté ejecutándose
echo   2. El contenedor mysql-nestjs esté corriendo (puerto 3309)
echo   3. La base de datos 'nestjs_orders' exista
echo.
echo Para iniciar Docker: docker-compose up -d mysql-nestjs
pause
