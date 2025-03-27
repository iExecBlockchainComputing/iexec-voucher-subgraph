import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { VoucherType } from '../../../generated/schema';
import { handleEligibleAssetAdded } from '../../../src/voucherHub';
import {
    APP_REGISTRY_ADDRESS,
    ASSET_ID,
    DATASET_REGISTRY_ADDRESS,
    INVALID_ASSET_ID,
    POCO_ADDRESS,
    VOUCHER_HUB_ADDRESS,
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ID,
    WORKERPOOL_REGISTRY_ADDRESS,
} from '../utils/constant';
import {
    mockGetIexecPoco,
    mockGetterFunction,
    mockIsRegistered,
    mockRegistryAddress,
} from '../utils/mocks';
import { createEligibleAssetAddedEvent } from '../utils/utils';

describe('EligibleAssetAddedEvent', () => {
    beforeEach(() => {
        clearStore();

        // Mock getIexecPoCo contract
        mockGetIexecPoco(VOUCHER_HUB_ADDRESS, POCO_ADDRESS);

        // Mock registries
        mockRegistryAddress(POCO_ADDRESS, 'appregistry', APP_REGISTRY_ADDRESS);
        mockRegistryAddress(POCO_ADDRESS, 'datasetregistry', DATASET_REGISTRY_ADDRESS);
        mockRegistryAddress(POCO_ADDRESS, 'workerpoolregistry', WORKERPOOL_REGISTRY_ADDRESS);

        // Mock getter functions for specific asset IDs
        mockGetterFunction(APP_REGISTRY_ADDRESS, 'm_appName', 'Mocked App Name');
        mockGetterFunction(DATASET_REGISTRY_ADDRESS, 'm_datasetName', 'Mocked Dataset Name');
        mockGetterFunction(
            WORKERPOOL_REGISTRY_ADDRESS,
            'm_workerpoolDescription',
            'Mocked Workerpool Description',
        );

        // Ensure the specific asset ID used in tests is also mocked
        mockGetterFunction(ASSET_ID, 'm_appName', 'Mocked App Name');
        mockGetterFunction(ASSET_ID, 'm_datasetName', 'Mocked Dataset Name');
        mockGetterFunction(ASSET_ID, 'm_workerpoolDescription', 'Mocked Workerpool Description');
    });

    test('Should add an APP as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(APP_REGISTRY_ADDRESS, ASSET_ID, true);
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, ASSET_ID, false);
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, ASSET_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(ASSET_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${ASSET_ID}]`);
    });

    test('Should add a DATASET as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, ASSET_ID, true);
        mockIsRegistered(APP_REGISTRY_ADDRESS, ASSET_ID, false);
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, ASSET_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(ASSET_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${ASSET_ID}]`);
    });

    test('Should add a WORKERPOOL as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, ASSET_ID, true);
        mockIsRegistered(APP_REGISTRY_ADDRESS, ASSET_ID, false);
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, ASSET_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(ASSET_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${ASSET_ID}]`);
    });

    test('Should NOT add INVALID asset as eligibleAssets', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(APP_REGISTRY_ADDRESS, INVALID_ASSET_ID, false);
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, INVALID_ASSET_ID, false);
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, INVALID_ASSET_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(INVALID_ASSET_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[]`);
    });
});
