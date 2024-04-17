#!/bin/sh
cd "$(dirname "$0")" || exit
# TODO: Get contracts ABIs from npm
IN=../../iexec-voucher-contracts/artifacts/contracts
OUT=../abis
mkdir -p $OUT
cat $IN/VoucherHub.sol/VoucherHub.json | jq .abi >$OUT/VoucherHub.json
cat $IN/beacon/Voucher.sol/Voucher.json | jq .abi >$OUT/Voucher.json
