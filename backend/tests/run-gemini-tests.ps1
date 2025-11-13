# Script PowerShell para ejecutar tests de Gemini AI
# Asegura que el servicio esté corriendo antes de ejecutar los tests

$SERVICE_URL = "http://localhost:8000"
$SERVICE_DIR = "..\..\ai-services\mentor_bot"

Write-Host "🧪 Tests de Integración - Gemini AI" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si el servicio está corriendo
Write-Host "📡 Verificando si el servicio está corriendo..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$SERVICE_URL/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Servicio está corriendo en $SERVICE_URL" -ForegroundColor Green
} catch {
    Write-Host "❌ Servicio no está corriendo" -ForegroundColor Red
    Write-Host ""
    Write-Host "Iniciando servicio..." -ForegroundColor Yellow
    
    # Configurar API key
    $env:GEMINI_API_KEY = if ($env:GEMINI_API_KEY) { $env:GEMINI_API_KEY } else { "your_gemini_api_key_here" }
    
    # Cambiar al directorio del servicio
    Push-Location $SERVICE_DIR
    
    # Iniciar servicio en segundo plano
    $job = Start-Job -ScriptBlock {
        param($dir, $apiKey)
        Set-Location $dir
        $env:GEMINI_API_KEY = $apiKey
        python -m uvicorn main:app --host 0.0.0.0 --port 8000
    } -ArgumentList (Get-Location).Path, $env:GEMINI_API_KEY
    
    Write-Host "Servicio iniciado (Job ID: $($job.Id))" -ForegroundColor Yellow
    Write-Host "Esperando 5 segundos para que el servicio se inicie..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # Verificar nuevamente
    try {
        $response = Invoke-WebRequest -Uri "$SERVICE_URL/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
        Write-Host "✅ Servicio iniciado correctamente" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: El servicio no pudo iniciarse" -ForegroundColor Red
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -ErrorAction SilentlyContinue
        Pop-Location
        exit 1
    }
    
    Pop-Location
}

Write-Host ""
Write-Host "🚀 Ejecutando tests..." -ForegroundColor Cyan
Write-Host ""

# Ejecutar tests
npm test -- tests/gemini-ai.test.ts
$testExitCode = $LASTEXITCODE

# Si se inició el servicio en este script, detenerlo
if ($job) {
    Write-Host ""
    Write-Host "🛑 Deteniendo servicio (Job ID: $($job.Id))..." -ForegroundColor Yellow
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -ErrorAction SilentlyContinue
}

Write-Host ""
if ($testExitCode -eq 0) {
    Write-Host "✅ Tests completados exitosamente" -ForegroundColor Green
} else {
    Write-Host "❌ Tests fallaron" -ForegroundColor Red
}

exit $testExitCode

