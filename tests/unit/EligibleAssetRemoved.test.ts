import { Address, BigInt } from '@graphprotocol/graph-ts';
import {
    afterEach,
    assert,
    beforeEach,
    clearStore,
    describe,
    test,
} from 'matchstick-as/assembly/index';
import { App, VoucherType } from '../../generated/schema';
import { handleEligibleAssetRemoved } from '../../src/voucherHub';
import { createEligibleAssetRemovedEvent } from './utils/utils';

describe('EligibleAssetRemovedEvent', () => {
    beforeEach(() => {
        clearStore();
    });

    afterEach(() => {
        clearStore();
    });

    test('Should update voucherType when the entity exists', () => {
        // --- GIVEN
        let voucherTypeId = '1';
        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = 'Test Voucher Type';
        voucherType.duration = BigInt.fromI32(86400);
        let appId = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        let app = new App(appId);
        app.name = 'Test App';
        app.save();
        voucherType.eligibleAssets = [appId];
        voucherType.save();
        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${appId}]`);

        // --- WHEN
        let event = createEligibleAssetRemovedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(appId),
        );
        handleEligibleAssetRemoved(event);

        // --- THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[]`);
    });

    test('Should not fail if the asset does not exist in eligibleAssets', () => {
        // --- GIVEN
        let voucherTypeId = '2';
        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = 'Another Test Voucher Type';
        voucherType.duration = BigInt.fromI32(86400);
        let unrelatedAppId = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
        voucherType.eligibleAssets = [unrelatedAppId];
        voucherType.save();
        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${unrelatedAppId}]`);

        // --- WHEN
        let event = createEligibleAssetRemovedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString('0x1234567890123456789012345678901234567890'),
        );
        handleEligibleAssetRemoved(event);

        // --- THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${unrelatedAppId}]`);
    });

    test('Should do nothing if the VoucherType does not exist', () => {
        // --- GIVEN
        let event = createEligibleAssetRemovedEvent(
            BigInt.fromString('9999'),
            Address.fromString('0x1234567890123456789012345678901234567890'),
        );

        // --- WHEN
        handleEligibleAssetRemoved(event);

        // --- THEN
        assert.entityCount('VoucherType', 0);
        assert.entityCount('App', 0);
    });
});
