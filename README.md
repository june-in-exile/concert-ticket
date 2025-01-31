# Revolutionizing Concert Ticketing with Blockchain and NFTs

## 1. Update .env

Copy `.env.example` as `.env` and change the values to yours.

```bash
$ cp .env.example .env
$ source .env
```

Note that in the first line of `.env` you can choose which chain you would like to use (default to "ANVIL", which is for local testing).

## 2. Fork Arbitrum Sepolia

_(This step is required only for local testing.)_

```bash
$ anvil --fork-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL}
```

## 3. Build & Deploy

_(Skip this step if the `NEXT_PUBLIC_CONTRACT_ADDRESS` field in `.env`. is already filled.)_

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

Remember to update the `NEXT_PUBLIC_CONTRACT_ADDRESS` field in `.env` after the deployment and choose the corresponding `NEXT_PUBLIC_CHAIN`. Then, run

```bash
$ source .env
```

## 4. Start Frontend & Server

Run the development server:

```bash
npm run dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 5. Send Tokens on Forked Arbitrum Sepolia

_(This step is required only for local testing.)_

After logging, fill the `NEXT_PUBLIC_GMAIL_ACCOUNT` field in `.env` with your account created through Gmail (which you can get from the URL) and run

```bash
$ source .env
```

Send 1 ETH to your account created through Gmail:

```bash
$ cast send --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} ${NEXT_PUBLIC_GMAIL_ACCOUNT} --value 1ether
```

Check your ETH balance:

```bash
$ cast balance ${NEXT_PUBLIC_GMAIL_ACCOUNT}
```

Send 10 USDC:

```bash
$ cast rpc anvil_impersonateAccount ${NEXT_PUBLIC_ANVIL_ALICE}
```

Check your USDC balance:

```bash
$ cast call ${NEXT_PUBLIC_USDC} "balanceOf(address)(uint256)" ${NEXT_PUBLIC_GMAIL_ACCOUNT}
```
