import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { getEventId, toNanoRLC } from '../../../src/utils';
import { handleVoucherToppedUp } from '../../../src/voucherHub';
import {
    createAndSaveVoucher,
    createAndSaveVoucherType,
    createVoucherToppedUpEvent,
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

    test('Should handle topUp correctly', () => {
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
        const topUpValue = BigDecimal.fromString('20.3');
        const newExpiration = BigInt.fromI32(1234567);

        // --- WHEN
        const event = createVoucherToppedUpEvent(
            Address.fromString(VOUCHER_ADDRESS),
            newExpiration,
            toNanoRLC(topUpValue),
        );
        handleVoucherToppedUp(event);

        // --- THEN
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', topUpValue.toString());
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'balance',
            VOUCHER_BALANCE.plus(topUpValue).toString(),
        );
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', newExpiration.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);

        // Check that a VoucherTopUp entity was created
        const topUpEntityId = getEventId(event);
        assert.fieldEquals('VoucherTopUp', topUpEntityId, 'value', topUpValue.toString());
        assert.fieldEquals('VoucherTopUp', topUpEntityId, 'voucher', VOUCHER_ADDRESS);
        getEventId;
        assert.fieldEquals(
            'VoucherTopUp',
            topUpEntityId,
            'timestamp',
            event.block.timestamp.toString(),
        );
    });

    test('Should handle topUp for non-existent voucher', () => {
        // --- GIVEN
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000000';
        assert.entityCount('Voucher', 0);

        // --- WHEN
        const event = createVoucherToppedUpEvent(
            Address.fromString(nonExistentVoucherAddress),
            VOUCHER_EXPIRATION,
            toNanoRLC(VOUCHER_BALANCE),
        );
        handleVoucherToppedUp(event);

        // --- THEN
        assert.entityCount('Voucher', 0);
        assert.entityCount('VoucherTopUp', 0);
    });
});
