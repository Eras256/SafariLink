# Script para iniciar el backend con SQLite (sin necesidad de Docker/PostgreSQL)

Write-Host "🚀 Iniciando SafariLink Backend con SQLite..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde: backend" -ForegroundColor Yellow
    exit 1
}

# Verificar que las dependencias estén instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
}

# Configurar SQLite como base de datos
$dbPath = Join-Path $PSScriptRoot "dev.db"
$databaseUrl = "file:$dbPath"

Write-Host "📁 Base de datos SQLite: $dbPath" -ForegroundColor Cyan

# Configurar variables de entorno para SQLite
$env:DATABASE_URL = $databaseUrl
$env:REDIS_URL = "redis://localhost:6379"  # Redis opcional, puede funcionar sin él

if (-not $env:JWT_SECRET) {
    Write-Host "⚠️  JWT_SECRET no está configurada" -ForegroundColor Yellow
    Write-Host "   Generando secreto temporal..." -ForegroundColor Yellow
    $env:JWT_SECRET = "temporary-secret-key-min-32-characters-long-for-development-only"
}

# Configurar schema de SQLite
Write-Host "📋 Configurando schema de SQLite..." -ForegroundColor Yellow

$sqliteSchema = Join-Path $PSScriptRoot "prisma" "schema.sqlite.prisma"
$originalSchema = Join-Path $PSScriptRoot "prisma" "schema.prisma"
$backupSchema = "$originalSchema.backup"

if (-not (Test-Path $sqliteSchema)) {
    Write-Host "❌ Error: schema.sqlite.prisma no encontrado" -ForegroundColor Red
    Write-Host "   Asegúrate de que el archivo existe en: prisma/schema.sqlite.prisma" -ForegroundColor Yellow
    exit 1
}

# Hacer backup del schema original solo si no existe
if (-not (Test-Path $backupSchema)) {
    Write-Host "   Haciendo backup del schema PostgreSQL original..." -ForegroundColor Yellow
    Copy-Item $originalSchema $backupSchema -ErrorAction SilentlyContinue
}

# Usar schema SQLite
Write-Host "   Usando schema SQLite..." -ForegroundColor Green
Copy-Item $sqliteSchema $originalSchema -Force

# Generar cliente Prisma
Write-Host "   Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

# Crear base de datos y ejecutar migraciones si no existe
if (-not (Test-Path $dbPath)) {
    Write-Host "   Creando base de datos y ejecutando migraciones..." -ForegroundColor Yellow
    npx prisma migrate dev --name init --skip-seed
    Write-Host "✅ Base de datos SQLite creada" -ForegroundColor Green
} else {
    Write-Host "✅ Base de datos SQLite ya existe" -ForegroundColor Green
}

# Verificar si el puerto está en uso
$portInUse = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "⚠️  Puerto 4000 está en uso" -ForegroundColor Yellow
    Write-Host "   Deteniendo proceso anterior..." -ForegroundColor Yellow
    $process = Get-Process -Id $portInUse.OwningProcess -ErrorAction SilentlyContinue
    if ($process) {
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

Write-Host ""
Write-Host "✅ Iniciando servidor en puerto 4000..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend disponible en:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:4000/api" -ForegroundColor White
Write-Host "  - Health: http://localhost:4000/health" -ForegroundColor White
Write-Host ""
Write-Host "Base de datos: SQLite ($dbPath)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener el servicio" -ForegroundColor Yellow
Write-Host ""

# Iniciar el backend
npm run dev

