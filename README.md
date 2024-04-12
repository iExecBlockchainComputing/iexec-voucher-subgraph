# iexec-voucher-subgraph
Subgraph for iExec Voucher contracts.

## Local

- Start node

Inside `iexec-voucher-contracts`,
```
npx hardhat node --hostname 0.0.0.0
```
- Deploy contracts

Inside `iexec-voucher-contracts`,
```
npx hardhat run scripts/deploy.ts --network external-hardhat
```
- Boot local stack, generate config and deploy subgraph

Inside `iexec-voucher-subgraph`,
```
npm i
npm run all-local
```
- Run queries

Go to http://localhost:8000/subgraphs/name/iexec-voucher
