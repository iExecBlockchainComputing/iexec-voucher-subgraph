#!/bin/bash
SCRIPTS_PATH="$(dirname "$0")"
cd "$SCRIPTS_PATH/.." || exit # Go to project path
shopt -s extglob              # required for "rm !"
rm -v -- abis/!(Default.json)
rm -v -- src/!(default.ts)
./scripts/fetch-abis.sh
cp schema.template.graphql schema.graphql
cp subgraph.template.yaml subgraph.yaml
npx graph add --abi abis/VoucherHub.json --contract-name VoucherHub \
    --start-block 0 \
    0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
