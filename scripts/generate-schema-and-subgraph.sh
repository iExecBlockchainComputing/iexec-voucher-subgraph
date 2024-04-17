#!/bin/bash
SCRIPTS_PATH="$(dirname "$0")"
cd "$SCRIPTS_PATH/.." || exit # Go to project path
shopt -s extglob              # required for "rm !"
rm -v -- abis/!(Default.json)
rm -v -- src/!(default.ts)
./scripts/fetch-abis.sh
cp schema.template.graphql schema.graphql
cp subgraph.template.yaml subgraph.yaml

# Use `graph add` commands to auto generate src code
npx graph add --abi abis/VoucherHub.json --contract-name VoucherHub \
    --start-block 0 \
    0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9
# Dummy block and address required here for Voucher generation
npx graph add --abi abis/Voucher.json --contract-name Voucher \
    --start-block 123456789 \
    0x0000000000000000000000000000000123456789

sed="sed -i.bak" # Make sed compatible with GNU and Mac OS X. Please update if not working.

# Prepare subgraph.yaml
$sed '/^      file: .\/src\/voucher-hub.ts.*/a templates:' subgraph.yaml
$sed '/123456789/d' subgraph.yaml # Remove dummy block and address for Voucher template

# Prepare schema.graphql
if ! command -v yq &> /dev/null # yq install required
then
    echo "yq could not be found. Please run: snap install yq"
    exit 1
fi
for entity in $(cat subgraph.yaml | yq -r .templates[0].mapping.entities); do
    $sed '/^type '"${entity}"'.*/a voucher: Bytes!' schema.graphql
done

# Prepare src/voucher.ts (and patch entity collision since "Initialized" is present in VoucherHub AND Voucher)
$sed 's/entity.save()/entity.voucher = event.address\n  entity.save()/g' src/voucher.ts
$sed 's/Initialized,/VoucherInitialized,/g' src/voucher.ts
$sed 's/new Initialized/new VoucherInitialized/g' src/voucher.ts

# Prepare src/voucher-hub.ts
$sed '1s/^/import { Voucher } from "..\/generated\/templates";\n/' src/voucher-hub.ts
$sed '/^export function handleVoucherCreated.*/a Voucher.create(event.params.voucher);' src/voucher-hub.ts
