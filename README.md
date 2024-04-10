# iexec-voucher-subgraph
Subgraph for iExec Voucher contracts

## Local

- Start node from `iexec-voucher-contracts`:

`npx hardhat node --hostname 0.0.0.0`
- Deploy contracts from `iexec-voucher-contracts`:

`npx hardhat run scripts/deploy.ts --network external-hardhat`
- Deploy subgraph from current repository:

`./scripts/deploy-subgraph.sh`

- Test queries on http://localhost:8000/subgraphs/name/iexec-voucher
