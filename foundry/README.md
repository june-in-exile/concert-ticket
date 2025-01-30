## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

- **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
- **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
- **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
- **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy to Anvil

```shell
$ source ../.env
$ forge script \
    --rpc-url ${NEXT_PUBLIC_ANVIL_RPC_URL} \
    --private-key ${NEXT_PUBLIC_ANVIL_ALICE_PRIVATE_KEY} \
    --broadcast \
    script/ticketNFT.deploy.sol:TicketNFTScript
```

### Deploy to Arbitrum Sepolia & Verify Automatically

```shell
$ source ../.env
$ forge script \
    --broadcast \
    --verify \
    --rpc-url ${NEXT_PUBLIC_ARB_SEPOLIA_RPC_URL} \
    --etherscan-api-key ${NEXT_PUBLIC_ARBISCAN_API_KEY} \
    --private-key ${NEXT_PUBLIC_PRIVATE_KEY}
    script/ticketNFT.deploy.sol:TicketNFTScript
```

### Verify Deployed Contract on Arbitrum Sepolia

```shell
$ source ../.env
$ forge verify-contract \
    --chain-id ${NEXT_PUBLIC_ARB_SEPOLIA_CHAIN_ID} \
    --num-of-optimizations 1000000 \
    --watch \
    --constructor-args $(cast abi-encode "constructor()") \
    --etherscan-api-key ${NEXT_PUBLIC_ARBISCAN_API_KEY} \
    ${NEXT_PUBLIC_ARB_SEPOLIA_CONTRACT_ADDRESS} \
    src/ticketNFT.sol:TicketNFT
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
