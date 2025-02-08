// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Refs of  SBT
// https://learnblockchain.cn/article/6667
// https://github.com/nodejs/docker-node/blob/a35f40787c5c4744ad52af7ba0f55034a7fa3481/20/alpine3.21/Dockerfile
// https://github.com/attestate/ERC5192/blob/main/src/ERC5192.sol

contract TicketNFT is ERC721 {
    uint256 private _nextTokenId;

    event TicketBought(address indexed from, uint256 tokenId);
    event TicketCancelled(address indexed from, uint256 tokenId);

    constructor() ERC721("TicketNFT", "TNFT") {
        _nextTokenId = 1;
    }

    function buyTicket() external {
        uint256 tokenId = _nextTokenId;
        _safeMint(msg.sender, tokenId);
        _nextTokenId++;

        emit TicketBought(msg.sender, tokenId);
    }

    function cancelTicket(uint256 tokenId) external {
        require(isMyTicket(tokenId), "You are not the owner of this ticket");
        _burn(tokenId);

        emit TicketCancelled(msg.sender, tokenId);
    }

    function isMyTicket(uint256 tokenId) public view returns (bool) {
        return (_ownerOf(tokenId) == msg.sender);
    }

    function getMyTickets() external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(msg.sender);
        uint256[] memory ownedTickets = new uint256[](tokenCount);
        uint256 currentIndex = 0;

        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (isMyTicket(i)) {
                ownedTickets[currentIndex++] = i;
            }
        }
        return ownedTickets;
    }
}
