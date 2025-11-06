#!/bin/bash
# Script de inicio para Railway
# Railway inyecta la variable PORT automáticamente

PORT=${PORT:-8000}

echo "Starting uvicorn on port $PORT"

exec uvicorn main:app --host 0.0.0.0 --port $PORT

