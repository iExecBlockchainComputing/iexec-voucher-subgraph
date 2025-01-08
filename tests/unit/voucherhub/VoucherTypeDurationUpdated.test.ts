import { BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { VoucherType } from '../../../generated/schema';
import { handleVoucherTypeDurationUpdated } from '../../../src/voucherHub';
import { createVoucherTypeDurationUpdatedEvent } from '../utils/utils';

// Shared constants
const VOUCHER_TYPE_ID = '1';
const VOUCHER_DESCRIPTION = 'Test Voucher Type';
const VOUCHER_DURATION = BigInt.fromI32(86400);

describe('VoucherTypeDurationUpdated', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should update voucherType duration when event is received', () => {
        // Given
        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_DESCRIPTION;
        voucherType.duration = VOUCHER_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // When
        let event = createVoucherTypeDurationUpdatedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            BigInt.fromI32(604800),
        ); // 7 days in seconds
        handleVoucherTypeDurationUpdated(event);

        // Then
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'duration', '604800');
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'description', VOUCHER_DESCRIPTION);
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', '[]');
    });

    test('Should not update voucherType duration when event is received for non existing voucherType', () => {
        // Given
        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_DESCRIPTION;
        voucherType.duration = VOUCHER_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // When
        let event = createVoucherTypeDurationUpdatedEvent(
            BigInt.fromString('2'),
            BigInt.fromI32(604800),
        ); // 7 days in seconds
        handleVoucherTypeDurationUpdated(event);

        // Then
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'duration', '86400');
    });
});
