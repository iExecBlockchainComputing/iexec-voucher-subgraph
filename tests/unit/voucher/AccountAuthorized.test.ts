import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
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
const VOUCHER_VALUE = BigInt.fromI32(100);
const VOUCHER_BALANCE = BigInt.fromI32(50);
const VOUCHER_EXPIRATION = BigInt.fromI32(999999);

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
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create and initialize a mock Voucher entity
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [], // Initialize the array
        );

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        // Reload the Voucher entity to check updates
        assert.fieldEquals(
            'Voucher',
            voucherAddress,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('Voucher', voucherAddress, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', voucherAddress, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', voucherAddress, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', voucherAddress, 'balance', VOUCHER_BALANCE.toString());
        assert.fieldEquals('Voucher', voucherAddress, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should not modify authorizedAccounts if Voucher does not exist', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        // Ensure no Voucher entity exists
        assert.entityCount('Voucher', 0);

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        assert.notInStore('Voucher', voucherAddress);
        assert.entityCount('Voucher', 0); // Ensure no entity is created or modified
    });

    test('Should not add duplicate accounts to authorizedAccounts', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create and initialize a mock Voucher entity
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount], // Already authorized
        );

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        // Reload the Voucher entity to check updates
        assert.fieldEquals(
            'Voucher',
            voucherAddress,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
    });
});
