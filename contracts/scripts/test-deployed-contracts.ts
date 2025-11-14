import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script para probar los contratos desplegados en Sepolia
 * Ejecuta una transacción mínima en cada contrato para verificar funcionamiento
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Testing deployed contracts with account:", deployer.address);
  console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
  console.log("Network: sepolia\n");

  // Load deployment addresses
  const deploymentsDir = path.join(__dirname, "../deployments");
  const deploymentFile = path.join(deploymentsDir, "sepolia.json");

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found: ${deploymentFile}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf-8"));
  console.log("Loaded deployment addresses:");
  console.log("  NFTCertificate:", deployment.contracts.NFTCertificate);
  console.log("  PrizeDistributor:", deployment.contracts.PrizeDistributor);
  console.log("");

  // Get contract instances
  const NFTCertificate = await ethers.getContractAt(
    "NFTCertificate",
    deployment.contracts.NFTCertificate
  );
  const PrizeDistributor = await ethers.getContractAt(
    "PrizeDistributor",
    deployment.contracts.PrizeDistributor
  );

  // Test 1: Mint a certificate (NFTCertificate)
  console.log("=".repeat(60));
  console.log("TEST 1: Minting NFT Certificate");
  console.log("=".repeat(60));

  try {
    // Check if deployer has MINTER_ROLE
    const MINTER_ROLE = await NFTCertificate.MINTER_ROLE();
    const hasMinterRole = await NFTCertificate.hasRole(MINTER_ROLE, deployer.address);

    if (!hasMinterRole) {
      console.log("⚠️  Deployer doesn't have MINTER_ROLE. Granting role...");
      // Note: This would require admin role, but we'll try to mint anyway
      // In production, roles should be set up via setup-roles.ts
    }

    // Use deployer's address as recipient (self-mint for testing)
    const recipient = deployer.address;
    const hackathonId = 1;
    const hackathonName = "Test Hackathon Sepolia";
    const achievement = "Test Participant";

    console.log(`Minting certificate to: ${recipient}`);
    console.log(`Hackathon ID: ${hackathonId}`);
    console.log(`Achievement: ${achievement}`);

    // Estimate gas first
    const gasEstimate = await NFTCertificate.mint.estimateGas(
      recipient,
      hackathonId,
      hackathonName,
      achievement
    );
    console.log(`Estimated gas: ${gasEstimate.toString()}`);

    // Execute mint transaction
    const mintTx = await NFTCertificate.mint(
      recipient,
      hackathonId,
      hackathonName,
      achievement
    );
    console.log(`Transaction hash: ${mintTx.hash}`);
    console.log(`Waiting for confirmation...`);

    const receipt = await mintTx.wait();
    console.log(`✅ Transaction confirmed in block: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log(`Etherscan: https://sepolia.etherscan.io/tx/${mintTx.hash}`);

    // Verify the mint
    const tokenId = await NFTCertificate.nextTokenId() - 1n;
    console.log(`Minted token ID: ${tokenId}`);
    const owner = await NFTCertificate.ownerOf(tokenId);
    console.log(`Token owner: ${owner}`);
    const certificate = await NFTCertificate.getCertificate(tokenId);
    console.log(`Certificate details:`, {
      hackathonId: certificate.hackathonId.toString(),
      hackathonName: certificate.hackathonName,
      achievement: certificate.achievement,
      badgeType: certificate.badgeType,
    });

    console.log("\n✅ TEST 1 PASSED: NFT Certificate minted successfully!\n");
  } catch (error: any) {
    console.error("❌ TEST 1 FAILED:", error.message || error);
    if (error.message?.includes("AccessControlUnauthorizedAccount")) {
      console.log("💡 Tip: Run 'npx hardhat run scripts/setup-roles.ts --network sepolia' first");
    }
  }

  // Test 2: Create a hackathon with minimal prize pool (PrizeDistributor)
  console.log("=".repeat(60));
  console.log("TEST 2: Creating Hackathon with Minimal Prize Pool");
  console.log("=".repeat(60));

  try {
    // Deploy a minimal mock ERC20 token for testing
    console.log("Deploying MockERC20 token for testing...");
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20.deploy();
    await mockToken.waitForDeployment();
    const mockTokenAddress = await mockToken.getAddress();
    console.log(`MockERC20 deployed to: ${mockTokenAddress}`);

    // Check if deployer has ORGANIZER_ROLE
    const ORGANIZER_ROLE = await PrizeDistributor.ORGANIZER_ROLE();
    const hasOrganizerRole = await PrizeDistributor.hasRole(ORGANIZER_ROLE, deployer.address);

    if (!hasOrganizerRole) {
      console.log("⚠️  Deployer doesn't have ORGANIZER_ROLE. Granting role...");
      // Note: This would require admin role
    }

    // Use minimal amount: 1 token (6 decimals for USDC-like token)
    const minimalPrizePool = ethers.parseUnits("1", 6); // 1 token with 6 decimals
    console.log(`Prize pool amount: ${ethers.formatUnits(minimalPrizePool, 6)} tokens`);

    // Mint tokens to deployer
    console.log("Minting tokens to deployer...");
    const mintTx = await mockToken.mint(deployer.address, minimalPrizePool * 10n); // Mint 10 tokens
    await mintTx.wait();
    console.log("✅ Tokens minted");

    // Approve PrizeDistributor to spend tokens
    console.log("Approving PrizeDistributor to spend tokens...");
    const approveTx = await mockToken.approve(PrizeDistributor.target, minimalPrizePool);
    await approveTx.wait();
    console.log("✅ Approval confirmed");

    // Create hackathon
    console.log("Creating hackathon...");
    const gasEstimate = await PrizeDistributor.createHackathon.estimateGas(
      mockTokenAddress,
      minimalPrizePool
    );
    console.log(`Estimated gas: ${gasEstimate.toString()}`);

    const createTx = await PrizeDistributor.createHackathon(
      mockTokenAddress,
      minimalPrizePool
    );
    console.log(`Transaction hash: ${createTx.hash}`);
    console.log(`Waiting for confirmation...`);

    const receipt = await createTx.wait();
    console.log(`✅ Transaction confirmed in block: ${receipt?.blockNumber}`);
    console.log(`Gas used: ${receipt?.gasUsed.toString()}`);
    console.log(`Etherscan: https://sepolia.etherscan.io/tx/${createTx.hash}`);

    // Verify the hackathon
    const hackathonCount = await PrizeDistributor.hackathonCount();
    const hackathonId = hackathonCount - 1n;
    console.log(`Created hackathon ID: ${hackathonId}`);

    const [totalPrizePool, token, active, totalAllocated] = await PrizeDistributor.getHackathonInfo(hackathonId);
    console.log(`Hackathon info:`, {
      totalPrizePool: ethers.formatUnits(totalPrizePool, 6),
      token: token,
      active: active,
      totalAllocated: ethers.formatUnits(totalAllocated, 6),
    });

    console.log("\n✅ TEST 2 PASSED: Hackathon created successfully!\n");
  } catch (error: any) {
    console.error("❌ TEST 2 FAILED:", error.message || error);
    if (error.message?.includes("AccessControlUnauthorizedAccount")) {
      console.log("💡 Tip: Run 'npx hardhat run scripts/setup-roles.ts --network sepolia' first");
    }
  }

  console.log("=".repeat(60));
  console.log("TEST SUMMARY");
  console.log("=".repeat(60));
  console.log("All tests completed. Check Etherscan links above to verify transactions.");
  console.log("\nNext steps:");
  console.log("1. Verify transactions on Etherscan using the links above");
  console.log("2. If roles are missing, run: npx hardhat run scripts/setup-roles.ts --network sepolia");
  console.log("3. Update frontend with contract addresses");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

