import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { VoucherType } from '../../generated/schema';
import { handleEligibleAssetRemoved } from '../../src/voucherHub';
import { createAndSaveApp, createEligibleAssetRemovedEvent } from './utils/utils';

// Shared constants
const voucherTypeId = '1';
const voucherDescription = 'Test Voucher Type';
const voucherDuration = BigInt.fromI32(86400);

describe('EligibleAssetRemovedEvent', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should remove asset from voucherType when the entity exists', () => {
        // --- GIVEN
        let appId = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        let voucherType = new VoucherType(voucherTypeId);

        // Step 1: Create and save the App entity
        createAndSaveApp(appId, 'Test App');

        // Step 2: Initialize the VoucherType with shared constants
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
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
        let eligibleAppId = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef';
        let unrelatedAppId = '0x1234567890123456789012345678901234567890';
        let voucherType = new VoucherType(voucherTypeId);

        // Step 1: Create and save the App
        createAndSaveApp(eligibleAppId, 'Existing App');

        // Step 2: Initialize VoucherType with shared constants
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
        voucherType.eligibleAssets = [eligibleAppId];
        voucherType.save();

        assert.entityCount('VoucherType', 1);
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${eligibleAppId}]`);

        // --- WHEN
        let event = createEligibleAssetRemovedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(unrelatedAppId),
        );
        handleEligibleAssetRemoved(event);

        // --- THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${eligibleAppId}]`);
    });
});
