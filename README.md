# Revolutionizing Concert Ticketing with Blockchain and NFTs

## 1. Update .env

Copy `.env.example` as `.env` and change the values to yours.

```bash
$ cp .env.example .env
```

Note that in the first line of `.env` you can choose which chain you would like to use (default to "ANVIL", which is for local testing).

## 2. Fork Arbitrum Sepolia

_(This step is required only for local testing.)_

```bash
$ source .env \
    && anvil --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} --chain-id 31337
```

## 3. Build & Deploy

_(Skip this step if the `NEXT_PUBLIC_CONTRACT_ADDRESS` field in `.env`. is already filled.)_

```bash
$ source .env
```

Build.

```
$ cd foundry \
    && forge build
```

> ### 3-1. Deploy on Arbitrum Sepolia
>
> ```bash
> $ cd foundry \
>     && forge script \
>     --broadcast \
>     --verify \
>     --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} \
>     --etherscan-api-key ${NEXT_PUBLIC_ARBISCAN_API_KEY} \
>     --private-key ${NEXT_PUBLIC_PRIVATE_KEY} \
>     script/ticketNFT.deploy.sol:TicketNFTScript
> ```
>
> ### 3-2. Deploy on Forked Arbitrum Sepolia
>
> ```bash
> $ cd foundry \
>     && forge script \
>     --rpc-url ${NEXT_PUBLIC_ANVIL_RPC_URL} \
>     --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} \
>     --broadcast \
>     script/ticketNFT.deploy.sol:TicketNFTScript
> ```

Remember to update the `NEXT_PUBLIC_CONTRACT_ADDRESS` field in `.env` after the deployment.

## 4. Start Frontend & Server

Run the development server:

```bash
$ npm run dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result. After logging, fill the `NEXT_PUBLIC_W3A_ACCOUNT` field in `.env` with your Web3Auth address.

## 5. Interact with the Contract on Forked Arbitrum Sepolia

_(This step is required only for local testing.)_

_(To interact with the actual Arbituem Sepolia, add `--rpc-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL}` in the end of the command.)_

```bash
$ source .env
```

Send 1 ETH from Alice (a simulated account in Anvil) to your Web3Auth account:

```bash
$ cast send --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} ${NEXT_PUBLIC_W3A_ACCOUNT} --value 1ether
```

Check your ETH balance:

```bash
$ cast balance ${NEXT_PUBLIC_W3A_ACCOUNT}
```

Buy ticket

```bash
$ cast send --from ${NEXT_PUBLIC_W3A_ACCOUNT} --private-key ${NEXT_PUBLIC_W3A_PRIVATE_KEY} ${NEXT_PUBLIC_CONTRACT_ADDRESS} "buyTicket()"
```

Validate the ticket

```bash
$ cast call --from ${NEXT_PUBLIC_W3A_ACCOUNT} ${NEXT_PUBLIC_CONTRACT_ADDRESS} "isMyTicket(uint256)(bool)" <tokenId>
```

Cancel the ticket

```bash
$ cast send --from ${NEXT_PUBLIC_W3A_ACCOUNT} --private-key ${NEXT_PUBLIC_W3A_PRIVATE_KEY} ${NEXT_PUBLIC_CONTRACT_ADDRESS} "cancelTicket(uint256)" <tokenId>
```

Get your tickets

```bash
$ cast call --from ${NEXT_PUBLIC_W3A_ACCOUNT} ${NEXT_PUBLIC_CONTRACT_ADDRESS} "getMyTickets()(uint256[])"
```

Check your number of tickets

```bash
$ cast call ${NEXT_PUBLIC_CONTRACT_ADDRESS} "balanceOf(address)(uint256)" ${NEXT_PUBLIC_W3A_ACCOUNT}
```

Check the owner of a ticket:

```bash
$ cast call ${NEXT_PUBLIC_CONTRACT_ADDRESS} "ownerOf(uint256)(address)" <tokenId>
```

Check the name of the Ticket NFT:

```bash
$ cast call ${NEXT_PUBLIC_CONTRACT_ADDRESS} "name()(string)"
# "TicketNFT"
```

Check the symbol of the Ticket NFT:

```bash
$ cast call ${NEXT_PUBLIC_CONTRACT_ADDRESS} "symbol()(string)"
# "TNFT"
```
