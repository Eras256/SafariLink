# Script para desplegar en Vercel con todas las variables de entorno

Write-Host "🚀 Desplegando SafariLink Frontend a Vercel" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde: frontend" -ForegroundColor Yellow
    exit 1
}

# Verificar que Vercel CLI esté instalado
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI no está instalado" -ForegroundColor Red
    Write-Host "   Instala con: npm i -g vercel" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "📋 Configurando Variables de Entorno..." -ForegroundColor Yellow
Write-Host ""

# Variables a configurar
$envVars = @{
    "GEMINI_API_KEY" = "your_gemini_api_key_here"
    "NEXT_PUBLIC_REOWN_PROJECT_ID" = "your_reown_project_id_here"
    "NEXT_PUBLIC_UNSPLASH_ACCESS_KEY" = "your_unsplash_access_key_here"
}

$environments = @("production", "preview", "development")

foreach ($varName in $envVars.Keys) {
    $varValue = $envVars[$varName]
    Write-Host "  Configurando $varName..." -ForegroundColor Gray
    
    foreach ($env in $environments) {
        Write-Host "    - $env" -ForegroundColor DarkGray
        # Nota: vercel env add requiere interacción, así que solo mostramos instrucciones
    }
}

Write-Host ""
Write-Host "⚠️  IMPORTANTE: Debes configurar las variables manualmente" -ForegroundColor Yellow
Write-Host ""
Write-Host "Opciones:" -ForegroundColor Cyan
Write-Host "  1. Dashboard: https://vercel.com/dashboard → Tu Proyecto → Settings → Environment Variables" -ForegroundColor White
Write-Host "  2. CLI: vercel env add VARIABLE_NAME production preview development" -ForegroundColor White
Write-Host ""

$continue = Read-Host "¿Ya configuraste las variables de entorno? (s/n)"
if ($continue -ne "s" -and $continue -ne "S") {
    Write-Host ""
    Write-Host "📝 Variables que necesitas configurar:" -ForegroundColor Yellow
    Write-Host ""
    foreach ($varName in $envVars.Keys) {
        Write-Host "  $varName = $($envVars[$varName])" -ForegroundColor White
    }
    Write-Host ""
    Write-Host "Ejecuta este script nuevamente después de configurar las variables." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔨 Compilando proyecto..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la compilación. Revisa los errores arriba." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Compilación exitosa" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Desplegando a Vercel..." -ForegroundColor Yellow
Write-Host ""

# Desplegar
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Despliegue exitoso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Tu aplicación está disponible en:" -ForegroundColor Cyan
    Write-Host "  https://safari-link.vercel.app" -ForegroundColor White
    Write-Host ""
    Write-Host "🧪 Prueba el endpoint de Gemini:" -ForegroundColor Cyan
    Write-Host "  https://safari-link.vercel.app/api/test-gemini" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Error en el despliegue. Revisa los mensajes arriba." -ForegroundColor Red
    exit 1
}

