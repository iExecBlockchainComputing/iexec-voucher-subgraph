import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { VoucherType } from '../../../generated/schema';
import { handleEligibleAssetAdded } from '../../../src/voucherHub';
import {
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ID,
} from '../utils/constant';
import {
    mockGetIexecPoco,
    mockGetterFunction,
    mockIsRegistered,
    mockRegistryAddress,
} from '../utils/mocks';
import { createEligibleAssetAddedEvent } from '../utils/utils';

// Asset IDs
const APP_ID = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
const DATASET_ID = '0x123456789012345678901234567890abcdefabcd';
const WORKERPOOL_ID = '0xabcdef1234567890abcdef1234567890abcdef12';
const INVALID_ASSET_ID = '0x1111111111111111111111111111111111111111';

// Registry addresses
const APP_REGISTRY_ADDRESS = '0x0e7bc972c99187c191a17f3cae4a2711a4188c3f';
const DATASET_REGISTRY_ADDRESS = '0x123456789012345678901234567890abcdefabcd';
const WORKERPOOL_REGISTRY_ADDRESS = '0xabcdef1234567890abcdef1234567890abcdef12';

// Contract addresses
const POCO_ADDRESS = '0x1234567890123456789012345678901234567890';
const VOUCHER_HUB_ADDRESS = '0xa16000000000000000000000000000000000ec2a';

describe('EligibleAssetAddedEvent', () => {
    beforeEach(() => {
        clearStore();

        // Mock getIexecPoCo contract
        mockGetIexecPoco(VOUCHER_HUB_ADDRESS, POCO_ADDRESS);

        // Mock registries
        mockRegistryAddress(POCO_ADDRESS, 'appregistry', APP_REGISTRY_ADDRESS);
        mockRegistryAddress(POCO_ADDRESS, 'datasetregistry', DATASET_REGISTRY_ADDRESS);
        mockRegistryAddress(POCO_ADDRESS, 'workerpoolregistry', WORKERPOOL_REGISTRY_ADDRESS);

        // Mock getter functions
        mockGetterFunction(APP_REGISTRY_ADDRESS, 'm_appName', 'Mocked App Name');
        mockGetterFunction(DATASET_REGISTRY_ADDRESS, 'm_datasetName', 'Mocked Dataset Name');
        mockGetterFunction(
            WORKERPOOL_REGISTRY_ADDRESS,
            'm_workerpoolDescription',
            'Mocked Workerpool Description',
        );
    });

    test('Should add an APP as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(APP_REGISTRY_ADDRESS, APP_ID, true);
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, APP_ID, false);
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, APP_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(APP_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${APP_ID}]`);
    });

    test('Should add a DATASET as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, DATASET_ID, true);
        mockIsRegistered(APP_REGISTRY_ADDRESS, DATASET_ID, false);
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, DATASET_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(DATASET_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${DATASET_ID}]`);
    });

    test('Should add a WORKERPOOL as eligibleAssets when the entity exists', () => {
        // --- GIVEN
        // Mock registry responses
        mockIsRegistered(WORKERPOOL_REGISTRY_ADDRESS, WORKERPOOL_ID, true);
        mockIsRegistered(APP_REGISTRY_ADDRESS, WORKERPOOL_ID, false);
        mockIsRegistered(DATASET_REGISTRY_ADDRESS, WORKERPOOL_ID, false);

        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_TYPE_DESCRIPTION;
        voucherType.duration = VOUCHER_TYPE_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();

        // WHEN
        let event = createEligibleAssetAddedEvent(
            BigInt.fromString(VOUCHER_TYPE_ID),
            Address.fromString(WORKERPOOL_ID),
        );
        handleEligibleAssetAdded(event);

        // THEN
        assert.fieldEquals('VoucherType', VOUCHER_TYPE_ID, 'eligibleAssets', `[${WORKERPOOL_ID}]`);
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
