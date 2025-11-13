# Script para iniciar el servicio Mentor Bot

Write-Host "🚀 Iniciando SafariLink Mentor Bot..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde: ai-services/mentor_bot_ts" -ForegroundColor Yellow
    exit 1
}

# Configurar API key si no está configurada
if (-not $env:GEMINI_API_KEY) {
    Write-Host "⚠️  GEMINI_API_KEY no está configurada" -ForegroundColor Yellow
    Write-Host "   Configurando API key por defecto..." -ForegroundColor Yellow
    $env:GEMINI_API_KEY = "your_gemini_api_key_here"
}

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Compilar si es necesario
if (-not (Test-Path "dist")) {
    Write-Host "🔨 Compilando TypeScript..." -ForegroundColor Yellow
    npm run build
}

# Verificar si el puerto está en uso
$portInUse = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Puerto 8000 está en uso" -ForegroundColor Yellow
    Write-Host "   Deteniendo proceso anterior..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

Write-Host "✅ Iniciando servidor en puerto 8000..." -ForegroundColor Green
Write-Host ""
Write-Host "Servicio disponible en:" -ForegroundColor Cyan
Write-Host "  - Health: http://localhost:8000/health" -ForegroundColor White
Write-Host "  - Test: http://localhost:8000/test-gemini" -ForegroundColor White
Write-Host "  - Ask: http://localhost:8000/ask" -ForegroundColor White
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servicio" -ForegroundColor Yellow
Write-Host ""

# Iniciar el servicio
npm run dev

