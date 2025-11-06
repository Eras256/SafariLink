import { prisma } from '../config/database';

// Dynamic import for ethers to avoid errors if not installed
let ethers: any = null;
try {
  ethers = require('ethers');
} catch (error) {
  console.warn('ethers not installed, NFT minting will be disabled');
}

interface NFTMintResult {
  tokenId: string;
  txHash: string;
  success: boolean;
}

export class NFTService {
  private provider: any = null;
  private signer: any = null;
  private contract: any = null;

  constructor() {
    // Initialize provider and contract
    // In production, use environment variables for RPC URL and contract address
    const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || '';
    const contractAddress = process.env.NFT_CERTIFICATE_CONTRACT_ADDRESS || '';
    const privateKey = process.env.NFT_MINTER_PRIVATE_KEY || '';

    if (rpcUrl && contractAddress && privateKey && ethers) {
      try {
        this.provider = new ethers.JsonRpcProvider(rpcUrl);
        this.signer = new ethers.Wallet(privateKey, this.provider);

        // NFT Certificate ABI (simplified)
        const abi = [
          'function mintBadge(address _to, uint256 _hackathonId, string memory _hackathonName, string memory _badgeName, string memory _rarity) external returns (uint256)',
          'function mint(address _to, uint256 _hackathonId, string memory _hackathonName, string memory _achievement) external returns (uint256)',
          'event BadgeMinted(uint256 indexed tokenId, address indexed recipient, uint256 hackathonId, string badgeName, string rarity)',
          'event CertificateMinted(uint256 indexed tokenId, address indexed recipient, uint256 hackathonId, string achievement)',
        ];

        this.contract = new ethers.Contract(contractAddress, abi, this.signer);
      } catch (error) {
        console.error('Error initializing NFT service:', error);
      }
    }
  }

  /**
   * Mint badge NFT
   */
  async mintBadgeNFT(
    recipientAddress: string,
    hackathonId: string,
    hackathonName: string,
    badgeName: string,
    rarity: string
  ): Promise<NFTMintResult | null> {
    if (!ethers) {
      console.warn('ethers not available, skipping NFT mint');
      return null;
    }

    if (!this.contract || !this.signer) {
      console.warn('NFT service not initialized, skipping NFT mint');
      return null;
    }

    try {
      // Convert hackathonId to uint256 (assuming it's a numeric string)
      const hackathonIdNum = BigInt(hackathonId.replace(/[^0-9]/g, '')) || BigInt(0);

      // Mint badge NFT
      const tx = await this.contract.mintBadge(
        recipientAddress,
        hackathonIdNum,
        hackathonName,
        badgeName,
        rarity.toUpperCase()
      );

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Get token ID from event
      const event = receipt.logs.find(
        (log: any) => log.topics[0] === ethers.id('BadgeMinted(uint256,address,uint256,string,string)')
      ) as any;

      let tokenId = '0';
      if (event) {
        // Parse event to get tokenId
        const decoded = this.contract.interface.parseLog(event);
        if (decoded) {
          tokenId = decoded.args[0].toString();
        }
      }

      return {
        tokenId,
        txHash: receipt.hash,
        success: true,
      };
    } catch (error: any) {
      console.error('Error minting badge NFT:', error);
      throw new Error(`Failed to mint badge NFT: ${error.message}`);
    }
  }

  /**
   * Mint certificate NFT
   */
  async mintCertificateNFT(
    recipientAddress: string,
    hackathonId: string,
    hackathonName: string,
    achievement: string
  ): Promise<NFTMintResult | null> {
    if (!ethers) {
      console.warn('ethers not available, skipping NFT mint');
      return null;
    }

    if (!this.contract || !this.signer) {
      console.warn('NFT service not initialized, skipping NFT mint');
      return null;
    }

    try {
      const hackathonIdNum = BigInt(hackathonId.replace(/[^0-9]/g, '')) || BigInt(0);

      const tx = await this.contract.mint(
        recipientAddress,
        hackathonIdNum,
        hackathonName,
        achievement
      );

      const receipt = await tx.wait();

      let tokenId = '0';
      const event = receipt.logs.find(
        (log: any) => log.topics[0] === ethers.id('CertificateMinted(uint256,address,uint256,string)')
      ) as any;

      if (event) {
        const decoded = this.contract.interface.parseLog(event);
        if (decoded) {
          tokenId = decoded.args[0].toString();
        }
      }

      return {
        tokenId,
        txHash: receipt.hash,
        success: true,
      };
    } catch (error: any) {
      console.error('Error minting certificate NFT:', error);
      throw new Error(`Failed to mint certificate NFT: ${error.message}`);
    }
  }

  /**
   * Mint NFT for badge reward
   */
  async mintBadgeReward(
    userId: string,
    badgeId: string,
    hackathonId: string
  ): Promise<NFTMintResult | null> {
    try {
      // Get user and badge info
      const [user, badge, hackathon] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { walletAddress: true },
        }),
        prisma.badge.findUnique({
          where: { id: badgeId },
        }),
        prisma.hackathon.findUnique({
          where: { id: hackathonId },
          select: { name: true },
        }),
      ]);

      if (!user || !badge || !hackathon) {
        throw new Error('User, badge, or hackathon not found');
      }

      if (!badge.nftReward) {
        return null; // Badge doesn't have NFT reward
      }

      // Mint badge NFT
      const result = await this.mintBadgeNFT(
        user.walletAddress,
        hackathonId,
        hackathon.name,
        badge.name,
        badge.rarity
      );

      if (result) {
        // Update user badge with NFT info
        await prisma.userBadge.updateMany({
          where: {
            userId,
            badgeId,
            hackathonId,
          },
          data: {
            nftTokenId: result.tokenId,
            nftTxHash: result.txHash,
          },
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error minting badge reward NFT:', error);
      throw error;
    }
  }

  /**
   * Mint NFT for challenge completion
   */
  async mintChallengeReward(
    userId: string,
    challengeId: string,
    hackathonId: string
  ): Promise<NFTMintResult | null> {
    try {
      const [user, challenge, hackathon] = await Promise.all([
        prisma.user.findUnique({
          where: { id: userId },
          select: { walletAddress: true },
        }),
        prisma.challenge.findUnique({
          where: { id: challengeId },
        }),
        prisma.hackathon.findUnique({
          where: { id: hackathonId },
          select: { name: true },
        }),
      ]);

      if (!user || !challenge || !hackathon) {
        throw new Error('User, challenge, or hackathon not found');
      }

      if (!challenge.nftReward) {
        return null;
      }

      // Mint certificate NFT for challenge completion
      const result = await this.mintCertificateNFT(
        user.walletAddress,
        hackathonId,
        hackathon.name,
        `Challenge: ${challenge.title}`
      );

      if (result) {
        await prisma.userChallenge.updateMany({
          where: {
            userId,
            challengeId,
            hackathonId,
          },
          data: {
            nftTokenId: result.tokenId,
            nftTxHash: result.txHash,
          },
        });
      }

      return result;
    } catch (error: any) {
      console.error('Error minting challenge reward NFT:', error);
      throw error;
    }
  }
}

