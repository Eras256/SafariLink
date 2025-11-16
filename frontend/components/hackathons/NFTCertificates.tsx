'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNFTCertificate } from '@/hooks/useNFTCertificate';
import { motion } from 'framer-motion';
import { Award, Loader2, AlertCircle, ExternalLink, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Address } from 'viem';
import { format } from 'date-fns';

interface NFTCertificatesProps {
  hackathonId?: string;
  userId?: string;
}

export function NFTCertificates({ hackathonId, userId }: NFTCertificatesProps) {
  const { address } = useAccount();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userAddress = (userId || address) as Address;

  const nftCertificate = useNFTCertificate();

  useEffect(() => {
    const loadCertificates = async () => {
      if (!userAddress || !nftCertificate.address) {
        setLoading(false);
        return;
      }

      try {
        const { config } = await import('@/config/web3');
        const { NFT_CERTIFICATE_ABI } = await import('@/lib/web3/contracts');
        const publicClient = config.getPublicClient();

        if (!publicClient) return;

        // Get certificate IDs
        const tokenIds = await publicClient.readContract({
          address: nftCertificate.address,
          abi: NFT_CERTIFICATE_ABI,
          functionName: 'getCertificates',
          args: [userAddress],
        } as any) as bigint[];

        // Get details for each certificate
        const certs = await Promise.all(
          tokenIds.map(async (tokenId) => {
            try {
              const cert = await publicClient.readContract({
                address: nftCertificate.address,
                abi: NFT_CERTIFICATE_ABI,
                functionName: 'getCertificate',
                args: [tokenId],
              } as any);

              const tokenURI = await publicClient.readContract({
                address: nftCertificate.address,
                abi: NFT_CERTIFICATE_ABI,
                functionName: 'tokenURI',
                args: [tokenId],
              } as any);

              return {
                tokenId: tokenId.toString(),
                ...cert,
                tokenURI,
              };
            } catch (error) {
              console.error(`Error loading certificate ${tokenId}:`, error);
              return null;
            }
          })
        );

        setCertificates(certs.filter(Boolean));
      } catch (error) {
        console.error('Error loading certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [userAddress, nftCertificate.address]);

  if (!userAddress) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-white/60">Conecta tu wallet para ver tus certificados</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
        <p className="text-white/60">Cargando certificados...</p>
      </div>
    );
  }

  if (!nftCertificate.isSupported) {
    return (
      <div className="glassmorphic p-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-yellow-300">Red no soportada</h3>
        </div>
        <p className="text-yellow-200/80 text-sm">
          Por favor, cambia a Ethereum Sepolia para ver certificados NFT.
        </p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="glassmorphic p-6 rounded-lg text-center">
        <Award className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No tienes certificados aún</h3>
        <p className="text-white/60 text-sm">
          Los certificados se emiten automáticamente cuando participas o ganas en hackathons.
        </p>
      </div>
    );
  }

  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case 'BADGE':
        return 'border-purple-400 bg-purple-400/20';
      case 'CERTIFICATE':
        return 'border-blue-400 bg-blue-400/20';
      default:
        return 'border-white/20 bg-white/10';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">Certificados NFT</h3>
        </div>
        <div className="text-white/60 text-sm">
          {certificates.length} {certificates.length === 1 ? 'certificado' : 'certificados'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.tokenId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glassmorphic p-6 rounded-lg border-2 ${getBadgeColor(cert.badgeType || 'CERTIFICATE')}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" />
                <span className="text-white/60 text-xs">#{cert.tokenId}</span>
              </div>
              {cert.badgeType === 'BADGE' && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs font-medium">
                  Badge
                </span>
              )}
            </div>

            <h4 className="text-white font-semibold mb-2">{cert.hackathonName || 'Hackathon'}</h4>
            <p className="text-white/80 text-sm mb-3">{cert.achievement || 'Participante'}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Hackathon ID</span>
                <span className="text-white">{cert.hackathonId?.toString() || 'N/A'}</span>
              </div>
              {cert.timestamp && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/60">Fecha</span>
                  <span className="text-white">
                    {format(new Date(Number(cert.timestamp) * 1000), 'dd/MM/yyyy')}
                  </span>
                </div>
              )}
            </div>

            {cert.tokenURI && (
              <a
                href={cert.tokenURI}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm"
              >
                Ver metadatos
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            <div className="mt-4 pt-4 border-t border-white/10">
              <a
                href={`https://sepolia.etherscan.io/token/${nftCertificate.address}?a=${cert.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/60 hover:text-white text-xs"
              >
                Ver en Etherscan
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


