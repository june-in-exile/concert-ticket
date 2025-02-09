# Revolutionizing Concert Ticketing with Blockchain and Soulbound NFTs

## Prerequisite: Update .env

Copy `.env.example` as `.env` and change the values to yours.

```bash
$ cp .env.example .env
```

Note that in the first line of `.env` you can choose which chain you would like to use (default to "ARB_SEPOLIA", while "ANVIL" is for local testing).

## Run on Localhost

### Environment Settings

- Node v20.17.0
- npm v10.9.0

### 1. Fork Arbitrum Sepolia

_(This step is required only for local testing.)_

```bash
$ source .env \
    && anvil --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} --chain-id 31337
```

### 2. Build & Deploy

_(Skip this step if the `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` field in `.env`. is already set.)_

```bash
$ source .env
```

Build.

```
$ cd foundry \
    && forge build
```

Deploy.

> ### Deploy on Arbitrum Sepolia
>
> ```bash
> $ forge script \
>     --broadcast \
>     --verify \
>     --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} \
>     --etherscan-api-key ${NEXT_PUBLIC_ARBISCAN_API_KEY} \
>     --private-key ${NEXT_PUBLIC_PRIVATE_KEY} \
>     script/ticketSBT.deploy.sol:TicketSBTScript
> ```
>
> ### Deploy on Forked Arbitrum Sepolia (for local testing)
>
> ```bash
> $ forge script \
>     --rpc-url ${NEXT_PUBLIC_ANVIL_RPC_URL} \
>     --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} \
>     --broadcast \
>     script/ticketSBT.deploy.sol:TicketSBTScript
> ```

Remember to update the `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` field in `.env` with the new contract address.

Also, update the contract abi:

```bash
$ cp foundry/out/ticketSBT.sol/TicketSBT.json app/ticket/TicketSBT.json
```

### 3. Start Frontend & Server

Run the development server:

```bash
$ npm install
$ npm run dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result. After logging, fill the `NEXT_PUBLIC_ANVIL_ACCOUNT` field in `.env` with your Web3Auth address.

## Run in Docker

Alternatively, you can run this app in docker and interact with the contarct deployed on Arbitrum Sepolia. Ensure that in `.env`:

- [ ] NEXT_PUBLIC_CHAIN="ARB_SEPOLIA"
- [ ] `NEXT_PUBLIC_SBT_CONTRACT_ADDRESS` is set.
- [ ] `NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL` is set.

Then,

```bash
$ docker build -t concert-ticket .
$ docker run -p 3000:3000 concert-ticket
```

## Commands to Interact with Forked Arbitrum Sepolia

_(To interact with the actual Arbituem Sepolia, add `--rpc-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL}` in the end of the command.)_

```bash
$ source .env
```

Send 1 ETH from Alice (a simulated account in Anvil) to your Web3Auth account:

```bash
$ cast send --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} ${NEXT_PUBLIC_ANVIL_ACCOUNT} --value 1ether
```

Check your ETH balance:

```bash
$ cast balance ${NEXT_PUBLIC_ANVIL_ACCOUNT}
```

Buy ticket

```bash
$ cast send --from ${NEXT_PUBLIC_ANVIL_ACCOUNT} --private-key ${NEXT_PUBLIC_ANVIL_PRIVATE_KEY} ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "buyTicket()"
```

Validate the ticket

```bash
$ cast call --from ${NEXT_PUBLIC_ANVIL_ACCOUNT} ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "isMyTicket(uint256)(bool)" <tokenId>
```

Cancel the ticket

```bash
$ cast send --from ${NEXT_PUBLIC_ANVIL_ACCOUNT} --private-key ${NEXT_PUBLIC_ANVIL_PRIVATE_KEY} ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "cancelTicket(uint256)" <tokenId>
```

Get your tickets

```bash
$ cast call --from ${NEXT_PUBLIC_ANVIL_ACCOUNT} ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "getMyTickets()(uint256[])"
```

Check your number of tickets

```bash
$ cast call ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "balanceOf(address)(uint256)" ${NEXT_PUBLIC_ANVIL_ACCOUNT}
```

Check the owner of a ticket:

```bash
$ cast call ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "ownerOf(uint256)(address)" <tokenId>
```

Transfer a ticket to Alice (should fail since it's soulbound):

```bash
$ cast send --from ${NEXT_PUBLIC_ANVIL_ACCOUNT} --private-key ${NEXT_PUBLIC_ANVIL_PRIVATE_KEY} ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "safeTransferFrom(address,address,uint256)" ${NEXT_PUBLIC_ANVIL_ACCOUNT} ${NEXT_PUBLIC_ANVIL_ALICE} <tokenId>
```

Check the name of the Ticket SBT:

```bash
$ cast call ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "name()(string)"
# "TicketSBT"
```

Check the symbol of the Ticket SBT:

```bash
$ cast call ${NEXT_PUBLIC_SBT_CONTRACT_ADDRESS} "symbol()(string)"
# "TSBT"
```
