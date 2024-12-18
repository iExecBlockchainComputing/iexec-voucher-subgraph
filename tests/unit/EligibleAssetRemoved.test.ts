import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { App, VoucherType } from '../../generated/schema';
import { handleEligibleAssetRemoved } from '../../src/voucherHub';
import { createEligibleAssetRemovedEvent } from './utils/utils';

describe('EligibleAssetRemovedEvent', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should removed asset from voucherType when the entity exists', () => {
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

    test('Should not fail if the asset does not exist in eligibleAssets', () => {
        // --- GIVEN
        let voucherTypeId = '1';
        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = 'Another Test Voucher Type';
        voucherType.duration = BigInt.fromI32(86400);
        let existingAppId = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
        let unrelatedAppId = '0x1234567890123456789012345678901234567890';
        voucherType.eligibleAssets = [existingAppId];
        voucherType.save();
        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${existingAppId}]`);

        // --- WHEN
        let event = createEligibleAssetRemovedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(unrelatedAppId),
        );
        handleEligibleAssetRemoved(event);

        // --- THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${existingAppId}]`);
    });
});
