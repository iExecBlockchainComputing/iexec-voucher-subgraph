import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleVoucherDrained } from '../../../src/voucherHub';
import {
    createAndSaveVoucher,
    createAndSaveVoucherType,
    createVoucherDrainedEvent,
} from '../utils/utils';

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

describe('VoucherDrainedEvent', () => {
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

    test('Should handle drain to exactly zero balance', () => {
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );

        const event = createVoucherDrainedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(VOUCHER_BALANCE),
        );
        handleVoucherDrained(event);

        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', '0');
        // Verify other fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should not update when drain amount results in non-zero balance', () => {
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );

        const partialDrainAmount = VOUCHER_BALANCE.div(BigDecimal.fromString('2'));
        const event = createVoucherDrainedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(partialDrainAmount),
        );
        handleVoucherDrained(event);

        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', VOUCHER_BALANCE.toString());
    });

    test('Should handle drain for non-existent voucher', () => {
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000000';
        assert.entityCount('Voucher', 0);

        const event = createVoucherDrainedEvent(
            Address.fromString(nonExistentVoucherAddress),
            toNanoRLC(VOUCHER_BALANCE),
        );
        handleVoucherDrained(event);

        assert.entityCount('Voucher', 0);
    });
});
