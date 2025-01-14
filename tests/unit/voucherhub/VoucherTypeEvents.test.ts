import { BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import {
    handleVoucherTypeDescriptionUpdated,
    handleVoucherTypeDurationUpdated,
} from '../../../src/voucherHub';
import {
    createAndSaveVoucherType,
    createVoucherTypeDescriptionUpdatedEvent,
    createVoucherTypeDurationUpdatedEvent,
} from '../utils/utils';

// Shared constants
const VOUCHER_TYPE_ID = '1';
const VOUCHER_DESCRIPTION = 'Test Voucher Type';
const VOUCHER_DURATION = BigInt.fromI32(86400);
const VOUCHER_TYPE_ELIGIBLE_ASSETS: string[] = [];
const SEVEN_DAYS_IN_SECONDS = BigInt.fromI32(604800);

describe('VoucherTypeEvents', () => {
    beforeEach(() => {
        clearStore();
        // Given
        // Initialize a VoucherType entity
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_DESCRIPTION,
            VOUCHER_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });
    describe('VoucherTypeDurationUpdated', () => {
        test('Should update voucherType duration when event is received', () => {
            // When
            let event = createVoucherTypeDurationUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                SEVEN_DAYS_IN_SECONDS,
            ); // 7 days in seconds
            handleVoucherTypeDurationUpdated(event);

            // Then
            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'duration', '604800');
            // Ensure unrelated fields remain unchanged
            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'description', VOUCHER_DESCRIPTION);
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
            // Given
            assert.entityCount('VoucherType', 1);

            // When
            let event = createVoucherTypeDurationUpdatedEvent(
                BigInt.fromString('2'),
                SEVEN_DAYS_IN_SECONDS,
            ); // 7 days in seconds
            handleVoucherTypeDurationUpdated(event);

            // Then
            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                VOUCHER_DURATION.toString(),
            );
            assert.entityCount('VoucherType', 1);
        });
    });

    describe('VoucherTypeDescriptionUpdated', () => {
        test('Should update voucherType description when event is received', () => {
            // When
            let event = createVoucherTypeDescriptionUpdatedEvent(
                BigInt.fromString(VOUCHER_TYPE_ID),
                'New Test Voucher Type',
            );
            handleVoucherTypeDescriptionUpdated(event);

            // Then
            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'description',
                'New Test Voucher Type',
            );
            // Ensure unrelated fields remain unchanged
            assert.fieldEquals(
                'VoucherType',
                VOUCHER_TYPE_ID,
                'duration',
                VOUCHER_DURATION.toString(),
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
            // Given
            assert.entityCount('VoucherType', 1);

            // When
            let event = createVoucherTypeDescriptionUpdatedEvent(
                BigInt.fromString('2'),
                'New Test Voucher Type',
            );
            handleVoucherTypeDescriptionUpdated(event);

            // Then
            assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'description', VOUCHER_DESCRIPTION);
            assert.entityCount('VoucherType', 1);
        });
    });
});
