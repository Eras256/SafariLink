# Script para iniciar el backend

Write-Host "🚀 Iniciando SafariLink Backend..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde: backend" -ForegroundColor Yellow
    exit 1
}

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Configurar variables de entorno mínimas si no están configuradas
if (-not $env:DATABASE_URL) {
    Write-Host "⚠️  DATABASE_URL no está configurada" -ForegroundColor Yellow
    Write-Host "   Usando valor por defecto..." -ForegroundColor Yellow
    $env:DATABASE_URL = "postgresql://safarilink:safarilink123@localhost:5432/safarilink"
}

if (-not $env:REDIS_URL) {
    Write-Host "⚠️  REDIS_URL no está configurada" -ForegroundColor Yellow
    Write-Host "   Usando valor por defecto..." -ForegroundColor Yellow
    $env:REDIS_URL = "redis://localhost:6379"
}

if (-not $env:JWT_SECRET) {
    Write-Host "⚠️  JWT_SECRET no está configurada" -ForegroundColor Yellow
    Write-Host "   Generando secreto temporal..." -ForegroundColor Yellow
    $env:JWT_SECRET = "temporary-secret-key-min-32-characters-long-for-development-only"
}

# Verificar si el puerto está en uso
$portInUse = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Puerto 4000 está en uso" -ForegroundColor Yellow
    Write-Host "   Deteniendo proceso anterior..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

Write-Host "✅ Iniciando servidor en puerto 4000..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend disponible en:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:4000/api" -ForegroundColor White
Write-Host "  - Health: http://localhost:4000/health" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servicio" -ForegroundColor Yellow
Write-Host ""

# Iniciar el backend
npm run dev

