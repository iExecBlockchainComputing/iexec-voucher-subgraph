import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleVoucherRefunded } from '../../../src/voucherHub';
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
    createVoucherRefundedEvent,
} from '../utils/utils';

describe('VoucherRefundedEvent', () => {
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

    test('Should handle refund to increase balance correctly', () => {
        // --- GIVEN
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );

        // --- WHEN
        const refundAmount = BigDecimal.fromString('2.5');
        const event = createVoucherRefundedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(refundAmount),
        );
        handleVoucherRefunded(event);

        // --- THEN
        const expectedBalance = VOUCHER_BALANCE.plus(refundAmount);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', expectedBalance.toString());
        // Verify other fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should handle refund for a voucher with zero balance', () => {
        // --- GIVEN
        const zeroBalance = BigDecimal.fromString('0');
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            zeroBalance,
            VOUCHER_EXPIRATION,
            [],
        );

        // --- WHEN
        const refundAmount = BigDecimal.fromString('1.0');
        const event = createVoucherRefundedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(refundAmount),
        );
        handleVoucherRefunded(event);

        // --- THEN
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', refundAmount.toString());
        // Verify other fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should handle refund for non-existent voucher', () => {
        // --- GIVEN
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000000';
        assert.entityCount('Voucher', 0);

        // --- WHEN
        const event = createVoucherRefundedEvent(
            Address.fromString(nonExistentVoucherAddress),
            toNanoRLC(BigDecimal.fromString('1.0')),
        );
        handleVoucherRefunded(event);

        // --- THEN
        assert.entityCount('Voucher', 0);
    });
});
