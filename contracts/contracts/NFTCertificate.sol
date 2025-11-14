// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title NFTCertificate
 * @notice Soulbound NFTs (SBTs) for hackathon participation & achievements
 * @dev Implements EIP-5192 for soulbound token standard
 * @dev Non-transferable certificates that represent achievements
 */
contract NFTCertificate is ERC721, AccessControl, Pausable, ReentrancyGuard {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Token ID counter (replaces deprecated Counters)
    uint256 private _nextTokenId;

    struct Certificate {
        uint256 hackathonId;
        string hackathonName;
        string achievement; // "Participant", "Winner", "1st Place", "Badge Name"
        string badgeType; // "CERTIFICATE", "BADGE", "CHALLENGE"
        uint256 timestamp;
    }

    // Storage optimizations: pack structs where possible
    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) private _ownerCertificates;
    mapping(address => mapping(string => uint256[])) private _ownerBadges; // address => badgeType => tokenIds
    mapping(address => uint256) private _ownerCertificateCount; // Gas optimization: avoid array length

    string private _baseTokenURI;

    // EIP-5192: Soulbound Token Interface
    event Locked(uint256 indexed tokenId);
    event Unlocked(uint256 indexed tokenId);

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 indexed hackathonId,
        string achievement
    );

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 indexed hackathonId,
        string badgeName,
        string rarity
    );

    event BaseURIUpdated(string newBaseURI);

    error SoulboundToken();
    error InvalidAddress();
    error InvalidTokenId();
    error ArrayLengthMismatch();

    /**
     * @notice Initialize the contract
     * @param baseURI_ Base URI for token metadata
     */
    constructor(string memory baseURI_) ERC721("SafariLink Certificate", "SLC") {
        _baseTokenURI = baseURI_;
        _nextTokenId = 1; // Start from 1
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }

    /**
     * @notice Mint certificate to participant/winner
     * @param to Recipient address
     * @param hackathonId Hackathon ID
     * @param hackathonName Hackathon name
     * @param achievement Achievement type
     * @return tokenId The minted token ID
     */
    function mint(
        address to,
        uint256 hackathonId,
        string calldata hackathonName,
        string calldata achievement
    ) 
        external 
        onlyRole(MINTER_ROLE) 
        whenNotPaused 
        nonReentrant 
        returns (uint256) 
    {
        if (to == address(0)) revert InvalidAddress();

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        certificates[tokenId] = Certificate({
            hackathonId: hackathonId,
            hackathonName: hackathonName,
            achievement: achievement,
            badgeType: "CERTIFICATE",
            timestamp: block.timestamp
        });

        _ownerCertificates[to].push(tokenId);
        _ownerCertificateCount[to]++;

        emit CertificateMinted(tokenId, to, hackathonId, achievement);
        emit Locked(tokenId); // EIP-5192

        return tokenId;
    }

    /**
     * @notice Mint badge NFT as reward
     * @param to Recipient address
     * @param hackathonId Hackathon ID
     * @param hackathonName Hackathon name
     * @param badgeName Badge name
     * @param rarity Badge rarity (COMMON, RARE, EPIC, LEGENDARY)
     * @return tokenId The minted token ID
     */
    function mintBadge(
        address to,
        uint256 hackathonId,
        string calldata hackathonName,
        string calldata badgeName,
        string calldata rarity
    ) 
        external 
        onlyRole(MINTER_ROLE) 
        whenNotPaused 
        nonReentrant 
        returns (uint256) 
    {
        if (to == address(0)) revert InvalidAddress();

        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);

        certificates[tokenId] = Certificate({
            hackathonId: hackathonId,
            hackathonName: hackathonName,
            achievement: badgeName,
            badgeType: "BADGE",
            timestamp: block.timestamp
        });

        _ownerCertificates[to].push(tokenId);
        _ownerBadges[to][rarity].push(tokenId);
        _ownerCertificateCount[to]++;

        emit BadgeMinted(tokenId, to, hackathonId, badgeName, rarity);
        emit Locked(tokenId); // EIP-5192

        return tokenId;
    }

    /**
     * @notice Batch mint certificates (gas-optimized)
     * @param recipients Array of recipient addresses
     * @param hackathonId Hackathon ID
     * @param hackathonName Hackathon name
     * @param achievement Achievement type
     */
    function batchMint(
        address[] calldata recipients,
        uint256 hackathonId,
        string calldata hackathonName,
        string calldata achievement
    ) 
        external 
        onlyRole(MINTER_ROLE) 
        whenNotPaused 
        nonReentrant 
    {
        uint256 length = recipients.length;
        if (length == 0) revert ArrayLengthMismatch();

        for (uint256 i = 0; i < length;) {
            if (recipients[i] == address(0)) revert InvalidAddress();
            
            uint256 tokenId = _nextTokenId++;
            _safeMint(recipients[i], tokenId);

            certificates[tokenId] = Certificate({
                hackathonId: hackathonId,
                hackathonName: hackathonName,
                achievement: achievement,
                badgeType: "CERTIFICATE",
                timestamp: block.timestamp
            });

            _ownerCertificates[recipients[i]].push(tokenId);
            _ownerCertificateCount[recipients[i]]++;

            emit CertificateMinted(tokenId, recipients[i], hackathonId, achievement);
            emit Locked(tokenId);

            unchecked {
                ++i;
            }
        }
    }

    /**
     * @notice Get all badges owned by address
     * @param owner Owner address
     * @param rarity Badge rarity (optional, empty string for all)
     * @return tokenIds Array of token IDs
     */
    function getBadges(address owner, string calldata rarity) 
        external 
        view 
        returns (uint256[] memory) 
    {
        if (bytes(rarity).length == 0) {
            return _ownerCertificates[owner];
        }
        return _ownerBadges[owner][rarity];
    }

    /**
     * @notice Get all certificates owned by address
     * @param owner Owner address
     * @return tokenIds Array of token IDs
     */
    function getCertificates(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return _ownerCertificates[owner];
    }

    /**
     * @notice Get certificate count for an address (gas-optimized)
     * @param owner Owner address
     * @return count Number of certificates owned
     */
    function getCertificateCount(address owner) 
        external 
        view 
        returns (uint256) 
    {
        return _ownerCertificateCount[owner];
    }

    /**
     * @notice Get certificate details by token ID
     * @param tokenId Token ID
     * @return certificate Certificate struct
     */
    function getCertificate(uint256 tokenId) 
        external 
        view 
        returns (Certificate memory) 
    {
        if (ownerOf(tokenId) == address(0)) revert InvalidTokenId();
        return certificates[tokenId];
    }

    /**
     * @notice Override transfers to make soulbound (EIP-5192)
     * @dev Prevents all transfers except minting
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Only allow minting (from == address(0))
        if (from != address(0)) {
            revert SoulboundToken();
        }
        
        return super._update(to, tokenId, auth);
    }

    /**
     * @notice Override approve to prevent approvals
     */
    function approve(address, uint256) public pure override {
        revert SoulboundToken();
    }

    /**
     * @notice Override setApprovalForAll to prevent approvals
     */
    function setApprovalForAll(address, bool) public pure override {
        revert SoulboundToken();
    }

    /**
     * @notice EIP-5192: Check if token is locked (soulbound)
     * @return locked Always returns true for soulbound tokens
     */
    function locked(uint256 /* tokenId */) external pure returns (bool) {
        return true; // All tokens are permanently locked
    }

    /**
     * @notice Get base URI
     * @return Base URI string
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Get base URI (public view)
     * @return Base URI string
     */
    function baseURI() external view returns (string memory) {
        return _baseTokenURI;
    }

    /**
     * @notice Set base URI (admin only)
     * @param newBaseURI New base URI
     */
    function setBaseURI(string calldata newBaseURI) 
        external 
        onlyRole(DEFAULT_ADMIN_ROLE) 
    {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
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

    /**
     * @notice Get next token ID
     * @return Next token ID that will be minted
     */
    function nextTokenId() external view returns (uint256) {
        return _nextTokenId;
    }

    /**
     * @notice Supports interface check
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

