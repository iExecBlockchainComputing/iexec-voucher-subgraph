#!/bin/sh
cd "$(dirname "$0")" || exit
# TODO: Get contracts ABIs from npm
IN=$HOME/iexecdev/iexec-voucher-contracts/artifacts/contracts
OUT=../abis
mkdir -p $OUT
cat $IN/VoucherHub.sol/VoucherHub.json | jq .abi >$OUT/VoucherHub.json
