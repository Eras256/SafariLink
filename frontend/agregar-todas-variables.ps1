# Script para agregar todas las variables de entorno faltantes en Vercel
# Ejecutar desde: cd frontend && .\agregar-todas-variables.ps1

Write-Host "🚀 Agregando Variables de Entorno en Vercel" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Solicitar URL del backend
Write-Host "⚠️  IMPORTANTE: Necesitas la URL de tu backend en producción" -ForegroundColor Yellow
Write-Host "   Si no la tienes, despliega el backend primero (ver BACKEND_DEPLOYMENT_RAILWAY.md)" -ForegroundColor Yellow
Write-Host ""

$backendUrl = Read-Host "Ingresa la URL de tu backend (ejemplo: https://backend-production.up.railway.app)"
if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "⚠️  Usando URL placeholder. Actualiza después desde Vercel Dashboard." -ForegroundColor Yellow
    $backendUrl = "https://backend-production.up.railway.app"
}

$frontendUrl = "https://safari-link.vercel.app"

Write-Host ""
Write-Host "📋 Variables a agregar:" -ForegroundColor Green
Write-Host "   Backend URL: $backendUrl" -ForegroundColor White
Write-Host "   Frontend URL: $frontendUrl" -ForegroundColor White
Write-Host ""

Write-Host "🔧 Ejecutando comandos..." -ForegroundColor Cyan
Write-Host "   (Sigue las instrucciones en pantalla para cada variable)" -ForegroundColor Gray
Write-Host ""

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

foreach ($var in $variables) {
    Write-Host ""
    Write-Host "📝 Agregando: $($var.Name)" -ForegroundColor Yellow
    
    # Production
    Write-Host "   Production..." -ForegroundColor Cyan
    Write-Host "   Ejecuta: vercel env add $($var.Name) production" -ForegroundColor White
    Write-Host "   Valor: $($var.ProductionValue)" -ForegroundColor Gray
    vercel env add $var.Name production
    
    # Preview
    Write-Host "   Preview..." -ForegroundColor Cyan
    Write-Host "   Ejecuta: vercel env add $($var.Name) preview" -ForegroundColor White
    Write-Host "   Valor: $($var.PreviewValue)" -ForegroundColor Gray
    vercel env add $var.Name preview
    
    # Development
    Write-Host "   Development..." -ForegroundColor Cyan
    Write-Host "   Ejecuta: vercel env add $($var.Name) development" -ForegroundColor White
    Write-Host "   Valor: $($var.DevelopmentValue)" -ForegroundColor Gray
    vercel env add $var.Name development
}

Write-Host ""
Write-Host "✅ Variables agregadas!" -ForegroundColor Green
Write-Host ""
Write-Host "🔍 Verificar:" -ForegroundColor Cyan
Write-Host "   vercel env ls" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Redeployar:" -ForegroundColor Cyan
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""

