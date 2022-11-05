// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IEventERC1155UriStorage {
    function getNftsIdsOfUser(address minter)
        external
        view
        returns (uint256[] memory);

    function allEvents() external view returns (Event[] memory);

    function createEvent(
        address eventOwner,
        string memory _name,
        string memory _description,
        string memory email,
        string memory _eventUri
    ) external;

    event EventCreated(
        address indexed _owner,
        string _name,
        string _description,
        string _eventUri,
        uint256 indexed _eventId,
        string email
    );

    struct Event {
        string eventName;
        string eventDescription;
        uint256 eventId;
        string eventUri;
        address eventOwner;
        string email;
    }
}
