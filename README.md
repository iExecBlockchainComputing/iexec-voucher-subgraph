# voucher-subgraph

A subgraph indexing [`iexec-voucher-contracts`](https://github.com/iExecBlockchainComputing/iexec-voucher-contracts)

## Build

```sh
# install deps
npm ci

# generate code from the ABIs
npm run codegen

# build
npm run build
```

## Deploy

This repository supports multi-network deployment. All network configurations and values required by the manifest are stored in the `networks.json` file. If you want to add a new network for regular deployment, modify this file. By default, the command `npm run all` deploys a subgraph locally using the `bellecour` network configuration. If you want to override the values for this network or quickly set up a new one, provide the necessary environment variables following the `.env.template`.

Prerequisites:

- `bellecour` RPC node (can be a test node)
- `VoucherHub` contract deployed on RPC node's network
- IPFS node with access to admin API
- graphnode connected to network `bellecour` with access to admin API

NB: you can run a dockerized stack with `npm run start-test-stack` (`npm run stop-test-stack` when done)

env:

- `NETWORK_NAME` (optional): custom graphnode network name (default bellecour)
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

## Docker subgraph deployer

docker image for deploying the subgraph

### Build Image

```sh
docker build -f docker/Dockerfile . -t voucher-subgraph-deployer
```

### Usage

env:

- `NETWORK_NAME` (optional): custom graphnode network name (default bellecour)
- `IPFS_URL`: IPFS admin api url
- `GRAPHNODE_URL`: graphnode admin api url

```sh
docker run --rm \
  -e NETWORK_NAME=bellecour \
  -e IPFS_URL="http://ipfs:5001" \
  -e GRAPHNODE_URL="http://graphnode:8020" \
  voucher-subgraph-deployer
```

## Continuous Integration (CI) Workflows

### Manual Workflow Triggers

#### Deploying Subgraph

To manually deploy the subgraph to a specific environment:

1. Go to the GitHub Actions tab in the repository
2. Select the "Deploy Subgraph" workflow
3. Click "Run workflow"
4. Choose the deployment options:
   - **Environment**: Select from `staging`, `prod`, `tmp`, or `custom`
   - **Network Name**: Default is `bellecour`, but can be customized
   - **Version Label**: Defaults to `develop`

#### Building and Push Docker Image

To manually build and push the Docker image:

1. Go to the GitHub Actions tab
2. Select the "Build and Push Subgraph Deployer Docker Image" workflow
3. Click "Run workflow"
   - This will trigger a build using the latest Git tag (if available) or a development tag by default.
4. Once completed, a new Docker image will be available under the `iexechub` Docker Hub organization.

Note: This CI will also be trigger automatically on a tag publication
