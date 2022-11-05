// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../interfaces/IEventERC1155UriStorage.sol";

contract EventERC1155UriStorage is
    ERC1155Upgradeable,
    AccessControlUpgradeable,
    IEventERC1155UriStorage,
    UUPSUpgradeable,
    PausableUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;

    string public name;
    string public symbol;

    string public baseFolderURIHash;
    string public baseFilename;
    string public baseExtension;

    string private _baseURIextended;

    CountersUpgradeable.Counter private _eventIdCounter;

    Event[] public events;

    mapping(uint256 => string) private _uris;

    mapping(address => uint256[]) private userNFTs;

    mapping(uint256 => bool) private isEventNftsMinted;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC1155_init(
            string(
                abi.encodePacked(
                    "ipfs://",
                    baseFolderURIHash,
                    "/",
                    baseFilename,
                    "0",
                    baseExtension
                )
            )
        );
        __AccessControl_init();
        __UUPSUpgradeable_init();
        __Pausable_init();
        name = "Events NFT";
        symbol = "EVNFT";
        baseFolderURIHash = "QmWinYKyWWRFHShCsTPtdqkHkPQHBf7XT7VTrPReXxquRc";
        baseFilename = "lion";
        baseExtension = ".json";
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        events.push(Event("", "", 0, "", address(0), ""));
        // _mint(_msgSender(), 1, 10, "");
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        virtual
        override
        onlyRole(DEFAULT_ADMIN_ROLE)
        whenPaused
    {}

    function setBaseURI(string memory baseURI_)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        _baseURIextended = baseURI_;
    }

    function _baseURI() public view returns (string memory) {
        return _baseURIextended;
    }

    function uri(uint256 _tokenId)
        public
        view
        override
        returns (string memory tokenUri)
    {
        string memory _tokenURI = _uris[_tokenId];
        string memory base = _baseURI();

        if (bytes(base).length == 0) {
            return _tokenURI;
        }

        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
    }

    function setTokenUri(uint256 _tokenId, string memory _uri)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        require(bytes(_uris[_tokenId]).length == 0, "Cannot set uri twice");
        _uris[_tokenId] = _uri;
    }

    function createEvent(
        address eventOwner,
        string memory _name,
        string memory _description,
        string memory email,
        string memory _eventUri
    ) external override onlyRole(DEFAULT_ADMIN_ROLE) {
        _eventIdCounter.increment();
        events.push(
            Event(
                _name,
                _description,
                _eventIdCounter.current(),
                _eventUri,
                eventOwner,
                email
            )
        );
        setTokenUri(_eventIdCounter.current(), _eventUri);
        emit EventCreated(
            eventOwner,
            _name,
            _description,
            _eventUri,
            _eventIdCounter.current(),
            email
        );
    }

    function addUserToEvent(address[] memory _to, uint256 _id)
        external
        onlyEventOwner(_id)
        whenNotPaused
    {
        require(isEventNftsMinted[_id] == false, "Nfts already minted");
        for (uint256 i = 0; i < _to.length; i++) {
            if (balanceOf(_to[i], _id) == 0) {
                _mint(_to[i], _id, 1, "");
                userNFTs[_to[i]].push(_id);
            }
        }
        isEventNftsMinted[_id] = true;
    }

    function getNftsIdsOfUser(address minter)
        external
        view
        override
        returns (uint256[] memory)
    {
        return userNFTs[minter];
    }

    function getIsEventNftsMinted(uint256 _eventId)
        external
        view
        returns (bool isEventMinted)
    {
        return isEventNftsMinted[_eventId];
    }

    function allEvents() external view override returns (Event[] memory) {
        return events;
    }

    /**
     * @notice Pauses the whole contract; used as emergency response
     */
    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused {
        _pause();
    }

    /**
     * @notice unpauses the contract; resumes functionality.
     */
    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) whenPaused {
        _unpause();
    }

    /**
     * @notice returns true if a given interface is supported
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, AccessControlUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    modifier onlyEventOwner(uint256 _id) {
        require(
            events[_id].eventOwner == _msgSender(),
            "Only event owner can set event minters"
        );
        _;
    }
}
