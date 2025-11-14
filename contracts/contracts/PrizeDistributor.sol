// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PrizeDistributor
 * @notice Securely distributes hackathon prizes to winners
 * @dev Implements secure prize distribution with access controls and reentrancy protection
 * @dev Gas-optimized batch operations for efficient prize distribution
 */
contract PrizeDistributor is AccessControl, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    struct Hackathon {
        uint256 totalPrizePool;
        IERC20 token; // Prize token (USDC, USDT, etc.)
        bool active;
        uint256 totalAllocated; // Track allocated prizes to prevent over-allocation
        mapping(address => uint256) prizes;
        mapping(address => bool) claimed;
    }

    mapping(uint256 => Hackathon) public hackathons;
    uint256 public hackathonCount;
    uint256 public totalDistributed;

    // Custom errors (gas optimization)
    error InvalidToken();
    error InvalidPrizePool();
    error InvalidAddress();
    error ArrayLengthMismatch();
    error HackathonNotActive();
    error AlreadyClaimed();
    error NoPrizeAllocated();
    error ExceedsPrizePool();
    error InvalidHackathonId();

    event HackathonCreated(
        uint256 indexed hackathonId,
        address indexed token,
        uint256 prizePool,
        address indexed organizer
    );
    
    event PrizesSet(
        uint256 indexed hackathonId,
        address[] winners,
        uint256[] amounts
    );
    
    event PrizeClaimed(
        uint256 indexed hackathonId,
        address indexed winner,
        uint256 amount
    );

    event HackathonDeactivated(uint256 indexed hackathonId);
    event EmergencyWithdraw(
        address indexed token,
        address indexed to,
        uint256 amount
    );

    /**
     * @notice Initialize the contract
     */
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /**
     * @notice Create a new hackathon
     * @param token Prize token address (USDC, USDT, etc.)
     * @param prizePool Total prize pool amount (in token decimals)
     */
    function createHackathon(
        IERC20 token,
        uint256 prizePool
    ) 
        external 
        onlyRole(ORGANIZER_ROLE) 
        whenNotPaused 
        returns (uint256) 
    {
        if (address(token) == address(0)) revert InvalidToken();
        if (prizePool == 0) revert InvalidPrizePool();

        uint256 hackathonId = hackathonCount++;
        Hackathon storage h = hackathons[hackathonId];
        h.totalPrizePool = prizePool;
        h.token = token;
        h.active = true;
        h.totalAllocated = 0;

        // Transfer prize pool to contract (must be pre-approved)
        token.safeTransferFrom(msg.sender, address(this), prizePool);

        emit HackathonCreated(hackathonId, address(token), prizePool, msg.sender);

        return hackathonId;
    }

    /**
     * @notice Set prize amounts for winners (called by judges)
     * @param hackathonId Hackathon ID
     * @param winners Array of winner addresses
     * @param amounts Array of prize amounts (must match winners length)
     */
    function setPrizes(
        uint256 hackathonId,
        address[] calldata winners,
        uint256[] calldata amounts
    ) 
        external 
        onlyRole(JUDGE_ROLE) 
        whenNotPaused 
    {
        if (winners.length != amounts.length) revert ArrayLengthMismatch();
        
        Hackathon storage h = hackathons[hackathonId];
        if (!h.active) revert HackathonNotActive();

        uint256 total = 0;
        uint256 length = winners.length;

        // Gas optimization: unchecked increment in loop
        for (uint256 i = 0; i < length;) {
            address winner = winners[i];
            if (winner == address(0)) revert InvalidAddress();
            
            uint256 amount = amounts[i];
            h.prizes[winner] = amount;
            total += amount;

            unchecked {
                ++i;
            }
        }

        // Check total doesn't exceed prize pool
        uint256 newTotalAllocated = h.totalAllocated + total;
        if (newTotalAllocated > h.totalPrizePool) revert ExceedsPrizePool();
        
        h.totalAllocated = newTotalAllocated;

        emit PrizesSet(hackathonId, winners, amounts);
    }

    /**
     * @notice Update prize amount for a specific winner
     * @param hackathonId Hackathon ID
     * @param winner Winner address
     * @param newAmount New prize amount
     */
    function updatePrize(
        uint256 hackathonId,
        address winner,
        uint256 newAmount
    ) 
        external 
        onlyRole(JUDGE_ROLE) 
        whenNotPaused 
    {
        if (winner == address(0)) revert InvalidAddress();
        
        Hackathon storage h = hackathons[hackathonId];
        if (!h.active) revert HackathonNotActive();

        uint256 oldAmount = h.prizes[winner];
        
        // Update total allocated
        h.totalAllocated = h.totalAllocated - oldAmount + newAmount;
        
        if (h.totalAllocated > h.totalPrizePool) revert ExceedsPrizePool();
        
        h.prizes[winner] = newAmount;

        address[] memory winners = new address[](1);
        uint256[] memory amounts = new uint256[](1);
        winners[0] = winner;
        amounts[0] = newAmount;
        
        emit PrizesSet(hackathonId, winners, amounts);
    }

    /**
     * @notice Claim prize as a winner
     * @param hackathonId Hackathon ID
     */
    function claimPrize(uint256 hackathonId) 
        external 
        nonReentrant 
        whenNotPaused 
    {
        Hackathon storage h = hackathons[hackathonId];
        if (!h.active) revert HackathonNotActive();
        if (h.claimed[msg.sender]) revert AlreadyClaimed();

        uint256 amount = h.prizes[msg.sender];
        if (amount == 0) revert NoPrizeAllocated();

        // Checks-Effects-Interactions pattern
        h.claimed[msg.sender] = true;
        totalDistributed += amount;

        h.token.safeTransfer(msg.sender, amount);

        emit PrizeClaimed(hackathonId, msg.sender, amount);
    }

    /**
     * @notice Batch distribute prizes (gas-optimized for organizers)
     * @param hackathonId Hackathon ID
     * @param winners Array of winner addresses
     */
    function batchDistribute(
        uint256 hackathonId,
        address[] calldata winners
    )
        external
        onlyRole(ORGANIZER_ROLE)
        nonReentrant
        whenNotPaused
    {
        Hackathon storage h = hackathons[hackathonId];
        if (!h.active) revert HackathonNotActive();

        uint256 length = winners.length;
        for (uint256 i = 0; i < length;) {
            address winner = winners[i];
            
            if (!h.claimed[winner] && h.prizes[winner] > 0) {
                uint256 amount = h.prizes[winner];
                h.claimed[winner] = true;
                totalDistributed += amount;
                
                h.token.safeTransfer(winner, amount);
                emit PrizeClaimed(hackathonId, winner, amount);
            }

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Deactivate a hackathon (prevent new claims)
     * @param hackathonId Hackathon ID
     */
    function deactivateHackathon(uint256 hackathonId) 
        external 
        onlyRole(ORGANIZER_ROLE) 
    {
        Hackathon storage h = hackathons[hackathonId];
        h.active = false;
        emit HackathonDeactivated(hackathonId);
    }

    /**
     * @notice Check if prize can be claimed
     * @param hackathonId Hackathon ID
     * @param winner Winner address
     * @return canClaim True if prize can be claimed
     */
    function canClaim(
        uint256 hackathonId,
        address winner
    ) 
        external 
        view 
        returns (bool) 
    {
        Hackathon storage h = hackathons[hackathonId];
        return h.active && !h.claimed[winner] && h.prizes[winner] > 0;
    }

    /**
     * @notice Get prize amount for a winner
     * @param hackathonId Hackathon ID
     * @param winner Winner address
     * @return amount Prize amount
     */
    function getPrizeAmount(
        uint256 hackathonId,
        address winner
    ) 
        external 
        view 
        returns (uint256) 
    {
        return hackathons[hackathonId].prizes[winner];
    }

    /**
     * @notice Get hackathon info (public view)
     * @param hackathonId Hackathon ID
     * @return totalPrizePool Total prize pool
     * @return token Prize token address
     * @return active Whether hackathon is active
     * @return totalAllocated Total prizes allocated
     */
    function getHackathonInfo(uint256 hackathonId)
        external
        view
        returns (
            uint256 totalPrizePool,
            address token,
            bool active,
            uint256 totalAllocated
        )
    {
        Hackathon storage h = hackathons[hackathonId];
        return (h.totalPrizePool, address(h.token), h.active, h.totalAllocated);
    }

    /**
     * @notice Emergency withdraw (admin only)
     * @param token Token to withdraw
     * @param to Recipient address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        IERC20 token,
        address to,
        uint256 amount
    ) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        if (to == address(0)) revert InvalidAddress();
        token.safeTransfer(to, amount);
        emit EmergencyWithdraw(address(token), to, amount);
    }

    /**
     * @notice Pause contract (emergency only)
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    /**
     * @notice Unpause contract
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
}

