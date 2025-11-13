# Script automatizado para agregar variables de entorno en Vercel
# Usa valores por defecto que luego puedes actualizar desde el dashboard

$ErrorActionPreference = "Continue"

Write-Host "🚀 Agregando Variables de Entorno Automáticamente" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# URL del backend (actualiza esto con tu URL real)
$backendUrl = "https://backend-production.up.railway.app"
$frontendUrl = "https://safari-link.vercel.app"

Write-Host "📋 Valores a usar:" -ForegroundColor Yellow
Write-Host "   Backend URL: $backendUrl" -ForegroundColor White
Write-Host "   Frontend URL: $frontendUrl" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Si tu backend tiene una URL diferente, actualízala después desde Vercel Dashboard" -ForegroundColor Yellow
Write-Host ""

# Función para agregar variable de forma no interactiva
function Add-VercelEnvNonInteractive {
    param(
        [string]$Name,
        [string]$Value,
        [string]$Environment
    )
    
    Write-Host "   Agregando $Name para $Environment..." -ForegroundColor Cyan
    
    # Intentar agregar usando echo
    $result = echo $Value | vercel env add $Name $Environment 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   ✅ $Name agregada para $Environment" -ForegroundColor Green
        return $true
    } else {
        Write-Host "   ⚠️  Requiere interacción manual para $Name ($Environment)" -ForegroundColor Yellow
        Write-Host "   Ejecuta: vercel env add $Name $Environment" -ForegroundColor Gray
        Write-Host "   Valor: $Value" -ForegroundColor Gray
        return $false
    }
}

# Variables a agregar
$variables = @(
    @{
        Name = "NEXT_PUBLIC_API_URL"
        ProductionValue = $backendUrl
        PreviewValue = $backendUrl
        DevelopmentValue = "http://localhost:4000"
    },
    @{
        Name = "NEXT_PUBLIC_API_BASE_URL"
        ProductionValue = "$backendUrl/api"
        PreviewValue = "$backendUrl/api"
        DevelopmentValue = "http://localhost:4000/api"
    },
    @{
        Name = "NEXT_PUBLIC_APP_URL"
        ProductionValue = $frontendUrl
        PreviewValue = $frontendUrl
        DevelopmentValue = "http://localhost:3000"
    },
    @{
        Name = "NEXT_PUBLIC_BASE_URL"
        ProductionValue = $frontendUrl
        PreviewValue = $frontendUrl
        DevelopmentValue = "http://localhost:3000"
    }
)

$added = 0
$manual = 0

foreach ($var in $variables) {
    Write-Host ""
    Write-Host "📝 Procesando: $($var.Name)" -ForegroundColor Yellow
    
    # Production
    if (Add-VercelEnvNonInteractive $var.Name $var.ProductionValue "production") {
        $added++
    } else {
        $manual++
    }
    
    # Preview
    if (Add-VercelEnvNonInteractive $var.Name $var.PreviewValue "preview") {
        $added++
    } else {
        $manual++
    }
    
    # Development
    if (Add-VercelEnvNonInteractive $var.Name $var.DevelopmentValue "development") {
        $added++
    } else {
        $manual++
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ Proceso completado" -ForegroundColor Green
Write-Host "   Variables agregadas automáticamente: $added" -ForegroundColor Green
if ($manual -gt 0) {
    Write-Host "   Variables que requieren agregar manualmente: $manual" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📝 Para agregar las restantes, ve a:" -ForegroundColor Yellow
    Write-Host "   https://vercel.com/dashboard" -ForegroundColor White
    Write-Host "   Settings > Environment Variables" -ForegroundColor White
}
Write-Host ""
Write-Host "🔍 Verificar:" -ForegroundColor Cyan
Write-Host "   vercel env ls" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Redeployar:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""

