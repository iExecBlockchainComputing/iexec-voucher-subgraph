import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { getEventId, toNanoRLC } from '../../../src/utils';
import { handleVoucherToppedUp } from '../../../src/voucherHub';
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
    createVoucherToppedUpEvent,
} from '../utils/utils';

describe('VoucherToppedUpEvent', () => {
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
        // Verify other fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);

        // Check that a VoucherTopUp entity was created
        const topUpEntityId = getEventId(event);
        assert.fieldEquals('VoucherTopUp', topUpEntityId, 'value', topUpValue.toString());
        // Verify other fields remain unchanged
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
        const nonExistentVoucherAddress = '0x0000000000000000000000000000000000000001';
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
