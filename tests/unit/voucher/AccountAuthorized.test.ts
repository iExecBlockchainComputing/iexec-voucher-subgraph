import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { toNanoRLC } from '../../../src/utils';
import { handleAccountAuthorized } from '../../../src/voucher';
import {
    createAccountAuthorizedEvent,
    createAndSaveVoucher,
    createAndSaveVoucherType,
} from '../utils/utils';

// Shared constants
const VOUCHER_TYPE_ID = '1';
const VOUCHER_DESCRIPTION = 'Test Voucher Type';
const VOUCHER_DURATION = BigInt.fromI32(86400);
const VOUCHER_TYPE_ELIGIBLE_ASSETS: string[] = [];

const VOUCHER_OWNER = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
const VOUCHER_VALUE = BigDecimal.fromString('100');
const VOUCHER_BALANCE = BigDecimal.fromString('50');
const VOUCHER_EXPIRATION = BigInt.fromI32(999999);
const VOUCHER_ADDRESS = '0x1234567890123456789012345678901234567890';

describe('AccountAuthorizedEvent', () => {
    beforeEach(() => {
        clearStore();

        // Initialize a VoucherType entity
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_DESCRIPTION,
            VOUCHER_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });

    test('Should add an account to authorizedAccounts when the Voucher exists', () => {
        // --- GIVEN
        const authorizedAccount = '0x1111111111111111111111111111111111111111';

        // Create and initialize a mock Voucher entity
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            toNanoRLC(VOUCHER_VALUE),
            toNanoRLC(VOUCHER_BALANCE),
            VOUCHER_EXPIRATION,
            [], // Initialize the array
        );

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        // Reload the Voucher entity to check updates
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', VOUCHER_BALANCE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should not modify authorizedAccounts if Voucher does not exist', () => {
        // --- GIVEN
        const authorizedAccount = '0x1111111111111111111111111111111111111111';
        // Ensure no Voucher entity exists
        assert.entityCount('Voucher', 0);

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        assert.notInStore('Voucher', VOUCHER_ADDRESS);
        assert.entityCount('Voucher', 0); // Ensure no entity is created or modified
    });

    test('Should not add duplicate accounts to authorizedAccounts', () => {
        // --- GIVEN
        const authorizedAccount = '0x1111111111111111111111111111111111111111';

        // Create and initialize a mock Voucher entity
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            toNanoRLC(VOUCHER_VALUE),
            toNanoRLC(VOUCHER_BALANCE),
            VOUCHER_EXPIRATION,
            [authorizedAccount], // Already authorized
        );

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        // Reload the Voucher entity to check updates
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
    });
});
