#!/bin/bash

cd $(dirname $0)
PROJECT_PATH=$(pwd)/..

pwd
cd $PROJECT_PATH
cp schema.graphql.template schema.graphql
cp subgraph.yaml.template subgraph.yaml
shopt -s extglob
rm $PROJECT_PATH/abis/!("Default.json")
rm $PROJECT_PATH/src/!("default.ts")

cd $PROJECT_PATH

./scripts/fetch-abis.sh
npx graph add --abi abis/VoucherHub.json --contract-name VoucherHub --start-block 0 0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
