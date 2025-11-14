# Integración On-Chain Completada

## ✅ Configuración Completada

### 1. Contratos Desplegados en Todas las Redes

#### Ethereum Sepolia (Chain ID: 11155111)
- **NFTCertificate**: `0x57691c8016bf1A1cA90224Ca346C3a17310B4846`
- **PrizeDistributor**: `0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD`

#### Base Sepolia (Chain ID: 84532)
- **NFTCertificate**: `0xA29b25d84F16a168528eD369032EF3a1351a44EF`
- **PrizeDistributor**: `0xf158BFBe755b2c2a4b4cB16f568a93298e16AE24`

#### Optimism Sepolia (Chain ID: 11155420)
- **NFTCertificate**: `0x51FBdDcD12704e4FCc28880E22b582362811cCdf`
- **PrizeDistributor**: `0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4`

#### Arbitrum Sepolia (Chain ID: 421614)
- **NFTCertificate**: `0x0D52B60838DDE96984563a1Da84E67a8aaA65DC8`
- **PrizeDistributor**: `0xeC0875Ed411Fce21a5B2205a5114feA468b6dF4B`

### 2. Configuración de Redes

✅ **Todas las redes soportadas** agregadas a:
- `frontend/lib/constants.ts` - SUPPORTED_CHAINS
- `frontend/config/web3.tsx` - networks array

### 3. Direcciones de Contratos Actualizadas

✅ **frontend/lib/web3/contracts.ts**:
- Direcciones de todas las redes configuradas (Ethereum Sepolia, Base Sepolia, Optimism Sepolia, Arbitrum Sepolia)
- ABIs completos de ambos contratos actualizados
- Todas las funciones disponibles en los ABIs

### 4. Hooks Creados/Actualizados

✅ **frontend/hooks/useContract.ts**:
- `usePrizeDistributor(chainId?)` - Hook mejorado con detección automática de chainId
- Funciones: `distributePrizes`, `claimPrize`, `totalDistributed`
- Retorna: `address`, `chainId`, `isSupported`, `totalDistributed`, `distributePrizes`, `claimPrize`, `isConfirming`, `isSuccess`, `hash`
- **Mejora**: Si no se proporciona `chainId`, usa automáticamente el chainId de la wallet conectada

✅ **frontend/hooks/useNFTCertificate.ts**:
- `useNFTCertificate(chainId?)` - Hook completo para NFT Certificate con detección automática de chainId
- Funciones:
  - `mintCertificate` - Mint certificado individual
  - `mintBadge` - Mint badge con rarity
  - `batchMint` - Mint en batch
  - `getUserCertificates` - Obtener certificados de usuario
  - `getCertificate` - Obtener detalles de certificado
  - `certificateCount` - Contador de certificados
- Retorna: `address`, `chainId`, `isSupported`, y todas las funciones de minting/reading
- **Mejora**: Si no se proporciona `chainId`, usa automáticamente el chainId de la wallet conectada

## 📋 Funcionalidades On-Chain Disponibles

### PrizeDistributor

```typescript
import { usePrizeDistributor } from '@/hooks/useContract';

// Opción 1: Usar chainId automático de la wallet conectada
const { 
  address, 
  chainId, 
  isSupported,
  distributePrizes, 
  claimPrize, 
  totalDistributed 
} = usePrizeDistributor();

// Opción 2: Especificar chainId manualmente
const prizeDistributor = usePrizeDistributor(11155111); // Ethereum Sepolia

// Verificar si la red está soportada
if (!prizeDistributor.isSupported) {
  console.error('Red no soportada:', prizeDistributor.chainId);
}

// Distribuir premios
prizeDistributor.distributePrizes(
  BigInt(hackathonId),
  [winner1, winner2],
  [amount1, amount2]
);

// Reclamar premio
prizeDistributor.claimPrize(hackathonId);
```

### NFTCertificate

