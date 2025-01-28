# Revolutionizing Concert Ticketing with Blockchain and NFTs

## 1. Update .env

Copy `.env.example` as `.env` and change the values to yours.

``` bash
cp .env.example .env
```

Note that in the first line of `.env` you can choose which chain you would like to use. (default to "ANVIL")

## 2. Build

```
$ cd foundry \
    && forge build
```

## 2-1. Deploy Locally (Anvil)

First, start a local node:

``` bash
$ anvil
```

Then, in a new terminal, follow these steps to deploy the contract:

``` bash
$ source .env \
    && cd foundry \
    && forge script \
    --rpc-url ${NEXT_PUBLIC_ANVIL_RPC_URL} \
    --private-key ${NEXT_PUBLIC_ANVIL_PRIVATE_KEY} \
    --broadcast \
    script/ticketNFT.deploy.sol:TicketNFTScript
```

## 2-2. Deploy on Test Network (Arbitrum Sepolia)

``` bash
$ source .env \
    && cd foundry \
    && forge script \
    --broadcast \
    --verify \
    --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} \
    --etherscan-api-key ${NEXT_PUBLIC_ARBISCAN_API_KEY} \
    --private-key ${NEXT_PUBLIC_PRIVATE_KEY} \
    script/ticketNFT.deploy.sol:TicketNFTScript
```

## 3. Start Frontend & Server

After the deployment, you can run the development server in the root:

```bash
npm run dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.