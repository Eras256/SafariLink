// Contract addresses by chain ID
export const PRIZE_DISTRIBUTOR_ADDRESS: Record<number, `0x${string}`> = {
  // Ethereum Sepolia
  11155111: '0x1E149bD2340C7360bFcF9c3EC7E8cC5e194db5fD',
  // Arbitrum Sepolia
  421614: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Base Sepolia
  84532: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
  // Optimism Sepolia
  11155420: '0x0000000000000000000000000000000000000000', // TODO: Deploy and update
};

export const NFT_CERTIFICATE_ADDRESS: Record<number, `0x${string}`> = {
  // Ethereum Sepolia
  11155111: '0x57691c8016bf1A1cA90224Ca346C3a17310B4846',
  // Arbitrum Sepolia
  421614: '0x0000000000000000000000000000000000000000',
  // Base Sepolia
  84532: '0x0000000000000000000000000000000000000000',
  // Optimism Sepolia
  11155420: '0x0000000000000000000000000000000000000000',
};

export const DAO_ADDRESS: Record<number, `0x${string}`> = {
  11155111: '0x0000000000000000000000000000000000000000',
  421614: '0x0000000000000000000000000000000000000000',
  84532: '0x0000000000000000000000000000000000000000',
  11155420: '0x0000000000000000000000000000000000000000',
};

// Prize Distributor ABI (Complete)
export const PRIZE_DISTRIBUTOR_ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'AccessControlBadConfirmation',
    type: 'error',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'bytes32', name: 'neededRole', type: 'bytes32' },
    ],
    name: 'AccessControlUnauthorizedAccount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyClaimed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ArrayLengthMismatch',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EnforcedPause',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExceedsPrizePool',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ExpectedPause',
    type: 'error',
  },
  {
    inputs: [],
    name: 'HackathonNotActive',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidHackathonId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPrizePool',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoPrizeAllocated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'token', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'EmergencyWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'token', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'prizePool', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'organizer', type: 'address' },
    ],
    name: 'HackathonCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' }],
    name: 'HackathonDeactivated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'address', name: 'account', type: 'address' }],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'winner', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'PrizeClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { indexed: false, internalType: 'address[]', name: 'winners', type: 'address[]' },
      { indexed: false, internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'PrizesSet',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'address[]', name: 'winners', type: 'address[]' },
    ],
    name: 'batchDistribute',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'address', name: 'winner', type: 'address' },
    ],
    name: 'canClaim',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'hackathonId', type: 'uint256' }],
    name: 'claimPrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'prizePool', type: 'uint256' },
    ],
    name: 'createHackathon',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'hackathonId', type: 'uint256' }],
    name: 'deactivateHackathon',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
    ],
    name: 'getHackathonInfo',
    outputs: [
      { internalType: 'uint256', name: 'totalPrizePool', type: 'uint256' },
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'uint256', name: 'totalAllocated', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'address', name: 'winner', type: 'address' },
    ],
    name: 'getPrizeAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'hackathonCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'hackathons',
    outputs: [
      { internalType: 'uint256', name: 'totalPrizePool', type: 'uint256' },
      { internalType: 'contract IERC20', name: 'token', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
      { internalType: 'uint256', name: 'totalAllocated', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'address[]', name: 'winners', type: 'address[]' },
      { internalType: 'uint256[]', name: 'amounts', type: 'uint256[]' },
    ],
    name: 'setPrizes',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalDistributed',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'address', name: 'winner', type: 'address' },
      { internalType: 'uint256', name: 'newAmount', type: 'uint256' },
    ],
    name: 'updatePrize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// NFT Certificate ABI (Complete)
export const NFT_CERTIFICATE_ABI = [
  {
    inputs: [{ internalType: 'string', name: 'baseURI_', type: 'string' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'SoulboundToken',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTokenId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ArrayLengthMismatch',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'achievement', type: 'string' },
    ],
    name: 'CertificateMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
      { indexed: true, internalType: 'address', name: 'recipient', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { indexed: false, internalType: 'string', name: 'badgeName', type: 'string' },
      { indexed: false, internalType: 'string', name: 'rarity', type: 'string' },
    ],
    name: 'BadgeMinted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'Locked',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'string', name: 'hackathonName', type: 'string' },
      { internalType: 'string', name: 'achievement', type: 'string' },
    ],
    name: 'mint',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'string', name: 'hackathonName', type: 'string' },
      { internalType: 'string', name: 'badgeName', type: 'string' },
      { internalType: 'string', name: 'rarity', type: 'string' },
    ],
    name: 'mintBadge',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'recipients', type: 'address[]' },
      { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
      { internalType: 'string', name: 'hackathonName', type: 'string' },
      { internalType: 'string', name: 'achievement', type: 'string' },
    ],
    name: 'batchMint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'getCertificates',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'string', name: 'rarity', type: 'string' },
    ],
    name: 'getBadges',
    outputs: [{ internalType: 'uint256[]', name: '', type: 'uint256[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'getCertificate',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'hackathonId', type: 'uint256' },
          { internalType: 'string', name: 'hackathonName', type: 'string' },
          { internalType: 'string', name: 'achievement', type: 'string' },
          { internalType: 'string', name: 'badgeType', type: 'string' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
        ],
        internalType: 'struct NFTCertificate.Certificate',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'getCertificateCount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'locked',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
