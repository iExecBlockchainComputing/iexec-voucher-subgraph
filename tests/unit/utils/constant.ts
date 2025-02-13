import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';

// Shared constants
export const VOUCHER_TYPE_ID = '1';
export const VOUCHER_TYPE_DESCRIPTION = 'Test Voucher Type';
export const VOUCHER_TYPE_DURATION = BigInt.fromI32(86400);
export const VOUCHER_TYPE_ELIGIBLE_ASSETS: string[] = [];
export const VOUCHER_OWNER = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
export const VOUCHER_VALUE = BigDecimal.fromString('100.123');
export const VOUCHER_BALANCE = BigDecimal.fromString('50.456');
export const VOUCHER_EXPIRATION = BigInt.fromI32(999999);
export const VOUCHER_ADDRESS = '0x1234567890123456789012345678901234567890';
export const ASSET_ID = '0xabcdef1234567890abcdef1234567890abcdef12';
export const INVALID_ASSET_ID = '0x1111111111111111111111111111111111111111';
