# SafariLink Platform - Installation Guide

## Requisitos Previos

- Node.js 20+ ([Descargar](https://nodejs.org/))
- Docker y Docker Compose ([Instalar Docker](https://www.docker.com/get-started))
- PostgreSQL 16+ (o usar Docker)
- Redis 7+ (o usar Docker)
- Foundry ([Instalar Foundry](https://book.getfoundry.io/getting-started/installation))
- Python 3.11+ (para servicios AI)

## Instalación Paso a Paso

### 1. Clonar el Repositorio

```bash
git clone https://github.com/safarilink/platform.git
cd SafariLink
```

### 2. Configurar Variables de Entorno

#### Frontend

```bash
cd frontend
cp .env.example .env.local
```

Editar `.env.local` y agregar:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_REOWN_PROJECT_ID=tu_project_id_de_reown
NEXT_PUBLIC_MIXPANEL_TOKEN=tu_mixpanel_token
```

#### Backend

```bash
cd ../backend
cp .env.example .env
```

Editar `.env` y agregar:
```env
DATABASE_URL=postgresql://safarilink:password@localhost:5432/safarilink
REDIS_URL=redis://localhost:6379
JWT_SECRET=tu_jwt_secret_min_32_caracteres
ANTHROPIC_API_KEY=tu_anthropic_api_key
SMILE_ID_API_KEY=tu_smile_id_api_key
GITHUB_TOKEN=tu_github_token
```

#### Smart Contracts

```bash
cd ../contracts
cp .env.example .env
```

Editar `.env` y agregar:
```env
PRIVATE_KEY=tu_private_key_del_deployer
ARBISCAN_API_KEY=tu_arbiscan_key
```

### 3. Instalar Dependencias

#### Frontend

```bash
cd frontend
npm install
```

#### Backend

```bash
cd ../backend
npm install
```

#### Smart Contracts

```bash
cd ../contracts
forge install
```

#### AI Services

```bash
cd ../ai-services/team_matcher
pip install -r requirements.txt

cd ../plagiarism_detector
pip install -r requirements.txt

cd ../mentor_bot
pip install -r requirements.txt
```

### 4. Iniciar Base de Datos (Docker)

```bash
# Desde la raíz del proyecto
docker-compose up -d postgres redis
```

Esperar a que los servicios estén listos (30-60 segundos).

### 5. Ejecutar Migraciones de Base de Datos

```bash
cd backend
npm run migrate
```

### 6. Iniciar Servicios

#### Opción A: Docker Compose (Recomendado)

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

Esto iniciará todos los servicios:
- PostgreSQL (puerto 5432)
- Redis (puerto 6379)
- Backend API (puerto 4000)
- Frontend (puerto 3000)
- AI Services (puertos 8001-8003)

#### Opción B: Desarrollo Local

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - AI Services:**
```bash
# Team Matcher
cd ai-services/team_matcher
uvicorn main:app --host 0.0.0.0 --port 8001

# Plagiarism Detector (en otra terminal)
cd ai-services/plagiarism_detector
uvicorn main:app --host 0.0.0.0 --port 8002

# Mentor Bot (en otra terminal)
cd ai-services/mentor_bot
uvicorn main:app --host 0.0.0.0 --port 8003
```

### 7. Desplegar Smart Contracts (Opcional para Desarrollo)

```bash
cd contracts
forge script script/Deploy.s.sol:DeployScript --rpc-url $ARBITRUM_SEPOLIA_RPC --broadcast --verify
```

Actualizar las direcciones de contratos en `frontend/lib/web3/contracts.ts`.

## Verificar Instalación

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:4000/health
3. **Team Matcher**: http://localhost:8001/health
4. **Plagiarism Detector**: http://localhost:8002/health
5. **Mentor Bot**: http://localhost:8003/health

## Solución de Problemas

### Error: "Cannot connect to database"
- Verificar que PostgreSQL esté corriendo
- Verificar `DATABASE_URL` en `.env`
- Ejecutar `docker-compose up -d postgres`

### Error: "Port already in use"
- Cambiar puertos en `.env` o `docker-compose.yml`
- Matar procesos que usen los puertos: `lsof -ti:3000 | xargs kill`

### Error: "Module not found"
- Ejecutar `npm install` o `pip install -r requirements.txt`
- Limpiar cache: `rm -rf node_modules package-lock.json && npm install`

### Error: "Prisma client not generated"
```bash
cd backend
npx prisma generate
```

## Próximos Pasos

1. Configurar Reown AppKit Project ID
2. Obtener API keys necesarias
3. Desplegar smart contracts a testnets
4. Configurar dominio y SSL para producción
5. Revisar [DEPLOYMENT.md](./docs/DEPLOYMENT.md) para deployment a producción

## Soporte

Para problemas o preguntas:
- Abrir issue en GitHub
- Consultar documentación en `docs/`
- Contactar: support@safarilink.xyz

