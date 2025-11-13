# Script para corregir NEXT_PUBLIC_REOWN_PROJECT_ID en Vercel
# Elimina saltos de línea y espacios en blanco

Write-Host "🔧 Corrigiendo NEXT_PUBLIC_REOWN_PROJECT_ID en Vercel..." -ForegroundColor Cyan

# El Project ID correcto (sin saltos de línea)
$PROJECT_ID = "your_reown_project_id_here"

Write-Host "`n📝 Project ID a usar: $PROJECT_ID" -ForegroundColor Yellow

# Verificar si estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: Debes ejecutar este script desde el directorio frontend/" -ForegroundColor Red
    exit 1
}

# Verificar si vercel está instalado
try {
    $vercelVersion = vercel --version 2>&1
    Write-Host "✅ Vercel CLI encontrado: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Vercel CLI no está instalado. Instálalo con: npm i -g vercel" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔄 Actualizando variable en Vercel..." -ForegroundColor Cyan

# Eliminar la variable antigua (si existe)
Write-Host "`n1️⃣ Eliminando variable antigua (si existe)..." -ForegroundColor Yellow
vercel env rm NEXT_PUBLIC_REOWN_PROJECT_ID production --yes 2>&1 | Out-Null
vercel env rm NEXT_PUBLIC_REOWN_PROJECT_ID preview --yes 2>&1 | Out-Null
vercel env rm NEXT_PUBLIC_REOWN_PROJECT_ID development --yes 2>&1 | Out-Null

# Agregar la variable nueva (limpia)
Write-Host "`n2️⃣ Agregando variable nueva (limpia)..." -ForegroundColor Yellow

# Production
echo $PROJECT_ID | vercel env add NEXT_PUBLIC_REOWN_PROJECT_ID production
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Production: OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Production: Error" -ForegroundColor Red
}

# Preview
echo $PROJECT_ID | vercel env add NEXT_PUBLIC_REOWN_PROJECT_ID preview
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Preview: OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Preview: Error" -ForegroundColor Red
}

# Development
echo $PROJECT_ID | vercel env add NEXT_PUBLIC_REOWN_PROJECT_ID development
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ Development: OK" -ForegroundColor Green
} else {
    Write-Host "   ❌ Development: Error" -ForegroundColor Red
}

Write-Host "`n✅ Variable corregida. Ahora necesitas:" -ForegroundColor Green
Write-Host "   1. Redesplegar la aplicación: vercel --prod" -ForegroundColor Yellow
Write-Host "   2. O esperar al próximo deployment automático" -ForegroundColor Yellow
Write-Host "`n💡 El código ahora limpia automáticamente los saltos de línea, pero es mejor tener la variable limpia en Vercel." -ForegroundColor Cyan

