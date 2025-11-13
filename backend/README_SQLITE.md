# 🚀 Iniciar Backend con SQLite (Sin Docker)

Esta guía te permite iniciar el backend usando SQLite en lugar de PostgreSQL, sin necesidad de Docker.

## ✅ Ventajas

- ✅ No requiere Docker Desktop
- ✅ No requiere PostgreSQL instalado
- ✅ Base de datos embebida (archivo local)
- ✅ Inicio rápido y simple
- ✅ Perfecto para desarrollo

## 📋 Requisitos

- Node.js 20+
- npm instalado

## 🚀 Inicio Rápido

### Opción 1: Script Automático (Recomendado)

```powershell
cd backend
.\start-backend-sqlite.ps1
```

### Opción 2: Manual

```powershell
cd backend

# Configurar SQLite como base de datos
$env:DATABASE_URL = "file:./dev.db"

# Si no existe el schema SQLite, copiarlo
if (-not (Test-Path "prisma/schema.sqlite.prisma")) {
    Write-Host "Error: schema.sqlite.prisma no encontrado"
    exit 1
}

# Hacer backup del schema original
Copy-Item prisma/schema.prisma prisma/schema.prisma.backup -ErrorAction SilentlyContinue

# Usar schema SQLite
Copy-Item prisma/schema.sqlite.prisma prisma/schema.prisma -Force

# Generar cliente Prisma
npx prisma generate

# Crear base de datos y migraciones (solo la primera vez)
if (-not (Test-Path "dev.db")) {
    npx prisma migrate dev --name init
}

# Iniciar backend
npm run dev
```

## 🔄 Restaurar Schema PostgreSQL

Si necesitas volver a usar PostgreSQL:

```powershell
cd backend

# Restaurar schema original
if (Test-Path "prisma/schema.prisma.backup") {
    Copy-Item prisma/schema.prisma.backup prisma/schema.prisma -Force
    npx prisma generate
}
```

## 📁 Archivos

- `dev.db` - Base de datos SQLite (se crea automáticamente)
- `prisma/schema.sqlite.prisma` - Schema adaptado para SQLite
- `prisma/schema.prisma.backup` - Backup del schema PostgreSQL original

## ⚠️ Notas Importantes

1. **SQLite vs PostgreSQL**: SQLite es perfecto para desarrollo, pero PostgreSQL es mejor para producción.

2. **Tipos de Datos**: Algunos tipos de PostgreSQL (como `Decimal`, arrays `String[]`, `Json`) se convierten a tipos compatibles con SQLite (strings, JSON como texto).

3. **Redis**: El backend puede funcionar sin Redis para desarrollo básico. Si necesitas Redis, puedes usar Docker solo para Redis:
   ```powershell
   docker-compose up -d redis
   ```

4. **Migraciones**: Las migraciones se ejecutan automáticamente la primera vez. Para migraciones adicionales:
   ```powershell
   npx prisma migrate dev
   ```

## 🐛 Solución de Problemas

### Error: "Cannot find module '@prisma/client'"
```powershell
npm install
npx prisma generate
```

### Error: "Database file is locked"
- Cierra otras conexiones a la base de datos
- Reinicia el backend

### Error: "Migration failed"
```powershell
# Eliminar base de datos y empezar de nuevo
Remove-Item dev.db -ErrorAction SilentlyContinue
npx prisma migrate dev --name init
```

## 📊 Ver Base de Datos

Para ver y editar la base de datos SQLite:

```powershell
npx prisma studio
```

Esto abrirá Prisma Studio en `http://localhost:5555`

## ✅ Verificar que Funciona

Una vez iniciado, verifica en otra terminal:

```powershell
curl http://localhost:4000/health
```

Deberías ver:
```json
{"status":"ok","timestamp":"..."}
```

---

**¿Problemas?** Revisa los logs en la terminal donde ejecutaste el backend.

