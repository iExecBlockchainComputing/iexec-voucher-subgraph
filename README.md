# voucher-subgraph

A subgraph indexing [`iexec-voucher-contracts`](https://github.com/iExecBlockchainComputing/iexec-voucher-contracts)

## build

```sh
# install deps
npm ci

# generate code from the ABIs
npm run codegen

# build
npm run build
```

## deploy

This repository supports multi-network deployment. All network configurations and values required by the manifest are stored in the `networks.json` file. If you want to add a new network for regular deployment, modify this file. By default, the command `npm run all` deploys a subgraph locally using the `bellecour` network configuration. If you want to override the values for this network or quickly set up a new one, provide the necessary environment variables following the `.env.template`.

Prerequisites:

- `bellecour` RPC node (can be a test node)
- `VoucherHub` contract deployed on RPC node's network
- IPFS node with access to admin API
- graphnode connected to network `bellecour` with access to admin API

NB: you can run a dockerized stack with `npm run start-test-stack` (`npm run stop-test-stack` when done)

env:

- `NETWORK_NAME` (optional): custom graphnode network name (default bellecour)
- `VOUCHER_HUB_ADDRESS` (optional): `VoucherHub` contract address (default value on bellecour)
- `VOUCHER_HUB_START_BLOCK` (optional): start `VoucherHub` indexation block number (default value on bellecour)
- `IPFS_URL` (optional): IPFS admin api url (default `http://localhost:5001`)
- `GRAPHNODE_URL` (optional): graphnode admin api url (default `http://localhost:8020`)

```sh
# set deployment urls
export IPFS_URL="http://localhost:5001"
export GRAPHNODE_URL="http://localhost:8020"

# generate code from the ABIs
npm run codegen

# build
npm run build

# deploy
npm run create
npm run deploy
```

once deployed the subgraph can be queried via the graphiql interface.

## docker subgraph deployer

docker image for deploying the subgraph

### build

```sh
docker build -f docker/Dockerfile . -t voucher-subgraph-deployer
```

### usage

env:

- `NETWORK_NAME` (optional): custom graphnode network name (default bellecour)
- `VOUCHER_HUB_ADDRESS`: `VoucherHub` contract address
- `VOUCHER_HUB_START_BLOCK`: start `VoucherHub` indexation block number
- `IPFS_URL`: IPFS admin api url
- `GRAPHNODE_URL`: graphnode admin api url

```sh
docker run --rm \
  -e NETWORK_NAME=bellecour \
  -e VOUCHER_HUB_ADDRESS="0x3137B6DF4f36D338b82260eDBB2E7bab034AFEda" \
  -e VOUCHER_HUB_START_BLOCK=30306387 \
  -e IPFS_URL="http://ipfs:5001" \
  -e GRAPHNODE_URL="http://graphnode:8020" \
  voucher-subgraph-deployer
```
