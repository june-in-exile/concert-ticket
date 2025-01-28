# Revolutionizing Concert Ticketing with Blockchain and NFTs

First, deploy the contract according to the guides in [./foundry](./foundry).

For example, to deploy the contract on an Anvil local node, you should first start a local node:

```
$ anvil
```

Then, in a new terminal, you follow these steps to deploy the contract:

```
$ cd foundry
$ source ../.env
$ forge script \
    --rpc-url ${NEXT_PUBLIC_ANVIL_RPC_URL} \
    --private-key ${NEXT_PUBLIC_ANVIL_PRIVATE_KEY} \
    --broadcast \
    script/ticketNFT.deploy.sol:TicketNFTScript
$ cd ..
```

Now you can run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

and open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
