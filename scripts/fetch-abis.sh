#!/bin/sh

cd $(dirname $0)

IN=$HOME/iexecdev/iexec-voucher-contracts/artifacts/contracts
OUT=../abis

mkdir -p $OUT

cat $IN/VoucherHub.sol/VoucherHub.json | jq .abi >$OUT/VoucherHub.json
