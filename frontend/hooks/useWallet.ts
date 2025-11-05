'use client';

import { useAccount, useDisconnect, useConnect } from 'wagmi';

export function useWallet() {
  const { address, isConnected, chain } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  return {
    address,
    isConnected,
    chain,
    disconnect,
    connect,
    connectors,
  };
}

