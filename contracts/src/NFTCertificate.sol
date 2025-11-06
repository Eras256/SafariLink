// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NFTCertificate
 * @notice Soulbound NFTs for hackathon participation & wins
 * @dev Non-transferable certificates
 */
contract NFTCertificate is ERC721, AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    Counters.Counter private _tokenIds;

    struct Certificate {
        uint256 hackathonId;
        string hackathonName;
        string achievement; // "Participant", "Winner", "1st Place", "Badge Name"
        string badgeType; // "CERTIFICATE", "BADGE", "CHALLENGE"
        uint256 timestamp;
    }

    mapping(uint256 => Certificate) public certificates;
    mapping(address => uint256[]) public ownerCertificates;
    mapping(address => mapping(string => uint256[])) public ownerBadges; // address => badgeType => tokenIds

    string public baseURI;

    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 hackathonId,
        string achievement
    );

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        uint256 hackathonId,
        string badgeName,
        string rarity
    );

    constructor(string memory _baseURI) ERC721("SafariLink Certificate", "SLC") {
        baseURI = _baseURI;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @notice Mint certificate to participant/winner
     * @param _to Recipient address
     * @param _hackathonId Hackathon ID
     * @param _hackathonName Hackathon name
     * @param _achievement Achievement type
     */
    function mint(
        address _to,
        uint256 _hackathonId,
        string memory _hackathonName,
        string memory _achievement
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(_to, newTokenId);

        certificates[newTokenId] = Certificate({
            hackathonId: _hackathonId,
            hackathonName: _hackathonName,
            achievement: _achievement,
            badgeType: "CERTIFICATE",
            timestamp: block.timestamp
        });

        ownerCertificates[_to].push(newTokenId);

        emit CertificateMinted(newTokenId, _to, _hackathonId, _achievement);

        return newTokenId;
    }

    /**
     * @notice Mint badge NFT as reward
     * @param _to Recipient address
     * @param _hackathonId Hackathon ID
     * @param _hackathonName Hackathon name
     * @param _badgeName Badge name
     * @param _rarity Badge rarity (COMMON, RARE, EPIC, LEGENDARY)
     */
    function mintBadge(
        address _to,
        uint256 _hackathonId,
        string memory _hackathonName,
        string memory _badgeName,
        string memory _rarity
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _safeMint(_to, newTokenId);

        certificates[newTokenId] = Certificate({
            hackathonId: _hackathonId,
            hackathonName: _hackathonName,
            achievement: _badgeName,
            badgeType: "BADGE",
            timestamp: block.timestamp
        });

        ownerCertificates[_to].push(newTokenId);
        ownerBadges[_to][_rarity].push(newTokenId);

        emit BadgeMinted(newTokenId, _to, _hackathonId, _badgeName, _rarity);

        return newTokenId;
    }

    /**
     * @notice Get all badges owned by address
     * @param _owner Owner address
     * @param _rarity Badge rarity (optional, empty string for all)
     */
    function getBadges(address _owner, string memory _rarity) external view returns (uint256[] memory) {
        if (bytes(_rarity).length == 0) {
            return ownerCertificates[_owner];
        }
        return ownerBadges[_owner][_rarity];
    }

    /**
     * @notice Batch mint certificates (gas-optimized)
     */
    function batchMint(
        address[] calldata _recipients,
        uint256 _hackathonId,
        string memory _hackathonName,
        string memory _achievement
    ) external onlyRole(MINTER_ROLE) {
        for (uint256 i = 0; i < _recipients.length; i++) {
            mint(_recipients[i], _hackathonId, _hackathonName, _achievement);
        }
    }

    /**
     * @notice Get all certificates owned by address
     */
    function getCertificates(address _owner) external view returns (uint256[] memory) {
        return ownerCertificates[_owner];
    }

    /**
     * @notice Override transfers to make soulbound
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(from == address(0), "Soulbound: transfer not allowed");
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory _newBaseURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newBaseURI;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

