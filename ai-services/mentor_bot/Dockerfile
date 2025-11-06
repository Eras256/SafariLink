FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hacer el script ejecutable
RUN chmod +x start.sh

# Railway asignará el puerto dinámicamente
# Usar shell form para que expanda la variable PORT correctamente
ENV PORT=8000
EXPOSE 8000

# Usar shell form para que pueda expandir PORT
# Railway inyecta PORT como variable de entorno
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"

