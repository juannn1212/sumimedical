# Script para verificar la conexión a la base de datos

Write-Host "🔍 Verificando configuración de base de datos..." -ForegroundColor Cyan
Write-Host ""

# Verificar archivo .env
if (Test-Path .env) {
    Write-Host "✅ Archivo .env encontrado" -ForegroundColor Green
    $envContent = Get-Content .env
    $dbHost = ($envContent | Select-String "DB_HOST=").ToString().Split("=")[1]
    $dbPort = ($envContent | Select-String "DB_PORT=").ToString().Split("=")[1]
    $dbUser = ($envContent | Select-String "DB_USERNAME=").ToString().Split("=")[1]
    $dbName = ($envContent | Select-String "DB_DATABASE=").ToString().Split("=")[1]
    
    Write-Host "   DB_HOST: $dbHost" -ForegroundColor White
    Write-Host "   DB_PORT: $dbPort" -ForegroundColor White
    Write-Host "   DB_USERNAME: $dbUser" -ForegroundColor White
    Write-Host "   DB_DATABASE: $dbName" -ForegroundColor White
} else {
    Write-Host "❌ Archivo .env NO encontrado" -ForegroundColor Red
    Write-Host "   Ejecuta: .\setup-env.ps1" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🐳 Verificando contenedor Docker..." -ForegroundColor Cyan

# Verificar si Docker está corriendo
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Docker está corriendo" -ForegroundColor Green
    
    # Verificar contenedor mysql-nestjs
    $mysqlContainer = docker ps --filter "name=mysql-nestjs" --format "{{.Names}}" 2>&1
    if ($mysqlContainer -match "mysql-nestjs") {
        Write-Host "✅ Contenedor mysql-nestjs está corriendo" -ForegroundColor Green
        
        # Verificar puerto
        $portCheck = docker port mysql-nestjs 2>&1
        if ($portCheck -match "3309") {
            Write-Host "✅ Puerto 3309 está mapeado correctamente" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Puerto 3309 no encontrado en el contenedor" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Contenedor mysql-nestjs NO está corriendo" -ForegroundColor Red
        Write-Host "   Inicia el contenedor con: docker-compose up -d mysql-nestjs" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Docker no está corriendo o no está instalado" -ForegroundColor Yellow
    Write-Host "   Asegúrate de tener Docker Desktop ejecutándose" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📝 Resumen:" -ForegroundColor Cyan
Write-Host "   Si todo está correcto, ejecuta: npm run start:dev" -ForegroundColor White
Write-Host "   Si hay errores, revisa la configuración anterior" -ForegroundColor White
