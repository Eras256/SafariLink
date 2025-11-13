# Script de prueba para el servicio Mentor Bot

Write-Host "🧪 Probando Servicio Mentor Bot" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "1. Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET
    Write-Host "   ✅ Servicio saludable" -ForegroundColor Green
    Write-Host "   Gemini configurado: $($health.gemini_configured)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Test 2: Test Gemini Connection
Write-Host "2. Test Gemini Connection..." -ForegroundColor Yellow
try {
    $test = Invoke-RestMethod -Uri "http://localhost:8000/test-gemini" -Method GET
    if ($test.success) {
        Write-Host "   ✅ Conexión exitosa" -ForegroundColor Green
        Write-Host "   Modelo usado: $($test.modelUsed)" -ForegroundColor Gray
    } else {
        Write-Host "   ❌ Error: $($test.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: Ask Question
Write-Host "3. Hacer una pregunta..." -ForegroundColor Yellow
$body = @{
    question = "What is a smart contract?"
    language = "en"
    context = @{}
    conversationHistory = @()
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/ask" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   ✅ Pregunta respondida" -ForegroundColor Green
    Write-Host "   Modelo: $($response.modelUsed)" -ForegroundColor Gray
    Write-Host "   Respuesta (primeros 100 caracteres):" -ForegroundColor Gray
    Write-Host "   $($response.answer.Substring(0, [Math]::Min(100, $response.answer.Length)))..." -ForegroundColor White
    Write-Host "   Recursos sugeridos: $($response.suggestedResources.Count)" -ForegroundColor Gray
    Write-Host "   Preguntas relacionadas: $($response.relatedQuestions.Count)" -ForegroundColor Gray
} catch {
    Write-Host "   ❌ Error: $_" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "   Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "✅ Tests completados" -ForegroundColor Green


