FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente
# Usamos shell form para que pueda expandir la variable de entorno
ENV PORT=8000
EXPOSE $PORT

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

