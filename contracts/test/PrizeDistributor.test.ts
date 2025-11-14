import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { PrizeDistributor } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("PrizeDistributor", function () {
  let distributor: PrizeDistributor;
  let mockToken: any;
  let owner: SignerWithAddress;
  let organizer: SignerWithAddress;
  let judge: SignerWithAddress;
  let winner1: SignerWithAddress;
  let winner2: SignerWithAddress;
  let unauthorized: SignerWithAddress;

  const PRIZE_POOL = ethers.parseUnits("100000", 6); // 100k USDC (6 decimals)
  const PRIZE_1 = ethers.parseUnits("50000", 6);
  const PRIZE_2 = ethers.parseUnits("30000", 6);

  async function deployPrizeDistributorFixture() {
    const [owner, organizer, judge, winner1, winner2, unauthorized] = await ethers.getSigners();

    // Deploy mock ERC20 token
    const MockERC20Factory = await ethers.getContractFactory("MockERC20");
    const mockToken = await MockERC20Factory.deploy();
    await mockToken.waitForDeployment();

    // Deploy PrizeDistributor
    const PrizeDistributor = await ethers.getContractFactory("PrizeDistributor");
    const distributor = await PrizeDistributor.deploy();

    // Grant roles
    const ORGANIZER_ROLE = await distributor.ORGANIZER_ROLE();
    const JUDGE_ROLE = await distributor.JUDGE_ROLE();
    await distributor.grantRole(ORGANIZER_ROLE, organizer.address);
    await distributor.grantRole(JUDGE_ROLE, judge.address);

    // Mint tokens to organizer
    await mockToken.mint(organizer.address, PRIZE_POOL * 2n);
    await mockToken.mint(winner1.address, ethers.parseUnits("1000", 6));
    await mockToken.mint(winner2.address, ethers.parseUnits("1000", 6));

    return {
      distributor,
      mockToken,
      owner,
      organizer,
      judge,
      winner1,
      winner2,
      unauthorized,
    };
  }

  beforeEach(async function () {
    ({
      distributor,
      mockToken,
      owner,
      organizer,
      judge,
      winner1,
      winner2,
      unauthorized,
    } = await loadFixture(deployPrizeDistributorFixture));
  });

  describe("Deployment", function () {
    it("Should grant DEFAULT_ADMIN_ROLE to deployer", async function () {
      const DEFAULT_ADMIN_ROLE = await distributor.DEFAULT_ADMIN_ROLE();
      expect(await distributor.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });

    it("Should initialize with zero hackathon count", async function () {
      expect(await distributor.hackathonCount()).to.equal(0);
    });

    it("Should initialize with zero total distributed", async function () {
      expect(await distributor.totalDistributed()).to.equal(0);
    });
  });

  describe("Hackathon Creation", function () {
    it("Should create a hackathon successfully", async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);

      await expect(
        distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL)
      )
        .to.emit(distributor, "HackathonCreated")
        .withArgs(0, mockToken.target, PRIZE_POOL, organizer.address);

      expect(await distributor.hackathonCount()).to.equal(1);

      const [totalPrizePool, token, active, totalAllocated] = await distributor.getHackathonInfo(0);
      expect(totalPrizePool).to.equal(PRIZE_POOL);
      expect(token).to.equal(mockToken.target);
      expect(active).to.be.true;
      expect(totalAllocated).to.equal(0);

      // Check token balance
      expect(await mockToken.balanceOf(distributor.target)).to.equal(PRIZE_POOL);
    });

    it("Should revert if token address is zero", async function () {
      await expect(
        distributor.connect(organizer).createHackathon(ethers.ZeroAddress, PRIZE_POOL)
      ).to.be.revertedWithCustomError(distributor, "InvalidToken");
    });

    it("Should revert if prize pool is zero", async function () {
      await expect(
        distributor.connect(organizer).createHackathon(mockToken.target, 0)
      ).to.be.revertedWithCustomError(distributor, "InvalidPrizePool");
    });

    it("Should revert if unauthorized user tries to create hackathon", async function () {
      await mockToken.connect(unauthorized).approve(distributor.target, PRIZE_POOL);
      await expect(
        distributor.connect(unauthorized).createHackathon(mockToken.target, PRIZE_POOL)
      ).to.be.revertedWithCustomError(distributor, "AccessControlUnauthorizedAccount");
    });

    it("Should revert if contract is paused", async function () {
      const PAUSER_ROLE = await distributor.PAUSER_ROLE();
      await distributor.grantRole(PAUSER_ROLE, owner.address);
      await distributor.pause();

      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      await expect(
        distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL)
      ).to.be.revertedWithCustomError(distributor, "EnforcedPause");
    });
  });

  describe("Setting Prizes", function () {
    let hackathonId: bigint;

    beforeEach(async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      const tx = await distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL);
      const receipt = await tx.wait();
      hackathonId = 0n;
    });

    it("Should set prizes successfully", async function () {
      const winners = [winner1.address, winner2.address];
      const amounts = [PRIZE_1, PRIZE_2];

      await expect(
        distributor.connect(judge).setPrizes(hackathonId, winners, amounts)
      )
        .to.emit(distributor, "PrizesSet")
        .withArgs(hackathonId, winners, amounts);

      expect(await distributor.getPrizeAmount(hackathonId, winner1.address)).to.equal(PRIZE_1);
      expect(await distributor.getPrizeAmount(hackathonId, winner2.address)).to.equal(PRIZE_2);

      const [, , , totalAllocated] = await distributor.getHackathonInfo(hackathonId);
      expect(totalAllocated).to.equal(PRIZE_1 + PRIZE_2);
    });

    it("Should revert if arrays length mismatch", async function () {
      const winners = [winner1.address, winner2.address];
      const amounts = [PRIZE_1];

      await expect(
        distributor.connect(judge).setPrizes(hackathonId, winners, amounts)
      ).to.be.revertedWithCustomError(distributor, "ArrayLengthMismatch");
    });

    it("Should revert if winner address is zero", async function () {
      const winners = [ethers.ZeroAddress];
      const amounts = [PRIZE_1];

      await expect(
        distributor.connect(judge).setPrizes(hackathonId, winners, amounts)
      ).to.be.revertedWithCustomError(distributor, "InvalidAddress");
    });

    it("Should revert if total exceeds prize pool", async function () {
      const winners = [winner1.address];
      const amounts = [PRIZE_POOL + 1n];

      await expect(
        distributor.connect(judge).setPrizes(hackathonId, winners, amounts)
      ).to.be.revertedWithCustomError(distributor, "ExceedsPrizePool");
    });

    it("Should revert if hackathon is not active", async function () {
      await distributor.connect(organizer).deactivateHackathon(hackathonId);

      const winners = [winner1.address];
      const amounts = [PRIZE_1];

      await expect(
        distributor.connect(judge).setPrizes(hackathonId, winners, amounts)
      ).to.be.revertedWithCustomError(distributor, "HackathonNotActive");
    });
  });

  describe("Claiming Prizes", function () {
    let hackathonId: bigint;

    beforeEach(async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      const tx = await distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL);
      await tx.wait();
      hackathonId = 0n;

      // Set prizes
      const winners = [winner1.address, winner2.address];
      const amounts = [PRIZE_1, PRIZE_2];
      await distributor.connect(judge).setPrizes(hackathonId, winners, amounts);
    });

    it("Should claim prize successfully", async function () {
      const initialBalance = await mockToken.balanceOf(winner1.address);

      await expect(
        distributor.connect(winner1).claimPrize(hackathonId)
      )
        .to.emit(distributor, "PrizeClaimed")
        .withArgs(hackathonId, winner1.address, PRIZE_1);

      expect(await mockToken.balanceOf(winner1.address)).to.equal(initialBalance + PRIZE_1);
      expect(await distributor.totalDistributed()).to.equal(PRIZE_1);
      expect(await distributor.canClaim(hackathonId, winner1.address)).to.be.false;
    });

    it("Should revert if already claimed", async function () {
      await distributor.connect(winner1).claimPrize(hackathonId);

      await expect(
        distributor.connect(winner1).claimPrize(hackathonId)
      ).to.be.revertedWithCustomError(distributor, "AlreadyClaimed");
    });

    it("Should revert if no prize allocated", async function () {
      await expect(
        distributor.connect(unauthorized).claimPrize(hackathonId)
      ).to.be.revertedWithCustomError(distributor, "NoPrizeAllocated");
    });

    it("Should revert if hackathon is not active", async function () {
      await distributor.connect(organizer).deactivateHackathon(hackathonId);

      await expect(
        distributor.connect(winner1).claimPrize(hackathonId)
      ).to.be.revertedWithCustomError(distributor, "HackathonNotActive");
    });
  });

  describe("Batch Distribution", function () {
    let hackathonId: bigint;

    beforeEach(async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      const tx = await distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL);
      await tx.wait();
      hackathonId = 0n;

      // Set prizes
      const winners = [winner1.address, winner2.address];
      const amounts = [PRIZE_1, PRIZE_2];
      await distributor.connect(judge).setPrizes(hackathonId, winners, amounts);
    });

    it("Should batch distribute prizes", async function () {
      const winners = [winner1.address, winner2.address];
      const initialBalance1 = await mockToken.balanceOf(winner1.address);
      const initialBalance2 = await mockToken.balanceOf(winner2.address);

      await distributor.connect(organizer).batchDistribute(hackathonId, winners);

      expect(await mockToken.balanceOf(winner1.address)).to.equal(initialBalance1 + PRIZE_1);
      expect(await mockToken.balanceOf(winner2.address)).to.equal(initialBalance2 + PRIZE_2);
      expect(await distributor.totalDistributed()).to.equal(PRIZE_1 + PRIZE_2);
    });

    it("Should skip already claimed prizes", async function () {
      await distributor.connect(winner1).claimPrize(hackathonId);
      const winners = [winner1.address, winner2.address];

      await distributor.connect(organizer).batchDistribute(hackathonId, winners);

      // Only winner2 should receive prize
      expect(await distributor.canClaim(hackathonId, winner2.address)).to.be.false;
    });
  });

  describe("Admin Functions", function () {
    let hackathonId: bigint;

    beforeEach(async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      const tx = await distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL);
      await tx.wait();
      hackathonId = 0n;
    });

    it("Should deactivate hackathon", async function () {
      await expect(
        distributor.connect(organizer).deactivateHackathon(hackathonId)
      )
        .to.emit(distributor, "HackathonDeactivated")
        .withArgs(hackathonId);

      const [, , active] = await distributor.getHackathonInfo(hackathonId);
      expect(active).to.be.false;
    });

    it("Should pause and unpause contract", async function () {
      const PAUSER_ROLE = await distributor.PAUSER_ROLE();
      await distributor.grantRole(PAUSER_ROLE, owner.address);

      await distributor.connect(owner).pause();
      expect(await distributor.paused()).to.be.true;

      await distributor.connect(owner).unpause();
      expect(await distributor.paused()).to.be.false;
    });

    it("Should emergency withdraw", async function () {
      const withdrawAmount = ethers.parseUnits("10000", 6);
      const initialBalance = await mockToken.balanceOf(owner.address);
      
      await expect(
        distributor.connect(owner).emergencyWithdraw(mockToken.target, owner.address, withdrawAmount)
      )
        .to.emit(distributor, "EmergencyWithdraw")
        .withArgs(mockToken.target, owner.address, withdrawAmount);

      const finalBalance = await mockToken.balanceOf(owner.address);
      expect(finalBalance).to.equal(initialBalance + withdrawAmount);
    });
  });

  describe("View Functions", function () {
    let hackathonId: bigint;

    beforeEach(async function () {
      await mockToken.connect(organizer).approve(distributor.target, PRIZE_POOL);
      const tx = await distributor.connect(organizer).createHackathon(mockToken.target, PRIZE_POOL);
      await tx.wait();
      hackathonId = 0n;

      const winners = [winner1.address];
      const amounts = [PRIZE_1];
      await distributor.connect(judge).setPrizes(hackathonId, winners, amounts);
    });

    it("Should return correct canClaim status", async function () {
      expect(await distributor.canClaim(hackathonId, winner1.address)).to.be.true;
      expect(await distributor.canClaim(hackathonId, winner2.address)).to.be.false;
    });

    it("Should return correct prize amount", async function () {
      expect(await distributor.getPrizeAmount(hackathonId, winner1.address)).to.equal(PRIZE_1);
      expect(await distributor.getPrizeAmount(hackathonId, winner2.address)).to.equal(0);
    });
  });
});

