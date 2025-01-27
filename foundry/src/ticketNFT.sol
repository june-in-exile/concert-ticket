// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721, Ownable(msg.sender) {
    uint256 private nextTokenId;
    mapping(uint256 => bool) private validTickets;

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
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this ticket");
        return validTickets[tokenId];
    }

    function getMyTickets() external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(msg.sender);
        uint256[] memory ownedTickets = new uint256[](tokenCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (ownerOf(i) == msg.sender) {
                ownedTickets[currentIndex] = i;
                currentIndex++;
            }
        }

        return ownedTickets;
    }
}
