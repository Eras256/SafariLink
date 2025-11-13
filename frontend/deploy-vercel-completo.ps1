# Script completo para desplegar en Vercel con todas las variables necesarias
# Este script configura las variables y despliega automáticamente

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
Write-Host "📋 Variables de Entorno a Configurar:" -ForegroundColor Yellow
Write-Host ""

# Variables esenciales con valores embebidos
$envVars = @(
    @{
        Name = "GEMINI_API_KEY"
        Value = "your_gemini_api_key_here"
        Description = "Google Gemini API Key"
    },
    @{
        Name = "NEXT_PUBLIC_REOWN_PROJECT_ID"
        Value = "your_reown_project_id_here"
        Description = "Reown AppKit Project ID"
    },
    @{
        Name = "NEXT_PUBLIC_UNSPLASH_ACCESS_KEY"
        Value = "your_unsplash_access_key_here"
        Description = "Unsplash API Access Key"
    }
)

# Preguntar por la URL del backend
Write-Host "⚠️  IMPORTANTE: ¿Tienes el backend desplegado?" -ForegroundColor Yellow
Write-Host "   Si tienes backend en Railway, ingresa la URL (ej: https://backend-production.up.railway.app)" -ForegroundColor Gray
Write-Host "   Si NO tienes backend, presiona Enter para usar detección automática" -ForegroundColor Gray
Write-Host ""
$backendUrl = Read-Host "URL del Backend (o Enter para detección automática)"

if ($backendUrl) {
    $envVars += @{
        Name = "NEXT_PUBLIC_API_URL"
        Value = $backendUrl
        Description = "Backend API URL"
    }
    $envVars += @{
        Name = "NEXT_PUBLIC_API_BASE_URL"
        Value = "$backendUrl/api"
        Description = "Backend API Base URL"
    }
} else {
    Write-Host "   ℹ️  Usando detección automática de backend (api.{hostname})" -ForegroundColor Cyan
}

# Preguntar por la URL de la app
Write-Host ""
$appUrl = Read-Host "URL de la App en Vercel (o Enter para usar safari-link.vercel.app)"
if (-not $appUrl) {
    $appUrl = "https://safari-link.vercel.app"
}

$envVars += @{
    Name = "NEXT_PUBLIC_APP_URL"
    Value = $appUrl
    Description = "Application URL"
}
$envVars += @{
    Name = "NEXT_PUBLIC_BASE_URL"
    Value = $appUrl
    Description = "Base URL"
}

Write-Host ""
Write-Host "📦 Agregando Variables de Entorno..." -ForegroundColor Cyan
Write-Host ""

$environments = @("production", "preview", "development")

foreach ($var in $envVars) {
    Write-Host "  Configurando $($var.Name)..." -ForegroundColor Gray
    Write-Host "    Descripción: $($var.Description)" -ForegroundColor DarkGray
    
    foreach ($env in $environments) {
        Write-Host "    - $env" -ForegroundColor DarkGray
        # Usar echo para pasar el valor a vercel env add
        $var.Value | vercel env add $var.Name $env --force 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "      ✅ Configurado" -ForegroundColor Green
        } else {
            Write-Host "      ⚠️  Ya existe o error" -ForegroundColor Yellow
        }
    }
    Write-Host ""
}

Write-Host ""
Write-Host "✅ Variables configuradas" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Desplegando a producción..." -ForegroundColor Cyan
Write-Host ""

# Desplegar
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ ¡Despliegue completado exitosamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Próximos pasos:" -ForegroundColor Yellow
    Write-Host "   1. Verifica el deployment en: https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   2. Prueba la aplicación en: $appUrl" -ForegroundColor White
    Write-Host "   3. Verifica las variables en: Settings → Environment Variables" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Error en el despliegue" -ForegroundColor Red
    Write-Host "   Revisa los logs arriba para más detalles" -ForegroundColor Yellow
}

