# 🚀 Iniciar Backend - Guía Rápida

## ⚠️ Error: "ERR_CONNECTION_REFUSED" en puerto 4000

Si ves este error, el backend no está corriendo. Sigue estos pasos:

## 📋 Pasos Rápidos

### 1. Abrir Terminal

Abre PowerShell o CMD en el proyecto.

### 2. Navegar al Directorio

```powershell
cd backend
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` o configura las variables:

```powershell
# Variables mínimas necesarias
$env:DATABASE_URL="postgresql://safarilink:safarilink123@localhost:5432/safarilink"
$env:REDIS_URL="redis://localhost:6379"
$env:JWT_SECRET="tu_jwt_secret_min_32_caracteres_aqui"
```

### 4. Iniciar el Backend

```powershell
npm run dev
```

### 5. Verificar

En otra terminal, prueba:
```powershell
curl http://localhost:4000/health
```

## 🎯 Comandos Útiles

### Iniciar Backend
```powershell
cd backend
npm run dev
```

### Verificar Estado
```powershell
curl http://localhost:4000/health
```

### Detener Backend
Presiona `Ctrl+C` en la terminal donde está corriendo.

## 🔧 Problemas Comunes

### Puerto 4000 ocupado
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :4000
# Detener proceso (reemplaza PID)
taskkill /PID <PID> /F
```

### Error de base de datos
Asegúrate de que PostgreSQL esté corriendo:
```powershell
# Con Docker
docker-compose up postgres
```

### Dependencias faltantes
```powershell
cd backend
npm install
```

## 📍 Ubicación del Backend

El backend está en: `backend/`

## ✅ Estado Actual

El backend debería estar corriendo en `http://localhost:4000`

---

**¿Necesitas ayuda?** Revisa `backend/README.md` o `docs/INSTALLATION.md`

