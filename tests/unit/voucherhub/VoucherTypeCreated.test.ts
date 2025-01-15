import { BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { handleVoucherTypeCreated } from '../../../src/voucherHub';
import { createVoucherTypeCreatedEvent } from '../utils/utils';

describe('VoucherTypeCreatedEvent', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should create a new VoucherType entity when an event is emitted', () => {
        // Prepare mock event data
        let id = BigInt.fromI32(1);
        let description = 'Test Voucher';
        let duration = BigInt.fromI32(30);

        // Create mock event
        let event = createVoucherTypeCreatedEvent(id, description, duration);

        handleVoucherTypeCreated(event);

        let entityId = id.toString();
        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', entityId, 'id', entityId);
        assert.fieldEquals('VoucherType', entityId, 'description', description);
        assert.fieldEquals('VoucherType', entityId, 'duration', duration.toString());
        assert.fieldEquals('VoucherType', entityId, 'eligibleAssets', '[]');
    });

    test('Should not create 2 VoucherType entities with the same voucher type id', () => {
        let id = BigInt.fromI32(1);
        let description = 'Test Voucher';
        let duration = BigInt.fromI32(30);
        let eventType1 = createVoucherTypeCreatedEvent(id, description, duration);
        handleVoucherTypeCreated(eventType1);

        let descriptionType2 = 'Test Voucher number 2';
        let durationType2 = BigInt.fromI32(150);
        let event = createVoucherTypeCreatedEvent(id, descriptionType2, durationType2);
        handleVoucherTypeCreated(event);

        // Assert that no entity was created
        assert.entityCount('VoucherType', 1);
        let entityId = id.toString();
        assert.fieldEquals('VoucherType', entityId, 'id', entityId);
        assert.fieldEquals('VoucherType', entityId, 'description', description);
        assert.fieldEquals('VoucherType', entityId, 'duration', duration.toString());
        assert.fieldEquals('VoucherType', entityId, 'eligibleAssets', '[]');
    });
});
