'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { PRIZE_DISTRIBUTOR_ABI, PRIZE_DISTRIBUTOR_ADDRESS } from '@/lib/web3/contracts';

export function usePrizeDistributor(chainId: number) {
  const address = PRIZE_DISTRIBUTOR_ADDRESS[chainId];

  // Read total prizes distributed
  const { data: totalDistributed } = useReadContract({
    address,
    abi: PRIZE_DISTRIBUTOR_ABI,
    functionName: 'totalDistributed',
  });

  // Write: Distribute prizes
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const distributePrizes = (hackathonId: bigint, winners: Address[], amounts: bigint[]) => {
    writeContract({
      address,
      abi: PRIZE_DISTRIBUTOR_ABI,
      functionName: 'setPrizes',
      args: [hackathonId, winners, amounts],
    });
  };

  const claimPrize = (hackathonId: number) => {
    writeContract({
      address,
      abi: PRIZE_DISTRIBUTOR_ABI,
      functionName: 'claimPrize',
      args: [BigInt(hackathonId)],
    });
  };

  return {
    totalDistributed,
    distributePrizes,
    claimPrize,
    isConfirming,
    isSuccess,
    hash,
  };
}

