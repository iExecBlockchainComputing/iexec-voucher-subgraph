import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleVoucherDrained } from '../../../src/voucherHub';
import {
    VOUCHER_ADDRESS,
    VOUCHER_BALANCE,
    VOUCHER_EXPIRATION,
    VOUCHER_OWNER,
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ELIGIBLE_ASSETS,
    VOUCHER_TYPE_ID,
    VOUCHER_VALUE,
} from '../utils/constant';
import {
    createAndSaveVoucher,
    createAndSaveVoucherType,
    createVoucherDrainedEvent,
} from '../utils/utils';

describe('VoucherDrainedEvent', () => {
    beforeEach(() => {
        clearStore();

        // Initialize required entities
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
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

    test('Should handle partial drain correctly', () => {
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

        const expectedBalance = VOUCHER_BALANCE.minus(partialDrainAmount);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', expectedBalance.toString());
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
