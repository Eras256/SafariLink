# SafariLink Smart Contracts

Contratos inteligentes optimizados para la plataforma SafariLink, desarrollados con Hardhat y siguiendo las mejores prácticas de seguridad y optimización de gas de 2025.

## 📋 Contratos

### NFTCertificate.sol
Contrato de tokens Soulbound (SBT) que implementa EIP-5192 para certificados y badges de hackathons no transferibles.

**Características:**
- ✅ Implementación EIP-5192 (Soulbound Tokens)
- ✅ Optimización de gas (eliminación de Counters, uso de uint256 directo)
- ✅ Batch minting para eficiencia
- ✅ Pausa de emergencia
- ✅ Access Control con roles
- ✅ Protección contra reentrancy

### PrizeDistributor.sol
Contrato seguro para distribución de premios en hackathons.

**Características:**
- ✅ Distribución segura de premios
- ✅ Control de acceso granular (Organizer, Judge)
- ✅ Protección contra reentrancy
- ✅ Batch distribution optimizado
- ✅ Pausa de emergencia
- ✅ Custom errors para optimización de gas

## 🚀 Instalación

```bash
npm install
```

## 🔧 Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno:
```env
PRIVATE_KEY=tu_private_key_sin_0x
ARBITRUM_SEPOLIA_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
OPTIMISM_SEPOLIA_RPC_URL=https://sepolia.optimism.io
ARBISCAN_API_KEY=tu_api_key
BASESCAN_API_KEY=tu_api_key
OPTIMISTIC_ETHERSCAN_API_KEY=tu_api_key
```

## 📝 Scripts Disponibles

### Compilar
```bash
npm run compile
```

### Tests
```bash
# Ejecutar todos los tests
npm run test

# Ejecutar con coverage
npm run test:coverage
```

### Desplegar
```bash
# Red local
npm run deploy:local

# Arbitrum Sepolia
npm run deploy:arbitrum-sepolia

# Base Sepolia
npm run deploy:base-sepolia

# Optimism Sepolia
npm run deploy:optimism-sepolia
```

### Configurar Roles
```bash
# Después del despliegue, configurar roles
npx hardhat run scripts/setup-roles.ts --network <network>
```

### Verificar Contratos
```bash
npx hardhat verify --network <network> <contract_address> <constructor_args>
```

## 🧪 Testing

Los tests están escritos en TypeScript usando Hardhat y Chai. Cubren:

- ✅ Deployment y configuración inicial
- ✅ Funcionalidad de minting (individual y batch)
- ✅ Soulbound token behavior (EIP-5192)
- ✅ Access control y permisos
- ✅ Pausa y emergencias
- ✅ Optimización de gas
- ✅ Edge cases y errores

## 📊 Optimizaciones Implementadas

### Gas Optimization
- ✅ Uso de `unchecked` en loops incrementales
- ✅ Custom errors en lugar de strings
- ✅ Packing de structs donde es posible
- ✅ Eliminación de Counters (deprecated)
- ✅ Batch operations para reducir costos

### Seguridad
- ✅ ReentrancyGuard en funciones críticas
- ✅ AccessControl con roles granulares
- ✅ Pausable para emergencias
- ✅ Validación exhaustiva de inputs
- ✅ Checks-Effects-Interactions pattern

### Estándares
- ✅ EIP-5192 (Soulbound Tokens)
- ✅ ERC-721 estándar
- ✅ OpenZeppelin Contracts 5.0

## 📁 Estructura del Proyecto

```
contracts/
├── contracts/          # Contratos fuente
│   ├── NFTCertificate.sol
│   ├── PrizeDistributor.sol
│   └── mocks/          # Contratos mock para testing
├── test/               # Tests
│   ├── NFTCertificate.test.ts
│   └── PrizeDistributor.test.ts
├── scripts/            # Scripts de despliegue
│   ├── deploy.ts
│   └── setup-roles.ts
├── deployments/        # Direcciones de contratos desplegados
├── hardhat.config.ts   # Configuración de Hardhat
└── package.json
```

## 🔐 Seguridad

Antes de desplegar a mainnet:

1. ✅ Ejecutar todos los tests
2. ✅ Revisar con Slither: `slither .`
3. ✅ Auditar con Mythril
4. ✅ Considerar auditoría profesional
5. ✅ Verificar en testnets primero

## 📚 Documentación

- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/5.x/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [EIP-5192: Minimal Soulbound NFT](https://eips.ethereum.org/EIPS/eip-5192)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License

