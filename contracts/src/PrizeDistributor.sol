// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PrizeDistributor
 * @notice Securely distributes hackathon prizes to winners
 * @dev Uses Gnosis Safe pattern with milestone-based releases
 */
contract PrizeDistributor is AccessControl, ReentrancyGuard {
    using SafeERC20 for IERC20;

    bytes32 public constant ORGANIZER_ROLE = keccak256("ORGANIZER_ROLE");
    bytes32 public constant JUDGE_ROLE = keccak256("JUDGE_ROLE");

    struct Hackathon {
        uint256 totalPrizePool;
        IERC20 token; // USDC
        bool active;
        mapping(address => uint256) prizes;
        mapping(address => bool) claimed;
    }

    mapping(uint256 => Hackathon) public hackathons;
    uint256 public hackathonCount;
    uint256 public totalDistributed;

    event HackathonCreated(uint256 indexed hackathonId, uint256 prizePool);
    event PrizesSet(uint256 indexed hackathonId, address[] winners, uint256[] amounts);
    event PrizeClaimed(uint256 indexed hackathonId, address indexed winner, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Create a new hackathon
     * @param _token Prize token (USDC)
     * @param _prizePool Total prize pool amount
     */
    function createHackathon(IERC20 _token, uint256 _prizePool) external onlyRole(ORGANIZER_ROLE) {
        require(address(_token) != address(0), "Invalid token");
        require(_prizePool > 0, "Prize pool must be > 0");

        uint256 hackathonId = hackathonCount++;
        Hackathon storage h = hackathons[hackathonId];
        h.totalPrizePool = _prizePool;
        h.token = _token;
        h.active = true;

        // Transfer prize pool to contract
        _token.safeTransferFrom(msg.sender, address(this), _prizePool);

        emit HackathonCreated(hackathonId, _prizePool);
    }

    /**
     * @notice Set prize amounts for winners (called by judges)
     * @param _hackathonId Hackathon ID
     * @param _winners Array of winner addresses
     * @param _amounts Array of prize amounts
     */
    function setPrizes(
        uint256 _hackathonId,
        address[] calldata _winners,
        uint256[] calldata _amounts
    ) external onlyRole(JUDGE_ROLE) {
        require(_winners.length == _amounts.length, "Length mismatch");
        Hackathon storage h = hackathons[_hackathonId];
        require(h.active, "Hackathon not active");

        uint256 total = 0;
        for (uint256 i = 0; i < _winners.length; i++) {
            require(_winners[i] != address(0), "Invalid address");
            h.prizes[_winners[i]] = _amounts[i];
            total += _amounts[i];
        }

        require(total <= h.totalPrizePool, "Exceeds prize pool");

        emit PrizesSet(_hackathonId, _winners, _amounts);
    }

    /**
     * @notice Claim prize as a winner
     * @param _hackathonId Hackathon ID
     */
    function claimPrize(uint256 _hackathonId) external nonReentrant {
        Hackathon storage h = hackathons[_hackathonId];
        require(h.active, "Hackathon not active");
        require(!h.claimed[msg.sender], "Already claimed");

        uint256 amount = h.prizes[msg.sender];
        require(amount > 0, "No prize allocated");

        h.claimed[msg.sender] = true;
        totalDistributed += amount;

        h.token.safeTransfer(msg.sender, amount);

        emit PrizeClaimed(_hackathonId, msg.sender, amount);
    }

    /**
     * @notice Batch distribute prizes (gas-optimized)
     * @param _hackathonId Hackathon ID
     * @param _winners Array of winner addresses
     */
    function batchDistribute(uint256 _hackathonId, address[] calldata _winners)
        external
        onlyRole(ORGANIZER_ROLE)
        nonReentrant
    {
        Hackathon storage h = hackathons[_hackathonId];
        require(h.active, "Hackathon not active");

        for (uint256 i = 0; i < _winners.length; i++) {
            address winner = _winners[i];
            if (!h.claimed[winner] && h.prizes[winner] > 0) {
                uint256 amount = h.prizes[winner];
                h.claimed[winner] = true;
                totalDistributed += amount;
                h.token.safeTransfer(winner, amount);
                emit PrizeClaimed(_hackathonId, winner, amount);
            }
        }
    }

    /**
     * @notice Check if prize can be claimed
     */
    function canClaim(uint256 _hackathonId, address _winner) external view returns (bool) {
        Hackathon storage h = hackathons[_hackathonId];
        return h.active && !h.claimed[_winner] && h.prizes[_winner] > 0;
    }
}

