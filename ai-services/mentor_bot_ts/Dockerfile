FROM node:18-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar todas las dependencias (necesitamos devDependencies para compilar)
RUN npm ci

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Exponer puerto
EXPOSE 8000

# Usar la variable PORT de Railway, con fallback a 8000
CMD ["sh", "-c", "node dist/app.js"]

