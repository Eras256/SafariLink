'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { NFT_CERTIFICATE_ABI, NFT_CERTIFICATE_ADDRESS } from '@/lib/web3/contracts';

export function useNFTCertificate(chainId: number) {
  const address = NFT_CERTIFICATE_ADDRESS[chainId];

  // Read: Get certificate count for user
  const { data: certificateCount, refetch: refetchCount } = useReadContract({
    address,
    abi: NFT_CERTIFICATE_ABI,
    functionName: 'getCertificateCount',
    query: {
      enabled: !!address,
    },
  });

  // Read: Get all certificates for user
  const getUserCertificates = (userAddress: Address) => {
    return useReadContract({
      address,
      abi: NFT_CERTIFICATE_ABI,
      functionName: 'getCertificates',
      args: [userAddress],
      query: {
        enabled: !!address && !!userAddress,
      },
    });
  };

  // Read: Get certificate details
  const getCertificate = (tokenId: bigint) => {
    return useReadContract({
      address,
      abi: NFT_CERTIFICATE_ABI,
      functionName: 'getCertificate',
      args: [tokenId],
      query: {
        enabled: !!address && !!tokenId,
      },
    });
  };

  // Write: Mint certificate
  const { writeContract: writeMint, data: mintHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isConfirmingMint, isSuccess: isMintSuccess } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  const mintCertificate = (
    to: Address,
    hackathonId: bigint,
    hackathonName: string,
    achievement: string
  ) => {
    if (!address) return;
    writeMint({
      address,
      abi: NFT_CERTIFICATE_ABI,
      functionName: 'mint',
      args: [to, hackathonId, hackathonName, achievement],
    });
  };

  // Write: Mint badge
  const { writeContract: writeMintBadge, data: badgeHash, isPending: isMintingBadge } = useWriteContract();
  const { isLoading: isConfirmingBadge, isSuccess: isBadgeSuccess } = useWaitForTransactionReceipt({
    hash: badgeHash,
  });

  const mintBadge = (
    to: Address,
    hackathonId: bigint,
    hackathonName: string,
    badgeName: string,
    rarity: string
  ) => {
    if (!address) return;
    writeMintBadge({
      address,
      abi: NFT_CERTIFICATE_ABI,
      functionName: 'mintBadge',
      args: [to, hackathonId, hackathonName, badgeName, rarity],
    });
  };

  // Write: Batch mint
  const { writeContract: writeBatchMint, data: batchHash, isPending: isBatchMinting } = useWriteContract();
  const { isLoading: isConfirmingBatch, isSuccess: isBatchSuccess } = useWaitForTransactionReceipt({
    hash: batchHash,
  });

  const batchMint = (
    recipients: Address[],
    hackathonId: bigint,
    hackathonName: string,
    achievement: string
  ) => {
    if (!address) return;
    writeBatchMint({
      address,
      abi: NFT_CERTIFICATE_ABI,
      functionName: 'batchMint',
      args: [recipients, hackathonId, hackathonName, achievement],
    });
  };

  return {
    address,
    certificateCount,
    refetchCount,
    getUserCertificates,
    getCertificate,
    mintCertificate,
    mintBadge,
    batchMint,
    isMinting: isMinting || isConfirmingMint,
    isMintSuccess,
    mintHash,
    isMintingBadge: isMintingBadge || isConfirmingBadge,
    isBadgeSuccess,
    badgeHash,
    isBatchMinting: isBatchMinting || isConfirmingBatch,
    isBatchSuccess,
    batchHash,
  };
}

