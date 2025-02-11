import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleVoucherDebited } from '../../../src/voucherHub';
import {
    createAndSaveVoucher,
    createAndSaveVoucherType,
    createVoucherDebitedEvent,
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

describe('VoucherCreatedEvent', () => {
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

    test('Should handle debit correctly', () => {
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

        // Debit an amount less than the current balance
        const debitAmount = BigDecimal.fromString('20'); // 20 < 50.456
        const event = createVoucherDebitedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            toNanoRLC(debitAmount),
        );
        handleVoucherDebited(event);

        // After debiting 20, the expected remaining balance is 30.456
        const expectedRemainingBalance = VOUCHER_BALANCE.minus(debitAmount);
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
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000000';
        assert.entityCount('Voucher', 0);

        const event = createVoucherDebitedEvent(
            Address.fromString(nonExistentVoucherAddress),
            toNanoRLC(VOUCHER_BALANCE),
        );
        handleVoucherDebited(event);

        // No voucher entity should be created or modified
        assert.entityCount('Voucher', 0);
    });
});
