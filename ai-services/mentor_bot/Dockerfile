FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente a través de la variable PORT
# EXPOSE no puede usar variables, pero Railway lo maneja automáticamente
EXPOSE 8000

# Usar la variable PORT de Railway, con fallback a 8000
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]

