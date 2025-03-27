import { BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { handleVoucherTypeCreated } from '../../../src/voucherHub';
import { VOUCHER_TYPE_DESCRIPTION, VOUCHER_TYPE_DURATION } from '../utils/constant';
import { createVoucherTypeCreatedEvent } from '../utils/utils';

describe('VoucherTypeCreatedEvent', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should create first VoucherType entity with ID 0', () => {
        const event = createVoucherTypeCreatedEvent(
            BigInt.fromI32(0),
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
        );

        handleVoucherTypeCreated(event);

        // Check VoucherType entity
        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', '0', 'id', '0');
        assert.fieldEquals('VoucherType', '0', 'description', VOUCHER_TYPE_DESCRIPTION);
        assert.fieldEquals('VoucherType', '0', 'duration', VOUCHER_TYPE_DURATION.toString());
        assert.fieldEquals('VoucherType', '0', 'eligibleAssets', '[]');

        // Check Counter entity
        assert.entityCount('Counter', 1);
        assert.fieldEquals('Counter', 'VoucherType', 'count', '1');
    });

    test('Should handle sequential voucher type creation correctly', () => {
        // Create first voucher type (ID 0)
        const event1 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(0),
            'First Voucher',
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event1);

        // Create second voucher type (ID 1)
        const event2 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(1),
            'Second Voucher',
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event2);

        assert.entityCount('VoucherType', 2);
        assert.fieldEquals('Counter', 'VoucherType', 'count', '2');
        assert.fieldEquals('VoucherType', '0', 'description', 'First Voucher');
        assert.fieldEquals('VoucherType', '1', 'description', 'Second Voucher');
    });

    test('Should not accept non-sequential ID', () => {
        // Create first voucher type (ID 0)
        const event1 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(0),
            'First Voucher',
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event1);

        // Try to create voucher type with ID 2 (skipping 1)
        const event2 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(2),
            'Invalid Voucher',
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event2);

        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('Counter', 'VoucherType', 'count', '1');
    });

    test('Should not accept ID greater than counter', () => {
        const event = createVoucherTypeCreatedEvent(
            BigInt.fromI32(1),
            'Invalid ID Voucher',
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event);

        assert.entityCount('VoucherType', 0);
        // Counter should not exist yet
        assert.entityCount('Counter', 0);
    });

    test('Should not modify existing voucher type on duplicate event', () => {
        // Create initial voucher type
        const event1 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(0),
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
        );
        handleVoucherTypeCreated(event1);

        // Attempt to modify with same ID
        const event2 = createVoucherTypeCreatedEvent(
            BigInt.fromI32(0),
            'Modified Description',
            BigInt.fromI32(7200),
        );
        handleVoucherTypeCreated(event2);

        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', '0', 'description', VOUCHER_TYPE_DESCRIPTION);
        assert.fieldEquals('VoucherType', '0', 'duration', VOUCHER_TYPE_DURATION.toString());
        assert.fieldEquals('Counter', 'VoucherType', 'count', '1');
    });
});
