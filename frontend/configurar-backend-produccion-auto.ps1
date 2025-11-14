# Script automático para configurar backend en producción
# Uso: .\configurar-backend-produccion-auto.ps1 -BackendUrl "https://tu-backend-url.com"
# O sin parámetros para modo interactivo

param(
    [string]$BackendUrl = ""
)

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

# Si no se proporcionó URL, preguntar
if (-not $BackendUrl) {
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
        
        $BackendUrl = Read-Host "Ingresa la URL de tu backend (sin /api al final)"
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
        Write-Host "   3. Ejecuta este script de nuevo con: .\configurar-backend-produccion-auto.ps1 -BackendUrl 'https://tu-backend-url.com'" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    } else {
        Write-Host "❌ Opción inválida. Debe ser 1 o 2." -ForegroundColor Red
        exit 1
    }
}

if (-not $BackendUrl) {
    Write-Host "❌ Error: URL no puede estar vacía" -ForegroundColor Red
    exit 1
}

# Limpiar la URL
$BackendUrl = $BackendUrl.Trim().TrimEnd('/')
$backendApiUrl = "$BackendUrl/api"

Write-Host ""
Write-Host "🔄 Configurando variables en Vercel..." -ForegroundColor Cyan
Write-Host "   Backend URL: $BackendUrl" -ForegroundColor Gray
Write-Host "   Backend API URL: $backendApiUrl" -ForegroundColor Gray
Write-Host ""

# Función para agregar variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "   Agregando $Name para $Environment..." -ForegroundColor Cyan -NoNewline
    
    # Eliminar variable existente (silenciosamente)
    vercel env rm $Name $Environment --yes 2>&1 | Out-Null
    
    # Agregar nueva variable
    $result = echo $Value | vercel env add $Name $Environment 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✅" -ForegroundColor Green
        return $true
    } else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "      Error: $result" -ForegroundColor Red
        return $false
    }
}

# Agregar variables
$allSuccess = $true

# NEXT_PUBLIC_API_URL para Production
if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_API_URL" -Value $BackendUrl -Environment "production")) {
    $allSuccess = $false
}

# NEXT_PUBLIC_API_URL para Preview
if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_API_URL" -Value $BackendUrl -Environment "preview")) {
    $allSuccess = $false
}

# NEXT_PUBLIC_API_BASE_URL para Production
if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_API_BASE_URL" -Value $backendApiUrl -Environment "production")) {
    $allSuccess = $false
}

# NEXT_PUBLIC_API_BASE_URL para Preview
if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_API_BASE_URL" -Value $backendApiUrl -Environment "preview")) {
    $allSuccess = $false
}

Write-Host ""
if ($allSuccess) {
    Write-Host "✅ Variables configuradas correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Redesplegando a producción..." -ForegroundColor Cyan
    vercel --prod
} else {
    Write-Host "⚠️  Algunas variables no se pudieron configurar. Revisa los errores arriba." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "💡 Puedes intentar configurarlas manualmente desde el dashboard de Vercel:" -ForegroundColor Cyan
    Write-Host "   https://vercel.com/dashboard" -ForegroundColor Yellow
}

