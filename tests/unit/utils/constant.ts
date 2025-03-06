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

// Registry addresses
export const APP_REGISTRY_ADDRESS = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
export const DATASET_REGISTRY_ADDRESS = '0x123456789012345678901234567890abcdefabcd';
export const WORKERPOOL_REGISTRY_ADDRESS = '0xabcdef1234567890abcdef1234567890abcdef12';

// Contract addresses
export const POCO_ADDRESS = '0x1234567890123456789012345678901234567890';
export const VOUCHER_HUB_ADDRESS = '0xa16000000000000000000000000000000000ec2a';

export const DEAL_ID = '0x1234567890123456789012345678901234567890123456789012345678901234';
export const DEAL_BOT_SIZE = '5';
// App constants
export const APP_ADDRESS = '0x0000000000000000000000000000000000000008';
export const APP_PRICE = BigDecimal.fromString('2.25');
export const APP_NAME = 'Mocked App Name';

// Dataset constants
export const DATASET_ADDRESS = '0x0000000000000000000000000000000000000009';
export const DATASET_PRICE = BigDecimal.fromString('3.25');
export const DATASET_NAME = 'Mocked Dataset Name';

// Workerpool constants
export const WORKERPOOL_ADDRESS = '0x0000000000000000000000000000000000000010';
export const WORKERPOOL_PRICE = BigDecimal.fromString('4.25');
export const WORKERPOOL_NAME = 'Mocked Workerpool Description';

export const TOTAL_PRICE = APP_PRICE.plus(DATASET_PRICE).plus(WORKERPOOL_PRICE);
