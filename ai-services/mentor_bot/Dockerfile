FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hacer el script ejecutable
RUN chmod +x start.sh

# Railway asignará el puerto dinámicamente
ENV PORT=8000
EXPOSE $PORT

# Usar el script de inicio que expande correctamente la variable PORT
CMD ["./start.sh"]

