import { Address, BigDecimal } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleVoucherDebited } from '../../../src/voucherHub';
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
    createVoucherDebitedEvent,
} from '../utils/utils';

describe('VoucherDebitedEvent', () => {
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

    test('Should handle debit correctly', () => {
        // --- GIVEN
        // Create a voucher with a balance of 50.456
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );
        // Sponsored amount less than the current balance
        const sponsoredAmount = BigDecimal.fromString('20.45'); // 20.45 < 50.456

        // --- WHEN
        const event = createVoucherDebitedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(sponsoredAmount),
        );
        handleVoucherDebited(event);

        // --- THEN
        const expectedRemainingBalance = VOUCHER_BALANCE.minus(sponsoredAmount);
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'balance',
            expectedRemainingBalance.toString(),
        );
        // Verify other fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should handle debit for non-existent voucher', () => {
        // --- GIVEN
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000001';
        assert.entityCount('Voucher', 0);

        // --- WHEN
        const event = createVoucherDebitedEvent(
            Address.fromString(nonExistentVoucherAddress),
            toNanoRLC(VOUCHER_BALANCE),
        );
        handleVoucherDebited(event);

        // --- THEN
        // No voucher entity should be created or modified
        assert.entityCount('Voucher', 0);
    });
});
