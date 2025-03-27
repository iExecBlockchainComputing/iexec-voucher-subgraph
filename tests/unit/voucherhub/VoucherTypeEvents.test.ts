import { BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import {
    handleVoucherTypeDescriptionUpdated,
    handleVoucherTypeDurationUpdated,
} from '../../../src/voucherHub';
import {
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ELIGIBLE_ASSETS,
    VOUCHER_TYPE_ID,
} from '../utils/constant';
import {
    createAndSaveVoucherType,
    createVoucherTypeDescriptionUpdatedEvent,
    createVoucherTypeDurationUpdatedEvent,
} from '../utils/utils';

// Shared constants
const SEVEN_DAYS_IN_SECONDS = BigInt.fromI32(604800);

describe('VoucherTypeEvents', () => {
    beforeEach(() => {
        clearStore();
        // Initialize a VoucherType entity
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });
    describe('VoucherTypeDurationUpdated', () => {
        test('Should update voucherType duration when event is received', () => {
            let event = createVoucherTypeDurationUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                SEVEN_DAYS_IN_SECONDS,
            );
            handleVoucherTypeDurationUpdated(event);

            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                SEVEN_DAYS_IN_SECONDS.toString(),
            );
            // Ensure unrelated fields remain unchanged
            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'description',
                VOUCHER_TYPE_DESCRIPTION,
            );
            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', '[]');
        });

        test('Should handle large duration update', () => {
            // Using BigInt for the maximum safe integer directly
            const largeDuration = BigInt.fromString('9007199254740991');
            const event = createVoucherTypeDurationUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                largeDuration,
            );
            handleVoucherTypeDurationUpdated(event);

            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                largeDuration.toString(),
            );
        });

        test('Should not update voucherType duration when event is received for non existing voucherType', () => {
            assert.entityCount('VoucherType', 1);

            let event = createVoucherTypeDurationUpdatedEvent(
                BigInt.fromString('2'),
                SEVEN_DAYS_IN_SECONDS,
            );
            handleVoucherTypeDurationUpdated(event);

            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                VOUCHER_TYPE_DURATION.toString(),
            );
            assert.entityCount('VoucherType', 1);
        });
    });

    describe('VoucherTypeDescriptionUpdated', () => {
        test('Should update voucherType description when event is received', () => {
            const newDescription = 'New Test Voucher Type';
            let event = createVoucherTypeDescriptionUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                newDescription,
            );
            handleVoucherTypeDescriptionUpdated(event);

            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'description', newDescription);
            // Ensure unrelated fields remain unchanged
            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                VOUCHER_TYPE_DURATION.toString(),
            );
            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', '[]');
        });

        test('Should handle empty description update', () => {
            const event = createVoucherTypeDescriptionUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                '',
            );
            handleVoucherTypeDescriptionUpdated(event);

            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'description', '');
        });

        test('Should not update voucherType description when event is received for non existing voucherType', () => {
            assert.entityCount('VoucherType', 1);

            let event = createVoucherTypeDescriptionUpdatedEvent(
                BigInt.fromString('2'),
                'New Test Voucher Type',
            );
            handleVoucherTypeDescriptionUpdated(event);

            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'description',
                VOUCHER_TYPE_DESCRIPTION,
            );
            assert.entityCount('VoucherType', 1);
        });
    });
});
