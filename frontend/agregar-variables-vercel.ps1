# Script para agregar variables de entorno en Vercel automáticamente
# Requiere: vercel CLI instalado y autenticado

Write-Host "🔧 Agregando variables de entorno en Vercel..." -ForegroundColor Cyan
Write-Host ""

$backendUrl = Read-Host "Ingresa la URL de tu backend en producción (ejemplo: https://backend-production.up.railway.app)"
if ([string]::IsNullOrWhiteSpace($backendUrl)) {
    Write-Host "⚠️  No se ingresó URL del backend. Usando placeholder." -ForegroundColor Yellow
    $backendUrl = "https://tu-backend-url.com"
}

$frontendUrl = "https://safari-link.vercel.app"

Write-Host ""
Write-Host "📝 Variables a agregar:" -ForegroundColor Yellow
Write-Host "   Backend URL: $backendUrl" -ForegroundColor White
Write-Host "   Frontend URL: $frontendUrl" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "¿Continuar? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "❌ Cancelado" -ForegroundColor Red
    exit
}

# Función para agregar variable
function Add-VercelEnv {
    param(
        [string]$Name,
        [string]$Value,
        [string[]]$Environments = @("production", "preview", "development")
    )
    
    foreach ($env in $Environments) {
        Write-Host "   Agregando $Name para $env..." -ForegroundColor Cyan
        # Nota: vercel env add requiere interacción, así que mostramos el comando
        Write-Host "   Ejecuta: vercel env add $Name $env" -ForegroundColor Gray
        Write-Host "   Valor: $Value" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "🚀 Agregando variables..." -ForegroundColor Green
Write-Host ""

# Variables a agregar
$variables = @(
    @{ Name = "NEXT_PUBLIC_API_URL"; Value = $backendUrl },
    @{ Name = "NEXT_PUBLIC_API_BASE_URL"; Value = "$backendUrl/api" },
    @{ Name = "NEXT_PUBLIC_APP_URL"; Value = $frontendUrl },
    @{ Name = "NEXT_PUBLIC_BASE_URL"; Value = $frontendUrl }
)

Write-Host "⚠️  NOTA: vercel env add requiere interacción manual." -ForegroundColor Yellow
Write-Host "   Ejecuta estos comandos manualmente:" -ForegroundColor Yellow
Write-Host ""

foreach ($var in $variables) {
    Write-Host "   # $($var.Name)" -ForegroundColor Cyan
    Write-Host "   vercel env add $($var.Name) production" -ForegroundColor White
    Write-Host "   # Valor: $($var.Value)" -ForegroundColor Gray
    Write-Host "   vercel env add $($var.Name) preview" -ForegroundColor White
    Write-Host "   # Valor: $($var.Value)" -ForegroundColor Gray
    Write-Host "   vercel env add $($var.Name) development" -ForegroundColor White
    if ($var.Name -eq "NEXT_PUBLIC_API_URL" -or $var.Name -eq "NEXT_PUBLIC_API_BASE_URL") {
        Write-Host "   # Valor para development: http://localhost:4000" -ForegroundColor Gray
    } else {
        Write-Host "   # Valor: http://localhost:3000" -ForegroundColor Gray
    }
    Write-Host ""
}

Write-Host "✅ Después de agregar todas las variables, ejecuta:" -ForegroundColor Green
Write-Host "   vercel --prod" -ForegroundColor White
Write-Host ""

