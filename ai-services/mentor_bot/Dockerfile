FROM python:3.11-slim

WORKDIR /app

# Instalar bash para asegurar que el script funcione
RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Hacer el script ejecutable
RUN chmod +x start.sh

# Railway asignará el puerto dinámicamente
ENV PORT=8000
EXPOSE 8000

# Usar el script que maneja correctamente la variable PORT
CMD ["./start.sh"]

