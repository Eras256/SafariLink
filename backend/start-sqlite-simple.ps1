# Script simplificado para iniciar backend con SQLite
# Detiene procesos anteriores y configura SQLite

Write-Host "🛑 Deteniendo procesos anteriores..." -ForegroundColor Yellow

# Detener procesos en puerto 4000
$connections = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if ($connections) {
    $connections | ForEach-Object {
        $process = Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue
        if ($process) {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
            Write-Host "   Proceso detenido: $($process.ProcessName) (PID: $($process.Id))" -ForegroundColor Gray
        }
    }
    Start-Sleep -Seconds 2
}

# Detener procesos Node relacionados
Get-Process | Where-Object {
    $_.ProcessName -eq "node" -and 
    $_.Path -like "*SafariLink*backend*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

Write-Host "✅ Procesos detenidos" -ForegroundColor Green
Write-Host ""

# Cambiar al directorio backend
Set-Location $PSScriptRoot

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json" -ForegroundColor Red
    Write-Host "   Ejecuta este script desde: backend" -ForegroundColor Yellow
    exit 1
}

# Configurar SQLite
Write-Host "📋 Configurando SQLite..." -ForegroundColor Cyan

$sqliteSchema = "prisma/schema.sqlite.prisma"
$originalSchema = "prisma/schema.prisma"

if (-not (Test-Path $sqliteSchema)) {
    Write-Host "❌ Error: $sqliteSchema no encontrado" -ForegroundColor Red
    exit 1
}

# Hacer backup del schema original
if (-not (Test-Path "$originalSchema.backup")) {
    Copy-Item $originalSchema "$originalSchema.backup" -ErrorAction SilentlyContinue
    Write-Host "   Backup del schema PostgreSQL creado" -ForegroundColor Gray
}

# Copiar schema SQLite
Copy-Item $sqliteSchema $originalSchema -Force
Write-Host "✅ Schema SQLite configurado" -ForegroundColor Green

# Configurar DATABASE_URL
$dbPath = Join-Path $PSScriptRoot "dev.db"
$env:DATABASE_URL = "file:$dbPath"
Write-Host "📁 Base de datos: $dbPath" -ForegroundColor Cyan

# Generar cliente Prisma
Write-Host "🔧 Generando cliente Prisma..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Error al generar cliente Prisma, intentando de nuevo..." -ForegroundColor Yellow
    Start-Sleep -Seconds 2
    npx prisma generate
}

# Crear base de datos si no existe
if (-not (Test-Path $dbPath)) {
    Write-Host "📦 Creando base de datos SQLite..." -ForegroundColor Yellow
    npx prisma migrate dev --name init --skip-seed
    Write-Host "✅ Base de datos creada" -ForegroundColor Green
} else {
    Write-Host "✅ Base de datos ya existe" -ForegroundColor Green
}

# Configurar otras variables de entorno
if (-not $env:JWT_SECRET) {
    $env:JWT_SECRET = "temporary-secret-key-min-32-characters-long-for-development-only"
}

$env:REDIS_URL = "redis://localhost:6379"  # Opcional

Write-Host ""
Write-Host "🚀 Iniciando backend..." -ForegroundColor Green
Write-Host ""
Write-Host "Backend disponible en:" -ForegroundColor Cyan
Write-Host "  - API: http://localhost:4000/api" -ForegroundColor White
Write-Host "  - Health: http://localhost:4000/health" -ForegroundColor White
Write-Host ""
Write-Host "Base de datos: SQLite ($dbPath)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

# Iniciar backend
npm run dev

