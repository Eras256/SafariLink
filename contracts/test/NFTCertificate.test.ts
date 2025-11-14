import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { NFTCertificate } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("NFTCertificate", function () {
  let nft: NFTCertificate;
  let owner: SignerWithAddress;
  let minter: SignerWithAddress;
  let recipient1: SignerWithAddress;
  let recipient2: SignerWithAddress;
  let unauthorized: SignerWithAddress;

  const BASE_URI = "https://api.safarilink.xyz/metadata/";

  async function deployNFTCertificateFixture() {
    const [owner, minter, recipient1, recipient2, unauthorized] = await ethers.getSigners();

    const NFTCertificate = await ethers.getContractFactory("NFTCertificate");
    const nft = await NFTCertificate.deploy(BASE_URI);

    const MINTER_ROLE = await nft.MINTER_ROLE();
    await nft.grantRole(MINTER_ROLE, minter.address);

    return { nft, owner, minter, recipient1, recipient2, unauthorized };
  }

  beforeEach(async function () {
    ({ nft, owner, minter, recipient1, recipient2, unauthorized } = await loadFixture(deployNFTCertificateFixture));
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal("SafariLink Certificate");
      expect(await nft.symbol()).to.equal("SLC");
    });

    it("Should set the correct base URI", async function () {
      expect(await nft.baseURI()).to.equal(BASE_URI);
    });

    it("Should grant MINTER_ROLE to deployer", async function () {
      const MINTER_ROLE = await nft.MINTER_ROLE();
      expect(await nft.hasRole(MINTER_ROLE, owner.address)).to.be.true;
    });

    it("Should start with token ID 1", async function () {
      expect(await nft.nextTokenId()).to.equal(1);
    });
  });

  describe("Minting", function () {
    it("Should mint a certificate successfully", async function () {
      const hackathonId = 1;
      const hackathonName = "Test Hackathon";
      const achievement = "Participant";

      await expect(
        nft.connect(minter).mint(recipient1.address, hackathonId, hackathonName, achievement)
      )
        .to.emit(nft, "CertificateMinted")
        .withArgs(1, recipient1.address, hackathonId, achievement)
        .to.emit(nft, "Locked")
        .withArgs(1);

      expect(await nft.ownerOf(1)).to.equal(recipient1.address);
      expect(await nft.balanceOf(recipient1.address)).to.equal(1);
      expect(await nft.getCertificateCount(recipient1.address)).to.equal(1);
    });

    it("Should mint a badge successfully", async function () {
      const hackathonId = 1;
      const hackathonName = "Test Hackathon";
      const badgeName = "First Place";
      const rarity = "LEGENDARY";

      await expect(
        nft.connect(minter).mintBadge(recipient1.address, hackathonId, hackathonName, badgeName, rarity)
      )
        .to.emit(nft, "BadgeMinted")
        .withArgs(1, recipient1.address, hackathonId, badgeName, rarity);

      const certificate = await nft.getCertificate(1);
      expect(certificate.badgeType).to.equal("BADGE");
      expect(certificate.achievement).to.equal(badgeName);
    });

    it("Should batch mint certificates", async function () {
      const recipients = [recipient1.address, recipient2.address];
      const hackathonId = 1;
      const hackathonName = "Test Hackathon";
      const achievement = "Participant";

      await nft.connect(minter).batchMint(recipients, hackathonId, hackathonName, achievement);

      expect(await nft.balanceOf(recipient1.address)).to.equal(1);
      expect(await nft.balanceOf(recipient2.address)).to.equal(1);
      expect(await nft.nextTokenId()).to.equal(3);
    });

    it("Should revert if minting to zero address", async function () {
      await expect(
        nft.connect(minter).mint(ethers.ZeroAddress, 1, "Test", "Participant")
      ).to.be.revertedWithCustomError(nft, "InvalidAddress");
    });

    it("Should revert if unauthorized user tries to mint", async function () {
      await expect(
        nft.connect(unauthorized).mint(recipient1.address, 1, "Test", "Participant")
      ).to.be.revertedWithCustomError(nft, "AccessControlUnauthorizedAccount");
    });

    it("Should revert if contract is paused", async function () {
      const PAUSER_ROLE = await nft.PAUSER_ROLE();
      await nft.connect(owner).grantRole(PAUSER_ROLE, owner.address);
      await nft.connect(owner).pause();

      await expect(
        nft.connect(minter).mint(recipient1.address, 1, "Test", "Participant")
      ).to.be.revertedWithCustomError(nft, "EnforcedPause");
    });
  });

  describe("Soulbound Token (EIP-5192)", function () {
    beforeEach(async function () {
      await nft.connect(minter).mint(recipient1.address, 1, "Test", "Participant");
    });

    it("Should return true for locked()", async function () {
      expect(await nft.locked(1)).to.be.true;
    });

    it("Should revert on transfer", async function () {
      await expect(
        nft.connect(recipient1).transferFrom(recipient1.address, recipient2.address, 1)
      ).to.be.revertedWithCustomError(nft, "SoulboundToken");
    });

    it("Should revert on approve", async function () {
      await expect(
        nft.connect(recipient1).approve(recipient2.address, 1)
      ).to.be.revertedWithCustomError(nft, "SoulboundToken");
    });

    it("Should revert on setApprovalForAll", async function () {
      await expect(
        nft.connect(recipient1).setApprovalForAll(recipient2.address, true)
      ).to.be.revertedWithCustomError(nft, "SoulboundToken");
    });
  });

  describe("Certificate Queries", function () {
    beforeEach(async function () {
      await nft.connect(minter).mint(recipient1.address, 1, "Hackathon 1", "Participant");
      await nft.connect(minter).mintBadge(recipient1.address, 1, "Hackathon 1", "Winner", "RARE");
    });

    it("Should return all certificates for an owner", async function () {
      const certificates = await nft.getCertificates(recipient1.address);
      expect(certificates.length).to.equal(2);
      expect(certificates[0]).to.equal(1);
      expect(certificates[1]).to.equal(2);
    });

    it("Should return badges by rarity", async function () {
      const badges = await nft.getBadges(recipient1.address, "RARE");
      expect(badges.length).to.equal(1);
      expect(badges[0]).to.equal(2);
    });

    it("Should return certificate details", async function () {
      const certificate = await nft.getCertificate(1);
      expect(certificate.hackathonId).to.equal(1);
      expect(certificate.hackathonName).to.equal("Hackathon 1");
      expect(certificate.achievement).to.equal("Participant");
      expect(certificate.badgeType).to.equal("CERTIFICATE");
    });

    it("Should return correct certificate count", async function () {
      expect(await nft.getCertificateCount(recipient1.address)).to.equal(2);
    });
  });

  describe("Admin Functions", function () {
    it("Should update base URI", async function () {
      const newURI = "https://new-api.safarilink.xyz/metadata/";
      await expect(nft.connect(owner).setBaseURI(newURI))
        .to.emit(nft, "BaseURIUpdated")
        .withArgs(newURI);

      expect(await nft.baseURI()).to.equal(newURI);
    });

    it("Should revert if non-admin tries to update base URI", async function () {
      await expect(
        nft.connect(unauthorized).setBaseURI("https://new-uri.com/")
      ).to.be.revertedWithCustomError(nft, "AccessControlUnauthorizedAccount");
    });

    it("Should pause and unpause contract", async function () {
      const PAUSER_ROLE = await nft.PAUSER_ROLE();
      await nft.connect(owner).grantRole(PAUSER_ROLE, owner.address);

      await nft.connect(owner).pause();
      expect(await nft.paused()).to.be.true;

      await nft.connect(owner).unpause();
      expect(await nft.paused()).to.be.false;
    });
  });

  describe("Gas Optimization", function () {
    it("Should efficiently batch mint multiple certificates", async function () {
      const recipients = Array(10).fill(null).map((_, i) => 
        ethers.Wallet.createRandom().address
      );
      
      const gasEstimate = await nft.connect(minter).batchMint.estimateGas(
        recipients,
        1,
        "Test Hackathon",
        "Participant"
      );

      // Should be less than individual mints
      expect(gasEstimate).to.be.lessThan(ethers.parseUnits("5000000", "wei"));
    });
  });
});

