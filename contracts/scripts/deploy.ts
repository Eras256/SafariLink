import { ethers, network, run } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());
  console.log("Network:", network.name);

  // Base URI for NFT metadata
  const baseURI = process.env.BASE_URI || "https://api.safarilink.xyz/metadata/";

  // Deploy NFTCertificate
  console.log("\nDeploying NFTCertificate...");
  const NFTCertificate = await ethers.getContractFactory("NFTCertificate");
  const nftCertificate = await NFTCertificate.deploy(baseURI);
  await nftCertificate.waitForDeployment();
  const nftAddress = await nftCertificate.getAddress();
  console.log("NFTCertificate deployed to:", nftAddress);

  // Deploy PrizeDistributor
  console.log("\nDeploying PrizeDistributor...");
  const PrizeDistributor = await ethers.getContractFactory("PrizeDistributor");
  const prizeDistributor = await PrizeDistributor.deploy();
  await prizeDistributor.waitForDeployment();
  const prizeAddress = await prizeDistributor.getAddress();
  console.log("PrizeDistributor deployed to:", prizeAddress);

  // Save deployment addresses
  const deploymentInfo = {
    network: network.name,
    chainId: network.config.chainId,
    deployer: deployer.address,
    contracts: {
      NFTCertificate: nftAddress,
      PrizeDistributor: prizeAddress,
    },
    timestamp: new Date().toISOString(),
  };

  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  console.log("\nDeployment addresses saved to:", deploymentFile);

  // Verify contracts on block explorer (if not local network)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("\nWaiting for block confirmations before verification...");
    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30 seconds

    try {
      console.log("Verifying NFTCertificate...");
      await run("verify:verify", {
        address: nftAddress,
        constructorArguments: [baseURI],
      });
      console.log("NFTCertificate verified!");
    } catch (error: any) {
      if (error.message?.includes("Already Verified")) {
        console.log("NFTCertificate already verified!");
      } else {
        console.error("Error verifying NFTCertificate:", error.message || error);
      }
    }

    try {
      console.log("Verifying PrizeDistributor...");
      await run("verify:verify", {
        address: prizeAddress,
        constructorArguments: [],
      });
      console.log("PrizeDistributor verified!");
    } catch (error: any) {
      if (error.message?.includes("Already Verified")) {
        console.log("PrizeDistributor already verified!");
      } else {
        console.error("Error verifying PrizeDistributor:", error.message || error);
      }
    }
  }

  console.log("\n✅ Deployment completed successfully!");
  console.log("\nNext steps:");
  console.log("1. Update contract addresses in frontend/lib/web3/contracts.ts");
  console.log("2. Grant MINTER_ROLE to backend service");
  console.log("3. Grant ORGANIZER_ROLE and JUDGE_ROLE as needed");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

