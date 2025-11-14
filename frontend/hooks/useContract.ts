'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { Address } from 'viem';
import { PRIZE_DISTRIBUTOR_ABI, PRIZE_DISTRIBUTOR_ADDRESS } from '@/lib/web3/contracts';

export function usePrizeDistributor(chainId?: number) {
  const { chain } = useAccount();
  const activeChainId = chainId ?? chain?.id;
  const address = activeChainId ? PRIZE_DISTRIBUTOR_ADDRESS[activeChainId] : undefined;

  // Read total prizes distributed
  const { data: totalDistributed } = useReadContract({
    address,
    abi: PRIZE_DISTRIBUTOR_ABI,
    functionName: 'totalDistributed',
    query: {
      enabled: !!address,
    },
  });

  // Write: Distribute prizes
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const distributePrizes = (hackathonId: bigint, winners: Address[], amounts: bigint[]) => {
    if (!address) {
      console.error('PrizeDistributor address not found for chain:', activeChainId);
      return;
    }
    writeContract({
      address,
      abi: PRIZE_DISTRIBUTOR_ABI,
      functionName: 'setPrizes',
      args: [hackathonId, winners, amounts],
    });
  };

  const claimPrize = (hackathonId: number) => {
    if (!address) {
      console.error('PrizeDistributor address not found for chain:', activeChainId);
      return;
    }
    writeContract({
      address,
      abi: PRIZE_DISTRIBUTOR_ABI,
      functionName: 'claimPrize',
      args: [BigInt(hackathonId)],
    });
  };

  return {
    address,
    chainId: activeChainId,
    totalDistributed,
    distributePrizes,
    claimPrize,
    isConfirming,
    isSuccess,
    hash,
    isSupported: !!address,
  };
}

