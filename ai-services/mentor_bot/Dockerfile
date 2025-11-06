FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente
# Usar exec form con /bin/sh -c para expandir correctamente PORT
ENV PORT=8000
EXPOSE 8000

# Solución recomendada por Railway: usar /bin/sh -c con exec form
# Esto garantiza que la variable PORT se expanda correctamente en tiempo de ejecución
CMD ["/bin/sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]

