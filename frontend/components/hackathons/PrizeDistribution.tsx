'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { usePrizeDistributor } from '@/hooks/useContract';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, AlertCircle, Loader2, CheckCircle2, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from 'viem';

interface PrizeDistributionProps {
  hackathonId: string;
}

interface Winner {
  address: Address;
  amount: string;
}

export function PrizeDistribution({ hackathonId }: PrizeDistributionProps) {
  const { address } = useAccount();
  const [winners, setWinners] = useState<Winner[]>([{ address: '' as Address, amount: '' }]);
  const [hackathonInfo, setHackathonInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const prizeDistributor = usePrizeDistributor();

  // Load hackathon info
  useEffect(() => {
    const loadInfo = async () => {
      if (!prizeDistributor.address) {
        setLoading(false);
        return;
      }

      try {
        const { config } = await import('@/config/web3');
        const { PRIZE_DISTRIBUTOR_ABI } = await import('@/lib/web3/contracts');
        const publicClient = config.getPublicClient();

        if (!publicClient) return;

        const info = await publicClient.readContract({
          address: prizeDistributor.address,
          abi: PRIZE_DISTRIBUTOR_ABI,
          functionName: 'getHackathonInfo',
          args: [BigInt(hackathonId)],
        } as any);

        setHackathonInfo(info);
      } catch (error) {
        console.error('Error loading hackathon info:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInfo();
  }, [hackathonId, prizeDistributor.address]);

  const addWinner = () => {
    setWinners([...winners, { address: '' as Address, amount: '' }]);
  };

  const removeWinner = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
  };

  const updateWinner = (index: number, field: 'address' | 'amount', value: string) => {
    const updated = [...winners];
    updated[index] = { ...updated[index], [field]: value };
    setWinners(updated);
  };

  const handleDistribute = async () => {
    if (!prizeDistributor.isSupported) {
      alert('La red actual no está soportada. Por favor, cambia a Ethereum Sepolia.');
      return;
    }

    // Validate winners
    const validWinners = winners.filter(w => w.address && w.amount);
    if (validWinners.length === 0) {
      alert('Agrega al menos un ganador con dirección y monto');
      return;
    }

    // Validate addresses
    const addresses = validWinners.map(w => w.address);
    const amounts = validWinners.map(w => BigInt(Math.floor(parseFloat(w.amount) * 1000000))); // Assuming 6 decimals for USDC

    try {
      prizeDistributor.distributePrizes(
        BigInt(hackathonId),
        addresses as Address[],
        amounts
      );
    } catch (error: any) {
      console.error('Error distributing prizes:', error);
      alert(error.message || 'Error al distribuir premios');
    }
  };

  if (!address) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-white/60">Conecta tu wallet para distribuir premios</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-white/60">Cargando información del hackathon...</p>
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
        <p className="text-yellow-200/80 text-sm">
          Por favor, cambia a Ethereum Sepolia para distribuir premios.
        </p>
      </div>
    );
  }

  const totalAmount = winners.reduce((sum, w) => {
    const amount = parseFloat(w.amount) || 0;
    return sum + amount;
  }, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glassmorphic p-6 rounded-lg"
    >
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <h3 className="text-xl font-bold text-white">Distribuir Premios</h3>
      </div>

      {hackathonInfo && (
        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-white/60 text-sm mb-1">Pool Total</div>
              <div className="text-white font-semibold">
                {hackathonInfo.totalPrizePool ? (Number(hackathonInfo.totalPrizePool) / 1000000).toFixed(2) : '0'} USDC
              </div>
            </div>
            <div>
              <div className="text-white/60 text-sm mb-1">Estado</div>
              <div className={`px-2 py-1 rounded text-xs font-medium inline-block ${
                hackathonInfo.active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {hackathonInfo.active ? 'Activo' : 'Inactivo'}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-semibold">Ganadores</h4>
          <Button
            onClick={addWinner}
            size="sm"
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>

        {winners.map((winner, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/60 text-sm">Ganador #{index + 1}</span>
              {winners.length > 1 && (
                <button
                  onClick={() => removeWinner(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-white/60 text-sm mb-1">Dirección</label>
                <input
                  type="text"
                  value={winner.address}
                  onChange={(e) => updateWinner(index, 'address', e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1">Monto (USDC)</label>
                <input
                  type="number"
                  value={winner.amount}
                  onChange={(e) => updateWinner(index, 'amount', e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-white/80 font-medium">Total a Distribuir</span>
          <span className="text-2xl font-bold text-blue-400">{totalAmount.toFixed(2)} USDC</span>
        </div>
      </div>

      <Button
        onClick={handleDistribute}
        disabled={prizeDistributor.isConfirming || totalAmount === 0}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3"
      >
        {prizeDistributor.isConfirming ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Distribuyendo...
          </>
        ) : (
          <>
            <Trophy className="w-4 h-4 mr-2" />
            Distribuir Premios
          </>
        )}
      </Button>

      {prizeDistributor.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-green-500/20 border border-green-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-semibold">¡Premios distribuidos exitosamente!</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

