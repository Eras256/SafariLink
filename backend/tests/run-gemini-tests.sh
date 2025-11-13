#!/bin/bash
# Script para ejecutar tests de Gemini AI
# Asegura que el servicio esté corriendo antes de ejecutar los tests

set -e

SERVICE_URL="http://localhost:8000"
SERVICE_DIR="../../ai-services/mentor_bot"

echo "🧪 Tests de Integración - Gemini AI"
echo "===================================="
echo ""

# Verificar si el servicio está corriendo
echo "📡 Verificando si el servicio está corriendo..."
if curl -s --fail "$SERVICE_URL/health" > /dev/null 2>&1; then
    echo "✅ Servicio está corriendo en $SERVICE_URL"
else
    echo "❌ Servicio no está corriendo"
    echo ""
    echo "Iniciando servicio en segundo plano..."
    
    cd "$SERVICE_DIR"
    export GEMINI_API_KEY="${GEMINI_API_KEY:-your_gemini_api_key_here}"
    
    # Iniciar servicio en segundo plano
    uvicorn main:app --host 0.0.0.0 --port 8000 > /tmp/mentor_bot.log 2>&1 &
    SERVICE_PID=$!
    
    echo "Servicio iniciado con PID: $SERVICE_PID"
    echo "Esperando 5 segundos para que el servicio se inicie..."
    sleep 5
    
    # Verificar nuevamente
    if curl -s --fail "$SERVICE_URL/health" > /dev/null 2>&1; then
        echo "✅ Servicio iniciado correctamente"
    else
        echo "❌ Error: El servicio no pudo iniciarse"
        echo "Logs:"
        cat /tmp/mentor_bot.log
        kill $SERVICE_PID 2>/dev/null || true
        exit 1
    fi
fi

echo ""
echo "🚀 Ejecutando tests..."
echo ""

# Ejecutar tests
npm test -- tests/gemini-ai.test.ts

# Si se inició el servicio en este script, detenerlo
if [ ! -z "$SERVICE_PID" ]; then
    echo ""
    echo "🛑 Deteniendo servicio (PID: $SERVICE_PID)..."
    kill $SERVICE_PID 2>/dev/null || true
fi

echo ""
echo "✅ Tests completados"

