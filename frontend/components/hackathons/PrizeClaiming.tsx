'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePrizeDistributor } from '@/hooks/useContract';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from 'viem';
import { formatUnits } from 'viem';

interface PrizeClaimingProps {
  hackathonId: string;
}

export function PrizeClaiming({ hackathonId }: PrizeClaimingProps) {
  const { address } = useAccount();
  const [canClaim, setCanClaim] = useState<boolean | null>(null);
  const [prizeAmount, setPrizeAmount] = useState<bigint | null>(null);
  const [hackathonInfo, setHackathonInfo] = useState<any>(null);
  const [checking, setChecking] = useState(true);

  const prizeDistributor = usePrizeDistributor();

  // Check if user can claim prize
  useEffect(() => {
    const checkPrizeStatus = async () => {
      if (!address || !hackathonId || !prizeDistributor.address) {
        setChecking(false);
        return;
      }

      try {
        // Read hackathon info
        const { config } = await import('@/config/web3');
        const { PRIZE_DISTRIBUTOR_ABI } = await import('@/lib/web3/contracts');
        const publicClient = config.getPublicClient();

        if (!publicClient || !prizeDistributor.address) return;

        // Get hackathon info
        const info = await publicClient.readContract({
          address: prizeDistributor.address,
          abi: PRIZE_DISTRIBUTOR_ABI,
          functionName: 'getHackathonInfo',
          args: [BigInt(hackathonId)],
        } as any);

        setHackathonInfo(info);

        // Check if can claim
        const canClaimResult = await publicClient.readContract({
          address: prizeDistributor.address,
          abi: PRIZE_DISTRIBUTOR_ABI,
          functionName: 'canClaim',
          args: [BigInt(hackathonId), address],
        } as any);

        setCanClaim(canClaimResult);

        // Get prize amount
        const amount = await publicClient.readContract({
          address: prizeDistributor.address,
          abi: PRIZE_DISTRIBUTOR_ABI,
          functionName: 'getPrizeAmount',
          args: [BigInt(hackathonId), address],
        } as any);

        setPrizeAmount(amount);
      } catch (error) {
        console.error('Error checking prize status:', error);
        setCanClaim(false);
      } finally {
        setChecking(false);
      }
    };

    checkPrizeStatus();
  }, [address, hackathonId, prizeDistributor.address]);

  const handleClaim = async () => {
    if (!prizeDistributor.isSupported) {
      alert('La red actual no está soportada. Por favor, cambia a Ethereum Sepolia.');
      return;
    }

    try {
      prizeDistributor.claimPrize(parseInt(hackathonId));
    } catch (error: any) {
      console.error('Error claiming prize:', error);
      alert(error.message || 'Error al reclamar premio');
    }
  };

  if (!address) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-white/60">Conecta tu wallet para ver tus premios</p>
      </div>
    );
  }

  if (checking) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-white/60">Verificando premios...</p>
      </div>
    );
  }

  if (!prizeDistributor.isSupported) {
    return (
      <div className="glassmorphic p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-300">Red no soportada</h3>
        </div>
        <p className="text-yellow-200/80 text-sm mb-4">
          Por favor, cambia a Ethereum Sepolia para reclamar premios.
        </p>
        <p className="text-yellow-200/60 text-xs">
          Chain ID actual: {prizeDistributor.chainId || 'No conectado'}
        </p>
      </div>
    );
  }

  if (!canClaim && prizeAmount === 0n) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <Trophy className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No tienes premios asignados</h3>
        <p className="text-white/60 text-sm">
          Los premios serán asignados después de la evaluación de proyectos.
        </p>
      </div>
    );
  }

  if (!canClaim && prizeAmount && prizeAmount > 0n) {
    return (
      <div className="glassmorphic p-6 rounded-lg border border-blue-500/30 bg-blue-500/10">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-blue-300">Premio ya reclamado</h3>
        </div>
        <p className="text-blue-200/80 text-sm">
          Ya has reclamado tu premio de este hackathon.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphic p-6 rounded-lg border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <Trophy className="w-8 h-8 text-yellow-400" />
        <div>
          <h3 className="text-xl font-bold text-white">¡Premio Disponible!</h3>
          <p className="text-white/60 text-sm">Tienes un premio listo para reclamar</p>
        </div>
      </div>

      {prizeAmount && prizeAmount > 0n && hackathonInfo && (
        <div className="space-y-3 mb-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Monto del Premio</span>
              <span className="text-2xl font-bold text-yellow-400">
                {formatUnits(prizeAmount, 6)} {/* Assuming USDC with 6 decimals */}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Token</span>
              <span className="text-white font-medium">
                {hackathonInfo.token ? `${hackathonInfo.token.slice(0, 6)}...${hackathonInfo.token.slice(-4)}` : 'USDC'}
              </span>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">Pool Total</span>
              <span className="text-white font-medium">
                {formatUnits(hackathonInfo.totalPrizePool || 0n, 6)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Estado</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                hackathonInfo.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {hackathonInfo.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={handleClaim}
        disabled={prizeDistributor.isConfirming || !canClaim}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
      >
        {prizeDistributor.isConfirming ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <Trophy className="w-4 h-4 mr-2" />
            Reclamar Premio
          </>
        )}
      </Button>

      {prizeDistributor.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">¡Premio reclamado exitosamente!</span>
          </div>
          {prizeDistributor.hash && (
            <a
              href={`https://sepolia.etherscan.io/tx/${prizeDistributor.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-green-300 hover:text-green-200 text-sm"
            >
              Ver transacción en Etherscan
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </motion.div>
      )}

      {prizeDistributor.chainId && (
        <p className="text-white/40 text-xs mt-4 text-center">
          Red: {prizeDistributor.chainId === 11155111 ? 'Ethereum Sepolia' : `Chain ${prizeDistributor.chainId}`}
        </p>
      )}
    </motion.div>
  );
}

