FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente
# Usar puerto fijo 8000 ya que Railway lo mapea correctamente
EXPOSE 8000

# Usar puerto fijo 8000 - Railway mapea automáticamente el puerto público al 8000
CMD uvicorn main:app --host 0.0.0.0 --port 8000

