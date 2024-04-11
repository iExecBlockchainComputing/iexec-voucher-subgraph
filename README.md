# iexec-voucher-subgraph
Subgraph for iExec Voucher contracts.

## Local

- Start node

From `iexec-voucher-contracts`,
```
npx hardhat node --hostname 0.0.0.0
```
- Deploy contracts

From `iexec-voucher-contracts`,
```
npx hardhat run scripts/deploy.ts --network external-hardhat
```
- Boot local stack, generate config and deploy subgraph

From `iexec-voucher-subgraph`,
```
npm i
npm run all-local
```
- Run queries

Go to http://localhost:8000/subgraphs/name/iexec-voucher
