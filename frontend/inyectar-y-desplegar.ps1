# Script para inyectar variables de entorno en Vercel y desplegar
# Ejecuta desde: cd frontend

Write-Host "🚀 Inyectando variables de entorno en Vercel..." -ForegroundColor Cyan
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

# Valores de las variables
$GEMINI_API_KEY = "your_gemini_api_key_here"
$REOWN_PROJECT_ID = "your_reown_project_id_here"
$UNSPLASH_ACCESS_KEY = "your_unsplash_access_key_here"

Write-Host "📝 Variables a inyectar:" -ForegroundColor Yellow
Write-Host "   - GEMINI_API_KEY" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_REOWN_PROJECT_ID (limpio)" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_UNSPLASH_ACCESS_KEY" -ForegroundColor Gray
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

# Agregar variables para Production, Preview y Development
$environments = @("production", "preview", "development")
$allSuccess = $true

Write-Host "🔄 Inyectando variables..." -ForegroundColor Cyan
Write-Host ""

foreach ($env in $environments) {
    Write-Host "📦 Entorno: $env" -ForegroundColor Yellow
    
    # GEMINI_API_KEY (server-side, sin NEXT_PUBLIC_)
    if (-not (Add-VercelEnv -Name "GEMINI_API_KEY" -Value $GEMINI_API_KEY -Environment $env)) {
        $allSuccess = $false
    }
    
    # NEXT_PUBLIC_REOWN_PROJECT_ID (limpio, sin saltos de línea)
    if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_REOWN_PROJECT_ID" -Value $REOWN_PROJECT_ID -Environment $env)) {
        $allSuccess = $false
    }
    
    # NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
    if (-not (Add-VercelEnv -Name "NEXT_PUBLIC_UNSPLASH_ACCESS_KEY" -Value $UNSPLASH_ACCESS_KEY -Environment $env)) {
        $allSuccess = $false
    }
    
    Write-Host ""
}

if (-not $allSuccess) {
    Write-Host "⚠️  Algunas variables no se pudieron agregar. Revisa los errores arriba." -ForegroundColor Yellow
    Write-Host ""
}

# Verificar variables
Write-Host "🔍 Verificando variables inyectadas..." -ForegroundColor Cyan
vercel env ls

Write-Host ""
Write-Host "🚀 Desplegando a producción..." -ForegroundColor Cyan
Write-Host ""

# Desplegar
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Despliegue completado!" -ForegroundColor Green
    Write-Host ""
    Write-Host "💡 Nota: Las variables ya están configuradas. El código limpia automáticamente" -ForegroundColor Cyan
    Write-Host "   los saltos de línea en REOWN_PROJECT_ID, pero ahora está limpio en Vercel." -ForegroundColor Cyan
} else {
    Write-Host ""
    Write-Host "❌ Error en el despliegue. Revisa los mensajes arriba." -ForegroundColor Red
}

