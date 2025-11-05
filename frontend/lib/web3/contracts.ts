export const PRIZE_DISTRIBUTOR_ADDRESS: Record<number, `0x${string}`> = {
  // Arbitrum Sepolia
  421614: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Base Sepolia
  84532: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Optimism Sepolia
  11155420: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
};

export const NFT_CERTIFICATE_ADDRESS: Record<number, `0x${string}`> = {
  421614: '0x0000000000000000000000000000000000000000',
  84532: '0x0000000000000000000000000000000000000000',
  11155420: '0x0000000000000000000000000000000000000000',
};

export const DAO_ADDRESS: Record<number, `0x${string}`> = {
  421614: '0x0000000000000000000000000000000000000000',
  84532: '0x0000000000000000000000000000000000000000',
  11155420: '0x0000000000000000000000000000000000000000',
};

// Prize Distributor ABI
export const PRIZE_DISTRIBUTOR_ABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_hackathonId', type: 'uint256' },
      { internalType: 'address[]', name: '_winners', type: 'address[]' },
      { internalType: 'uint256[]', name: '_amounts', type: 'uint256[]' },
    ],
    name: 'setPrizes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '_hackathonId', type: 'uint256' }],
    name: 'claimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'hackathons',
    outputs: [
      { internalType: 'uint256', name: 'totalPrizePool', type: 'uint256' },
      { internalType: 'bool', name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDistributed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// NFT Certificate ABI
export const NFT_CERTIFICATE_ABI = [
  {
    inputs: [
      { internalType: 'address', name: '_to', type: 'address' },
      { internalType: 'uint256', name: '_hackathonId', type: 'uint256' },
      { internalType: 'string', name: '_hackathonName', type: 'string' },
      { internalType: 'string', name: '_achievement', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_owner', type: 'address' }],
    name: 'getCertificates',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

