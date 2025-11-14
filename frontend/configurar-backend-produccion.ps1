# Script para configurar backend en producción
# Resuelve el problema de Talent Protocol en producción

Write-Host "🔍 Verificando configuración del backend en producción..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Debes ejecutar este script desde el directorio frontend/" -ForegroundColor Red
    exit 1
}

# Verificar que vercel está instalado
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Vercel CLI no está instalado. Instálalo con: npm i -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Variables actuales en Vercel:" -ForegroundColor Yellow
vercel env ls | Select-String "NEXT_PUBLIC_API_URL"

Write-Host ""
Write-Host "⚠️  PROBLEMA DETECTADO:" -ForegroundColor Red
Write-Host "   NEXT_PUBLIC_API_URL solo está configurado para Development" -ForegroundColor Yellow
Write-Host "   FALTA para Production y Preview" -ForegroundColor Yellow
Write-Host ""

Write-Host "❓ ¿Tienes el backend desplegado?" -ForegroundColor Cyan
Write-Host "   1. SÍ - Tengo backend desplegado (Railway, Render, etc.)" -ForegroundColor Green
Write-Host "   2. NO - No tengo backend desplegado" -ForegroundColor Yellow
Write-Host ""

$opcion = Read-Host "Selecciona una opción (1 o 2)"

if ($opcion -eq "1") {
    Write-Host ""
    Write-Host "✅ Perfecto. Necesitamos la URL de tu backend." -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Ejemplos de URLs de backend:" -ForegroundColor Cyan
    Write-Host "   - Railway: https://backend-production.up.railway.app" -ForegroundColor Gray
    Write-Host "   - Render: https://safari-link-backend.onrender.com" -ForegroundColor Gray
    Write-Host "   - Otro: https://api.tudominio.com" -ForegroundColor Gray
    Write-Host ""
    
    $backendUrl = Read-Host "Ingresa la URL de tu backend (sin /api al final)"
    
    if (-not $backendUrl) {
        Write-Host "❌ Error: URL no puede estar vacía" -ForegroundColor Red
        exit 1
    }
    
    # Limpiar la URL
    $backendUrl = $backendUrl.Trim().TrimEnd('/')
    $backendApiUrl = "$backendUrl/api"
    
    Write-Host ""
    Write-Host "🔄 Configurando variables en Vercel..." -ForegroundColor Cyan
    Write-Host "   Backend URL: $backendUrl" -ForegroundColor Gray
    Write-Host "   Backend API URL: $backendApiUrl" -ForegroundColor Gray
    Write-Host ""
    
    # Agregar NEXT_PUBLIC_API_URL para Production
    Write-Host "1️⃣ Agregando NEXT_PUBLIC_API_URL para Production..." -ForegroundColor Yellow
    echo $backendUrl | vercel env add NEXT_PUBLIC_API_URL production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Production: OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Production: Error" -ForegroundColor Red
    }
    
    # Agregar NEXT_PUBLIC_API_URL para Preview
    Write-Host "2️⃣ Agregando NEXT_PUBLIC_API_URL para Preview..." -ForegroundColor Yellow
    echo $backendUrl | vercel env add NEXT_PUBLIC_API_URL preview
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Preview: OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Preview: Error" -ForegroundColor Red
    }
    
    # Agregar NEXT_PUBLIC_API_BASE_URL para Production
    Write-Host "3️⃣ Agregando NEXT_PUBLIC_API_BASE_URL para Production..." -ForegroundColor Yellow
    echo $backendApiUrl | vercel env add NEXT_PUBLIC_API_BASE_URL production
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Production: OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Production: Error" -ForegroundColor Red
    }
    
    # Agregar NEXT_PUBLIC_API_BASE_URL para Preview
    Write-Host "4️⃣ Agregando NEXT_PUBLIC_API_BASE_URL para Preview..." -ForegroundColor Yellow
    echo $backendApiUrl | vercel env add NEXT_PUBLIC_API_BASE_URL preview
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ Preview: OK" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Preview: Error" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "✅ Variables configuradas. Ahora necesitas redesplegar:" -ForegroundColor Green
    Write-Host "   vercel --prod" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "¿Quieres que redesplegue ahora? (S/N)" -ForegroundColor Cyan
    $redesplegar = Read-Host
    
    if ($redesplegar -eq "S" -or $redesplegar -eq "s" -or $redesplegar -eq "Y" -or $redesplegar -eq "y") {
        Write-Host ""
        Write-Host "🚀 Redesplegando a producción..." -ForegroundColor Cyan
        vercel --prod
    }
    
} elseif ($opcion -eq "2") {
    Write-Host ""
    Write-Host "ℹ️  SITUACIÓN ACTUAL:" -ForegroundColor Cyan
    Write-Host "   - No tienes backend desplegado" -ForegroundColor Yellow
    Write-Host "   - Talent Protocol NO funcionará en producción" -ForegroundColor Yellow
    Write-Host "   - Los errores 503 son esperados (backend no disponible)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "✅ ESTO ES NORMAL:" -ForegroundColor Green
    Write-Host "   - El código maneja silenciosamente la falta de backend" -ForegroundColor Gray
    Write-Host "   - La sección de Talent Protocol se oculta automáticamente" -ForegroundColor Gray
    Write-Host "   - No se muestran errores confusos al usuario" -ForegroundColor Gray
    Write-Host ""
    Write-Host "📚 Si quieres desplegar el backend:" -ForegroundColor Cyan
    Write-Host "   1. Lee: BACKEND_DEPLOYMENT_RAILWAY.md" -ForegroundColor Yellow
    Write-Host "   2. Despliega el backend en Railway o Render" -ForegroundColor Yellow
    Write-Host "   3. Ejecuta este script de nuevo y selecciona opción 1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 NOTA: El frontend funciona perfectamente sin backend." -ForegroundColor Cyan
    Write-Host "   Solo las funcionalidades que requieren backend (como Talent Protocol)" -ForegroundColor Gray
    Write-Host "   no estarán disponibles hasta que despliegues el backend." -ForegroundColor Gray
} else {
    Write-Host "❌ Opción inválida. Debe ser 1 o 2." -ForegroundColor Red
    exit 1
}

