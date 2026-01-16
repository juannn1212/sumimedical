@echo off
echo 🔍 Verificando configuración de base de datos...
echo.

if exist .env (
    echo ✅ Archivo .env encontrado
    findstr "DB_HOST=" .env
    findstr "DB_PORT=" .env
    findstr "DB_USERNAME=" .env
    findstr "DB_DATABASE=" .env
) else (
    echo ❌ Archivo .env NO encontrado
    echo    Ejecuta: setup-env.bat
    exit /b 1
)

echo.
echo 🐳 Verificando contenedor Docker...

docker ps >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Docker está corriendo
    
    docker ps --filter "name=mysql-nestjs" --format "{{.Names}}" | findstr "mysql-nestjs" >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Contenedor mysql-nestjs está corriendo
    ) else (
        echo ❌ Contenedor mysql-nestjs NO está corriendo
        echo    Inicia el contenedor con: docker-compose up -d mysql-nestjs
    )
) else (
    echo ⚠️  Docker no está corriendo o no está instalado
    echo    Asegúrate de tener Docker Desktop ejecutándose
)

echo.
echo 📝 Resumen:
echo    Si todo está correcto, ejecuta: npm run start:dev
echo    Si hay errores, revisa la configuración anterior
pause
