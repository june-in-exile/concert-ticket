// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721, Ownable(msg.sender) {
    uint256 public nextTokenId;
    mapping(uint256 => bool) public validTickets;

    constructor() ERC721("TicketNFT", "TNFT") {}

    function buyTicket() external {
        uint256 tokenId = nextTokenId;
        _safeMint(msg.sender, tokenId);
        validTickets[tokenId] = true;
        nextTokenId++;
    }

    function cancelTicket(uint256 tokenId) external {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this ticket");
        require(validTickets[tokenId], "Ticket is already invalid");
        validTickets[tokenId] = false;
    }

    function isTicketValid(uint256 tokenId) external view returns (bool) {
        return validTickets[tokenId];
    }
}
