import { Address, BigDecimal, Bytes } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { Deal } from '../../../generated/schema';
import { handleOrdersMatchedWithVoucher } from '../../../src/voucher';
import {
    APP_ADDRESS,
    APP_NAME,
    APP_PRICE,
    DATASET_ADDRESS,
    DATASET_NAME,
    DATASET_PRICE,
    DEAL_BOT_SIZE,
    DEAL_ID,
    POCO_ADDRESS,
    TOTAL_PRICE,
    VOUCHER_ADDRESS,
    VOUCHER_BALANCE,
    VOUCHER_EXPIRATION,
    VOUCHER_HUB_ADDRESS,
    VOUCHER_OWNER,
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ELIGIBLE_ASSETS,
    VOUCHER_TYPE_ID,
    VOUCHER_VALUE,
    WORKERPOOL_ADDRESS,
    WORKERPOOL_NAME,
    WORKERPOOL_PRICE,
} from '../utils/constant';
import {
    mockGetIexecPoco,
    mockGetterFunction,
    mockPocoViewDeal,
    mockVoucherContractCalls,
} from '../utils/mocks';
import {
    createAndSaveVoucher,
    createAndSaveVoucherType,
    createOrdersMatchedWithVoucherEvent,
} from '../utils/utils';

describe('OrdersMatchedWithVoucherEvent', () => {
    beforeEach(() => {
        clearStore();
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [], // Initialize empty authorized accounts
        );
        mockGetIexecPoco(VOUCHER_HUB_ADDRESS, POCO_ADDRESS);
        mockGetterFunction(APP_ADDRESS, 'm_appName', APP_NAME);
        mockGetterFunction(DATASET_ADDRESS, 'm_datasetName', DATASET_NAME);
        mockGetterFunction(WORKERPOOL_ADDRESS, 'm_workerpoolDescription', WORKERPOOL_NAME);
    });

    test('Should create Deal entity when OrdersMatchedWithVoucher event is emitted', () => {
        // --- GIVEN
        const dealId = Bytes.fromHexString(DEAL_ID);
        mockVoucherContractCalls(
            VOUCHER_ADDRESS,
            VOUCHER_HUB_ADDRESS,
            dealId,
            APP_PRICE,
            DATASET_PRICE,
            WORKERPOOL_PRICE,
        );

        mockPocoViewDeal(
            POCO_ADDRESS,
            VOUCHER_ADDRESS,
            dealId,
            APP_ADDRESS,
            DATASET_ADDRESS,
            WORKERPOOL_ADDRESS,
            APP_PRICE,
            DATASET_PRICE,
            WORKERPOOL_PRICE,
        );

        // --- WHEN
        const event = createOrdersMatchedWithVoucherEvent(
            Address.fromString(VOUCHER_ADDRESS),
            dealId,
        );
        handleOrdersMatchedWithVoucher(event);

        // --- THEN
        const dealEntity = Deal.load(dealId.toHexString());
        assert.assertNotNull(dealEntity);
        assert.fieldEquals('Deal', dealId.toHexString(), 'sponsor', VOUCHER_ADDRESS);
        assert.fieldEquals(
            'Deal',
            dealId.toHexString(),
            'timestamp',
            event.block.timestamp.toString(),
        );
        assert.fieldEquals('Deal', dealId.toHexString(), 'sponsoredAmount', TOTAL_PRICE.toString());
        assert.fieldEquals('Deal', dealId.toHexString(), 'app', APP_ADDRESS);
        assert.fieldEquals('Deal', dealId.toHexString(), 'dataset', DATASET_ADDRESS);
        assert.fieldEquals('Deal', dealId.toHexString(), 'workerpool', WORKERPOOL_ADDRESS);
        assert.fieldEquals('Deal', dealId.toHexString(), 'botSize', DEAL_BOT_SIZE);
        assert.fieldEquals('Deal', dealId.toHexString(), 'appPrice', APP_PRICE.toString());
        assert.fieldEquals('Deal', dealId.toHexString(), 'datasetPrice', DATASET_PRICE.toString());
        assert.fieldEquals(
            'Deal',
            dealId.toHexString(),
            'workerpoolPrice',
            WORKERPOOL_PRICE.toString(),
        );
    });

    test('Should create Deal entity with null dataset when dataset address is zero', () => {
        // --- GIVEN
        const dealId = Bytes.fromHexString(DEAL_ID);
        mockVoucherContractCalls(
            VOUCHER_ADDRESS,
            VOUCHER_HUB_ADDRESS,
            dealId,
            APP_PRICE,
            BigDecimal.fromString('0'),
            WORKERPOOL_PRICE,
        );

        // Mock PoCo viewDeal with zero address for dataset
        mockPocoViewDeal(
            POCO_ADDRESS,
            VOUCHER_ADDRESS,
            dealId,
            APP_ADDRESS,
            '0x0000000000000000000000000000000000000000',
            WORKERPOOL_ADDRESS,
            APP_PRICE,
            BigDecimal.fromString('0'),
            WORKERPOOL_PRICE,
        );

        // --- WHEN
        const event = createOrdersMatchedWithVoucherEvent(
            Address.fromString(VOUCHER_ADDRESS),
            dealId,
        );
        handleOrdersMatchedWithVoucher(event);

        // --- THEN
        const dealEntity = Deal.load(dealId.toHexString());
        if (dealEntity) {
            assert.assertNull(dealEntity.dataset);
            assert.fieldEquals('Deal', dealId.toHexString(), 'datasetPrice', '0');
        }
    });

    test('Should not create Deal entity when sponsored amount is zero', () => {
        // --- GIVEN
        const dealId = Bytes.fromHexString(DEAL_ID);

        // Mock getSponsoredAmount to return 0
        mockVoucherContractCalls(
            VOUCHER_ADDRESS,
            VOUCHER_HUB_ADDRESS,
            dealId,
            BigDecimal.fromString('0'),
            BigDecimal.fromString('0'),
            BigDecimal.fromString('0'),
        );

        // --- WHEN
        const event = createOrdersMatchedWithVoucherEvent(
            Address.fromString(VOUCHER_ADDRESS),
            dealId,
        );
        handleOrdersMatchedWithVoucher(event);

        // --- THEN
        assert.notInStore('Deal', dealId.toHexString());
    });
});
