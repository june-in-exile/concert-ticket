// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TicketNFT is ERC721Enumerable, Ownable(msg.sender) {
    uint256 private _nextTokenId;

    event TicketBuyed(address indexed user, uint256 tokenId);
    event TicketCanceled(address indexed user, uint256 tokenId);

    constructor() ERC721("TicketNFT", "TNFT") {
        _nextTokenId = 1;
    }

    function buyTicket() external {
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _nextTokenId++;

        emit TicketBuyed(msg.sender, tokenId);
    }

    function cancelTicket(uint256 tokenId) external {
        require(isMyTicket(tokenId), "You are not the owner of this ticket");
        _burn(tokenId);

        emit TicketCanceled(msg.sender, tokenId);
    }

    function isMyTicket(uint256 tokenId) public view returns (bool) {
        return (ownerOf(tokenId) == msg.sender);
    }

    function getMyTickets() external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(msg.sender);
        uint256[] memory ownedTickets = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            ownedTickets[i] = tokenOfOwnerByIndex(msg.sender, i);
        }
        return ownedTickets;
    }
}
