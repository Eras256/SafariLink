import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

/**
 * Script to setup roles for deployed contracts
 * Usage: npx hardhat run scripts/setup-roles.ts --network <network>
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();

  console.log("Setting up roles with account:", deployer.address);
  console.log("Network:", network.name);

  // Load deployment addresses
  const deploymentsDir = path.join(__dirname, "../deployments");
  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(`Deployment file not found: ${deploymentFile}`);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf-8"));

  // Get contract instances
  const NFTCertificate = await ethers.getContractAt(
    "NFTCertificate",
    deployment.contracts.NFTCertificate
  );
  const PrizeDistributor = await ethers.getContractAt(
    "PrizeDistributor",
    deployment.contracts.PrizeDistributor
  );

  // Get role addresses from environment or use defaults
  const minterAddress = process.env.MINTER_ADDRESS || deployer.address;
  const organizerAddress = process.env.ORGANIZER_ADDRESS || deployer.address;
  const judgeAddress = process.env.JUDGE_ADDRESS || deployer.address;

  console.log("\nGranting roles...");
  console.log("MINTER_ROLE:", minterAddress);
  console.log("ORGANIZER_ROLE:", organizerAddress);
  console.log("JUDGE_ROLE:", judgeAddress);

  // Grant MINTER_ROLE
  const MINTER_ROLE = await NFTCertificate.MINTER_ROLE();
  if (!(await NFTCertificate.hasRole(MINTER_ROLE, minterAddress))) {
    const tx1 = await NFTCertificate.grantRole(MINTER_ROLE, minterAddress);
    await tx1.wait();
    console.log("✅ Granted MINTER_ROLE to", minterAddress);
  } else {
    console.log("⏭️  MINTER_ROLE already granted to", minterAddress);
  }

  // Grant ORGANIZER_ROLE
  const ORGANIZER_ROLE = await PrizeDistributor.ORGANIZER_ROLE();
  if (!(await PrizeDistributor.hasRole(ORGANIZER_ROLE, organizerAddress))) {
    const tx2 = await PrizeDistributor.grantRole(ORGANIZER_ROLE, organizerAddress);
    await tx2.wait();
    console.log("✅ Granted ORGANIZER_ROLE to", organizerAddress);
  } else {
    console.log("⏭️  ORGANIZER_ROLE already granted to", organizerAddress);
  }

  // Grant JUDGE_ROLE
  const JUDGE_ROLE = await PrizeDistributor.JUDGE_ROLE();
  if (!(await PrizeDistributor.hasRole(JUDGE_ROLE, judgeAddress))) {
    const tx3 = await PrizeDistributor.grantRole(JUDGE_ROLE, judgeAddress);
    await tx3.wait();
    console.log("✅ Granted JUDGE_ROLE to", judgeAddress);
  } else {
    console.log("⏭️  JUDGE_ROLE already granted to", judgeAddress);
  }

  console.log("\n✅ Role setup completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

