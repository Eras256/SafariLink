@echo off
REM Script para iniciar el servicio Mentor Bot en Windows

echo 🚀 Iniciando SafariLink Mentor Bot...
echo.

REM Configurar API key
set GEMINI_API_KEY=your_gemini_api_key_here

REM Verificar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias...
    call npm install
)

REM Compilar si es necesario
if not exist "dist" (
    echo 🔨 Compilando TypeScript...
    call npm run build
)

echo ✅ Iniciando servidor en puerto 8000...
echo.
echo Servicio disponible en:
echo   - Health: http://localhost:8000/health
echo   - Test: http://localhost:8000/test-gemini
echo   - Ask: http://localhost:8000/ask
echo.
echo Presiona Ctrl+C para detener el servicio
echo.

REM Iniciar el servicio
call npm run dev

