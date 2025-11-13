# Script para agregar variables de entorno en Vercel
# Ejecutar desde el directorio frontend

Write-Host "🔧 Agregando variables de entorno en Vercel..." -ForegroundColor Cyan

# Variables a agregar
$variables = @(
    @{
        Name = "NEXT_PUBLIC_API_URL"
        Description = "URL del backend en producción (ejemplo: https://backend-production.up.railway.app)"
        DefaultValue = "https://tu-backend-url.com"
    },
    @{
        Name = "NEXT_PUBLIC_API_BASE_URL"
        Description = "URL base del API (ejemplo: https://backend-production.up.railway.app/api)"
        DefaultValue = "https://tu-backend-url.com/api"
    },
    @{
        Name = "NEXT_PUBLIC_AI_SERVICE_URL"
        Description = "URL del servicio de AI (opcional)"
        DefaultValue = "https://tu-ai-service-url.com"
    },
    @{
        Name = "NEXT_PUBLIC_APP_URL"
        Description = "URL de la aplicación frontend"
        DefaultValue = "https://safari-link.vercel.app"
    },
    @{
        Name = "NEXT_PUBLIC_BASE_URL"
        Description = "URL base de la aplicación"
        DefaultValue = "https://safari-link.vercel.app"
    }
)

foreach ($var in $variables) {
    Write-Host "`n📝 Agregando: $($var.Name)" -ForegroundColor Yellow
    Write-Host "   Descripción: $($var.Description)" -ForegroundColor Gray
    Write-Host "   Valor por defecto: $($var.DefaultValue)" -ForegroundColor Gray
    Write-Host "   ⚠️  IMPORTANTE: Actualiza el valor desde Vercel Dashboard después" -ForegroundColor Red
    
    # Agregar para Production
    Write-Host "   Agregando para Production..." -ForegroundColor Cyan
    $value = Read-Host "   Ingresa el valor (o presiona Enter para usar el default: $($var.DefaultValue))"
    if ([string]::IsNullOrWhiteSpace($value)) {
        $value = $var.DefaultValue
    }
    
    # Nota: vercel env add requiere interacción, así que solo mostramos instrucciones
    Write-Host "   Ejecuta manualmente:" -ForegroundColor Green
    Write-Host "   vercel env add $($var.Name) production" -ForegroundColor White
    Write-Host "   (Cuando te pida el valor, ingresa: $value)" -ForegroundColor White
    Write-Host ""
}

Write-Host "`n✅ Para agregar todas las variables, ejecuta estos comandos:" -ForegroundColor Green
Write-Host ""
Write-Host "# NEXT_PUBLIC_API_URL (REQUERIDO - URL de tu backend en producción)" -ForegroundColor Yellow
Write-Host "vercel env add NEXT_PUBLIC_API_URL production preview development" -ForegroundColor White
Write-Host ""
Write-Host "# NEXT_PUBLIC_API_BASE_URL" -ForegroundColor Yellow
Write-Host "vercel env add NEXT_PUBLIC_API_BASE_URL production preview development" -ForegroundColor White
Write-Host ""
Write-Host "# NEXT_PUBLIC_APP_URL" -ForegroundColor Yellow
Write-Host "vercel env add NEXT_PUBLIC_APP_URL production preview development" -ForegroundColor White
Write-Host ""
Write-Host "# NEXT_PUBLIC_BASE_URL" -ForegroundColor Yellow
Write-Host "vercel env add NEXT_PUBLIC_BASE_URL production preview development" -ForegroundColor White
Write-Host ""

