import { BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { beforeEach, clearStore, describe } from 'matchstick-as/assembly/index';
import { createAndSaveVoucherType } from '../utils/utils';

// Shared constants
const VOUCHER_TYPE_ID = '1';
const VOUCHER_DESCRIPTION = 'Test Voucher Type';
const VOUCHER_DURATION = BigInt.fromI32(86400);
const VOUCHER_TYPE_ELIGIBLE_ASSETS: string[] = [];

const VOUCHER_OWNER = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const VOUCHER_VALUE = BigDecimal.fromString('100.123');
const VOUCHER_BALANCE = BigDecimal.fromString('50.456');
const VOUCHER_EXPIRATION = BigInt.fromI32(999999);
const VOUCHER_ADDRESS = '0x1234567890123456789012345678901234567890';

describe('VoucherToppedUpEvent', () => {
    beforeEach(() => {
        clearStore();

        // Initialize required entities
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_DESCRIPTION,
            VOUCHER_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });
});