```typescript
import { useNFTCertificate } from '@/hooks/useNFTCertificate';

// Opción 1: Usar chainId automático de la wallet conectada
const { 
  address,
  chainId,
  isSupported,
  mintCertificate, 
  mintBadge, 
  batchMint,
  getUserCertificates,
  certificateCount 
} = useNFTCertificate();

// Opción 2: Especificar chainId manualmente
const nftCertificate = useNFTCertificate(84532); // Base Sepolia

// Verificar si la red está soportada
if (!nftCertificate.isSupported) {
  console.error('Red no soportada:', nftCertificate.chainId);
}

// Mint certificado
nftCertificate.mintCertificate(
  recipientAddress,
  BigInt(hackathonId),
  "Hackathon Name",
  "Participant"
);

// Mint badge
nftCertificate.mintBadge(
  recipientAddress,
  BigInt(hackathonId),
  "Hackathon Name",
  "First Place",
  "LEGENDARY"
);

// Batch mint
nftCertificate.batchMint(
  [address1, address2, address3],
  BigInt(hackathonId),
  "Hackathon Name",
  "Participant"
);
```

## 🔗 Enlaces Útiles

### Ethereum Sepolia
- **Etherscan**: https://sepolia.etherscan.io
- **NFTCertificate**: https://sepolia.etherscan.io/address/0x57691c8016bf1A1cA90224Ca346C3a17310B4846
- **PrizeDistributor**: https://sepolia.etherscan.io/address/0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD

### Base Sepolia
- **Basescan**: https://sepolia.basescan.org
- **NFTCertificate**: https://sepolia.basescan.org/address/0xA29b25d84F16a168528eD369032EF3a1351a44EF
- **PrizeDistributor**: https://sepolia.basescan.org/address/0xf158BFBe755b2c2a4b4cB16f568a93298e16AE24

### Optimism Sepolia
- **Optimistic Etherscan**: https://sepolia-optimism.etherscan.io
- **NFTCertificate**: https://sepolia-optimism.etherscan.io/address/0x51FBdDcD12704e4FCc28880E22b582362811cCdf
- **PrizeDistributor**: https://sepolia-optimism.etherscan.io/address/0x77Ee7016BB2A3D4470a063DD60746334c6aD84A4

### Arbitrum Sepolia
- **Arbiscan**: https://sepolia.arbiscan.io
- **NFTCertificate**: https://sepolia.arbiscan.io/address/0x0D52B60838DDE96984563a1Da84E67a8aaA65DC8
- **PrizeDistributor**: https://sepolia.arbiscan.io/address/0xeC0875Ed411Fce21a5B2205a5114feA468b6dF4B

## 🚀 Próximos Pasos

1. **Usar en componentes**: Importar y usar los hooks en componentes que necesiten funcionalidad on-chain
2. **Agregar UI**: Crear componentes de UI para minting, claiming, etc.
3. **Manejo de errores**: Agregar manejo de errores y mensajes de usuario
4. **Loading states**: Mostrar estados de carga durante transacciones
5. **Eventos**: Escuchar eventos de los contratos para actualizaciones en tiempo real

## 📝 Notas

- Los contratos están desplegados en **4 redes de testnet** (Ethereum Sepolia, Base Sepolia, Optimism Sepolia, Arbitrum Sepolia)
- Los roles están configurados (MINTER_ROLE, ORGANIZER_ROLE, JUDGE_ROLE)
- Los ABIs están completos y actualizados
- Los hooks están listos para usar en componentes React
- Los hooks detectan automáticamente el chainId de la wallet conectada si no se especifica uno

## ⚠️ Importante

- Los hooks detectan automáticamente la red conectada, pero puedes especificar un chainId manualmente
- Verifica que la wallet tenga suficiente ETH/tokens nativos para gas en la red correspondiente
- Los contratos son Soulbound (no transferibles) - EIP-5192
- Los premios se distribuyen en tokens ERC20 (necesitas aprobar primero)
- Usa `isSupported` para verificar si la red actual tiene contratos desplegados
- Todas las redes soportadas están configuradas en `frontend/lib/constants.ts` y `frontend/config/web3.tsx`

## 🎯 Características Mejoradas

- ✅ Detección automática de chainId desde la wallet conectada
- ✅ Validación de red soportada con `isSupported`
- ✅ Manejo de errores mejorado con mensajes descriptivos
- ✅ Soporte para todas las redes L2 (Base, Optimism, Arbitrum)
- ✅ Hooks optimizados con validaciones de dirección

