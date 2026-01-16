# Script para configurar el archivo .env de NestJS API

$envPath = Join-Path $PSScriptRoot ".env"

if (Test-Path $envPath) {
    Write-Host "El archivo .env ya existe." -ForegroundColor Yellow
    Write-Host "¿Deseas sobrescribirlo? (S/N): " -NoNewline
    $response = Read-Host
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit
    }
}

Write-Host "Creando archivo .env..." -ForegroundColor Green

$envContent = @"
# Database Configuration
# Para desarrollo local (sin Docker), usa estos valores:
DB_HOST=localhost
DB_PORT=3309
DB_USERNAME=nestjs
DB_PASSWORD=nestjs
DB_DATABASE=nestjs_orders

# Server Configuration
PORT=3000
NODE_ENV=development
"@

Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host "✅ Archivo .env creado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Configuración aplicada:" -ForegroundColor Cyan
Write-Host "  DB_HOST=localhost" -ForegroundColor White
Write-Host "  DB_PORT=3309" -ForegroundColor White
Write-Host "  DB_USERNAME=nestjs" -ForegroundColor White
Write-Host "  DB_PASSWORD=nestjs" -ForegroundColor White
Write-Host "  DB_DATABASE=nestjs_orders" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Asegúrate de que:" -ForegroundColor Yellow
Write-Host "  1. Docker esté ejecutándose" -ForegroundColor White
Write-Host "  2. El contenedor mysql-nestjs esté corriendo (puerto 3309)" -ForegroundColor White
Write-Host "  3. La base de datos 'nestjs_orders' exista" -ForegroundColor White
Write-Host ""
Write-Host "Para iniciar Docker: docker-compose up -d mysql-nestjs" -ForegroundColor Cyan
