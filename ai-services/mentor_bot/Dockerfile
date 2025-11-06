FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway asignará el puerto dinámicamente
ENV PORT=8000
EXPOSE 8000

# Usar forma shell de CMD para expandir correctamente PORT
# Esta es la solución recomendada: forma shell simple sin exec form
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

