import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { VoucherType } from '../../../generated/schema';
import { handleEligibleAssetAdded } from '../../../src/voucherHub';
import {
    mockGetIexecPoco,
    mockGetterFunction,
    mockIsRegistered,
    mockRegistryAddress,
} from '../utils/mocks';
import { createEligibleAssetAddedEvent } from '../utils/utils';

// Shared constants
const voucherTypeId = '1';
const voucherDescription = 'Test Voucher Type';
const voucherDuration = BigInt.fromI32(86400);

describe('EligibleAssetAddedEvent', () => {
    beforeEach(() => {
        clearStore();

        const voucherHubAddress = '0xa16000000000000000000000000000000000ec2a';
        const pocoAddress = '0x1234567890123456789012345678901234567890';
        const appRegistryAddress = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        const datasetRegistryAddress = '0x123456789012345678901234567890abcdefabcd';
        const workerpoolRegistryAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

        // Mock getIexecPoCo contract
        mockGetIexecPoco(voucherHubAddress, pocoAddress);

        // Mock registries
        mockRegistryAddress(pocoAddress, 'appregistry', appRegistryAddress);
        mockRegistryAddress(pocoAddress, 'datasetregistry', datasetRegistryAddress);
        mockRegistryAddress(pocoAddress, 'workerpoolregistry', workerpoolRegistryAddress);

        // Mock getter functions
        mockGetterFunction(appRegistryAddress, 'm_appName', 'Mocked App Name');
        mockGetterFunction(datasetRegistryAddress, 'm_datasetName', 'Mocked Dataset Name');
        mockGetterFunction(
            workerpoolRegistryAddress,
            'm_workerpoolDescription',
            'Mocked Workerpool Description',
        );
    });

    test('Should set isRegisteredAsset to true for AppRegistry', () => {
        const appId = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        const datasetRegistryAddress = '0x123456789012345678901234567890abcdefabcd';
        const workerpoolRegistryAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

        // Mock registry responses
        mockIsRegistered(appId, appId, true);
        mockIsRegistered(datasetRegistryAddress, appId, false);
        mockIsRegistered(workerpoolRegistryAddress, appId, false);

        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(appId),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${appId}]`);
    });

    test('Should set isRegisteredAsset to true for DatasetRegistry', () => {
        const datasetId = '0x123456789012345678901234567890abcdefabcd';
        const appRegistryAddress = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        const workerpoolRegistryAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

        // Mock registry responses
        mockIsRegistered(datasetId, datasetId, true);
        mockIsRegistered(appRegistryAddress, datasetId, false);
        mockIsRegistered(workerpoolRegistryAddress, datasetId, false);

        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(datasetId),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${datasetId}]`);
    });

    test('Should set isRegisteredAsset to true for WorkerpoolRegistry', () => {
        const workerpoolId = '0xabcdef1234567890abcdef1234567890abcdef12';
        const appRegistryAddress = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        const datasetRegistryAddress = '0x123456789012345678901234567890abcdefabcd';

        // Mock registry responses
        mockIsRegistered(workerpoolId, workerpoolId, true);
        mockIsRegistered(appRegistryAddress, workerpoolId, false);
        mockIsRegistered(datasetRegistryAddress, workerpoolId, false);

        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(workerpoolId),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[${workerpoolId}]`);
    });

    test('Should not set isRegisteredAsset to true for unregistered asset', () => {
        const invalidAssetId = '0x1111111111111111111111111111111111111111';
        const appRegistryAddress = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
        const datasetRegistryAddress = '0x123456789012345678901234567890abcdefabcd';
        const workerpoolRegistryAddress = '0xabcdef1234567890abcdef1234567890abcdef12';

        // Mock registry responses
        mockIsRegistered(appRegistryAddress, invalidAssetId, false);
        mockIsRegistered(datasetRegistryAddress, invalidAssetId, false);
        mockIsRegistered(workerpoolRegistryAddress, invalidAssetId, false);

        let voucherType = new VoucherType(voucherTypeId);
        voucherType.description = voucherDescription;
        voucherType.duration = voucherDuration;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(voucherTypeId),
            Address.fromString(invalidAssetId),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', voucherTypeId, 'eligibleAssets', `[]`);
    });
});
