# Integración On-Chain Completada

## ✅ Configuración Completada

### 1. Contratos Desplegados en Ethereum Sepolia

- **NFTCertificate**: `0x57691c8016bf1A1cA90224Ca346C3a17310B4846`
- **PrizeDistributor**: `0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD`

### 2. Configuración de Redes

✅ **Ethereum Sepolia** agregado a:
- `frontend/lib/constants.ts` - SUPPORTED_CHAINS
- `frontend/config/web3.tsx` - networks array

### 3. Direcciones de Contratos Actualizadas

✅ **frontend/lib/web3/contracts.ts**:
- Direcciones de Ethereum Sepolia (11155111) configuradas
- ABIs completos de ambos contratos actualizados
- Todas las funciones disponibles en los ABIs

### 4. Hooks Creados/Actualizados

✅ **frontend/hooks/useContract.ts**:
- `usePrizeDistributor` - Actualizado con hackathonId correcto
- Funciones: `distributePrizes`, `claimPrize`, `totalDistributed`

✅ **frontend/hooks/useNFTCertificate.ts** (NUEVO):
- `useNFTCertificate` - Hook completo para NFT Certificate
- Funciones:
  - `mintCertificate` - Mint certificado individual
  - `mintBadge` - Mint badge con rarity
  - `batchMint` - Mint en batch
  - `getUserCertificates` - Obtener certificados de usuario
  - `getCertificate` - Obtener detalles de certificado
  - `certificateCount` - Contador de certificados

## 📋 Funcionalidades On-Chain Disponibles

### PrizeDistributor

```typescript
import { usePrizeDistributor } from '@/hooks/useContract';

const { distributePrizes, claimPrize, totalDistributed } = usePrizeDistributor(11155111);

// Distribuir premios
distributePrizes(
  BigInt(hackathonId),
  [winner1, winner2],
  [amount1, amount2]
);

// Reclamar premio
claimPrize(hackathonId);
```

### NFTCertificate

```typescript
import { useNFTCertificate } from '@/hooks/useNFTCertificate';

const { 
  mintCertificate, 
  mintBadge, 
  batchMint,
  getUserCertificates,
  certificateCount 
} = useNFTCertificate(11155111);

// Mint certificado
mintCertificate(
  recipientAddress,
  BigInt(hackathonId),
  "Hackathon Name",
  "Participant"
);

// Mint badge
mintBadge(
  recipientAddress,
  BigInt(hackathonId),
  "Hackathon Name",
  "First Place",
  "LEGENDARY"
);
```

## 🔗 Enlaces Útiles

- **Etherscan Sepolia**: https://sepolia.etherscan.io
- **NFTCertificate**: https://sepolia.etherscan.io/address/0x57691c8016bf1A1cA90224Ca346C3a17310B4846
- **PrizeDistributor**: https://sepolia.etherscan.io/address/0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD

## 🚀 Próximos Pasos

1. **Usar en componentes**: Importar y usar los hooks en componentes que necesiten funcionalidad on-chain
2. **Agregar UI**: Crear componentes de UI para minting, claiming, etc.
3. **Manejo de errores**: Agregar manejo de errores y mensajes de usuario
4. **Loading states**: Mostrar estados de carga durante transacciones
5. **Eventos**: Escuchar eventos de los contratos para actualizaciones en tiempo real

## 📝 Notas

- Los contratos están desplegados y verificados en Ethereum Sepolia
- Los roles están configurados (MINTER_ROLE, ORGANIZER_ROLE, JUDGE_ROLE)
- Los ABIs están completos y actualizados
- Los hooks están listos para usar en componentes React

## ⚠️ Importante

- Asegúrate de que el usuario esté conectado a la red correcta (Ethereum Sepolia)
- Verifica que la wallet tenga suficiente ETH para gas
- Los contratos son Soulbound (no transferibles) - EIP-5192
- Los premios se distribuyen en tokens ERC20 (necesitas aprobar primero)

