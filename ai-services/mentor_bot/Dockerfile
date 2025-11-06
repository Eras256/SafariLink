FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente
EXPOSE 8000

# Usar puerto fijo - Railway lo mapea automáticamente cuando hay dominio público
# Si Railway intenta usar $PORT, este comando fallback evitará el error
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port 8000"]

