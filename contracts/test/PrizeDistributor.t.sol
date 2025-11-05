// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/PrizeDistributor.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDC is ERC20 {
    constructor() ERC20("Mock USDC", "USDC") {
        _mint(msg.sender, 1000000 * 10**6); // 1M USDC
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}

contract PrizeDistributorTest is Test {
    PrizeDistributor public distributor;
    MockUSDC public usdc;

    address public organizer = address(0x1);
    address public judge = address(0x2);
    address public winner1 = address(0x3);
    address public winner2 = address(0x4);

    function setUp() public {
        usdc = new MockUSDC();
        distributor = new PrizeDistributor();

        distributor.grantRole(distributor.ORGANIZER_ROLE(), organizer);
        distributor.grantRole(distributor.JUDGE_ROLE(), judge);

        usdc.transfer(organizer, 100000 * 10**6); // 100K USDC
    }

    function testCreateHackathon() public {
        vm.startPrank(organizer);
        usdc.approve(address(distributor), 50000 * 10**6);
        distributor.createHackathon(IERC20(address(usdc)), 50000 * 10**6);
        vm.stopPrank();

        (uint256 prizePool, , bool active) = distributor.hackathons(0);
        assertEq(prizePool, 50000 * 10**6);
        assertTrue(active);
    }

    function testSetPrizes() public {
        // Create hackathon
        vm.startPrank(organizer);
        usdc.approve(address(distributor), 50000 * 10**6);
        distributor.createHackathon(IERC20(address(usdc)), 50000 * 10**6);
        vm.stopPrank();

        // Set prizes
        vm.startPrank(judge);
        address[] memory winners = new address[](2);
        winners[0] = winner1;
        winners[1] = winner2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 30000 * 10**6;
        amounts[1] = 20000 * 10**6;

        distributor.setPrizes(0, winners, amounts);
        vm.stopPrank();
    }

    function testClaimPrize() public {
        // Setup hackathon and prizes
        vm.startPrank(organizer);
        usdc.approve(address(distributor), 50000 * 10**6);
        distributor.createHackathon(IERC20(address(usdc)), 50000 * 10**6);
        vm.stopPrank();

        vm.startPrank(judge);
        address[] memory winners = new address[](1);
        winners[0] = winner1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 30000 * 10**6;

        distributor.setPrizes(0, winners, amounts);
        vm.stopPrank();

        // Claim prize
        vm.startPrank(winner1);
        distributor.claimPrize(0);
        vm.stopPrank();

        assertEq(usdc.balanceOf(winner1), 30000 * 10**6);
    }

    function testCannotClaimTwice() public {
        // Setup
        vm.startPrank(organizer);
        usdc.approve(address(distributor), 50000 * 10**6);
        distributor.createHackathon(IERC20(address(usdc)), 50000 * 10**6);
        vm.stopPrank();

        vm.startPrank(judge);
        address[] memory winners = new address[](1);
        winners[0] = winner1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 30000 * 10**6;

        distributor.setPrizes(0, winners, amounts);
        vm.stopPrank();

        // First claim
        vm.startPrank(winner1);
        distributor.claimPrize(0);

        // Second claim should fail
        vm.expectRevert("Already claimed");
        distributor.claimPrize(0);
        vm.stopPrank();
    }
}

