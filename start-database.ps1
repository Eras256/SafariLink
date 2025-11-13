# Script para iniciar PostgreSQL y Redis con Docker

Write-Host "🐳 Iniciando PostgreSQL y Redis con Docker..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está corriendo
$dockerRunning = docker info 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker Desktop no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor:" -ForegroundColor Yellow
    Write-Host "1. Abre Docker Desktop" -ForegroundColor White
    Write-Host "2. Espera a que Docker esté completamente iniciado" -ForegroundColor White
    Write-Host "3. Ejecuta este script nuevamente" -ForegroundColor White
    Write-Host ""
    exit 1
}

Write-Host "✅ Docker está corriendo" -ForegroundColor Green
Write-Host ""

# Iniciar PostgreSQL y Redis
Write-Host "🚀 Iniciando servicios..." -ForegroundColor Cyan
docker-compose up -d postgres redis

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ PostgreSQL y Redis iniciados correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Esperando a que los servicios estén listos..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Verificar que PostgreSQL esté listo
    $postgresReady = docker exec safarilink-postgres-1 pg_isready -U safarilink 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL está listo" -ForegroundColor Green
    } else {
        Write-Host "⏳ PostgreSQL aún está iniciando, espera unos segundos más..." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "Servicios disponibles:" -ForegroundColor Cyan
    Write-Host "  - PostgreSQL: localhost:5432" -ForegroundColor White
    Write-Host "  - Redis: localhost:6379" -ForegroundColor White
    Write-Host ""
    Write-Host "Ahora puedes iniciar el backend con:" -ForegroundColor Yellow
    Write-Host "  cd backend" -ForegroundColor White
    Write-Host "  npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Error al iniciar los servicios" -ForegroundColor Red
    Write-Host "Verifica los logs con: docker-compose logs postgres redis" -ForegroundColor Yellow
}

