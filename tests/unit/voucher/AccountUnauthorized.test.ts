import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { handleAccountUnauthorized } from '../../../src/voucher';
import {
    createAccountUnauthorizedEvent,
    createAndSaveType,
    createAndSaveVoucher,
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

describe('AccountUnauthorizedEvent', () => {
    beforeEach(() => {
        clearStore();
        createAndSaveType(
            VOUCHER_TYPE_ID,
            VOUCHER_DESCRIPTION,
            VOUCHER_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });

    test('Should remove an account from authorizedAccounts when it exists', () => {
        // --- GIVEN
        let voucherAddress = '0x1234567890123456789012345678901234567890';
        let authorizedAccount1 = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        let authorizedAccount2 = '0x1111111111111111111111111111111111111111';

        // Create a mock Voucher entity with authorized accounts
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount1, authorizedAccount2],
        );
        // assert.fieldEquals('Voucher', voucherAddress, 'authorizedAccounts', `[${authorizedAccount1}, ${authorizedAccount2}]`);

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount1),
        );
        handleAccountUnauthorized(event);

        // // --- THEN
        assert.fieldEquals(
            'Voucher',
            voucherAddress,
            'authorizedAccounts',
            `[${authorizedAccount2}]`,
        );
    });

    test('Should handle cases where the Voucher does not exist', () => {
        // --- GIVEN
        let voucherAddress = '0x1234567890123456789012345678901234567890';
        let unauthorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        // Ensure no Voucher entity exists
        assert.entityCount('Voucher', 0);

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(unauthorizedAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.notInStore('Voucher', voucherAddress);
        assert.entityCount('Voucher', 0); // Ensure no entity is created or modified
    });

    test('Should handle empty authorizedAccounts gracefully', () => {
        // --- GIVEN
        let voucherAddress = '0x1234567890123456789012345678901234567890';
        let unauthorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create a mock Voucher entity with no authorized accounts
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(unauthorizedAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.fieldEquals('Voucher', voucherAddress, 'authorizedAccounts', '[]');
    });

    test('Should NOT modify authorizedAccounts when the account does not exist', () => {
        // --- GIVEN
        let voucherAddress = '0x1234567890123456789012345678901234567890';
        let authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        let nonExistentAccount = '0x9999999999999999999999999999999999999999';

        // Create a mock Voucher entity with a single authorized account
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(nonExistentAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.fieldEquals(
            'Voucher',
            voucherAddress,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
    });

    test('Should NOT modify unrelated fields of the Voucher', () => {
        // --- GIVEN
        let voucherAddress = '0x1234567890123456789012345678901234567890';
        let authorizedAccount1 = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';
        let authorizedAccount2 = '0x1111111111111111111111111111111111111111';

        // Create a mock Voucher entity with authorized accounts and other fields
        createAndSaveVoucher(
            voucherAddress,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount1, authorizedAccount2],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount1),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.fieldEquals(
            'Voucher',
            voucherAddress,
            'authorizedAccounts',
            `[${authorizedAccount2}]`,
        );
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('Voucher', voucherAddress, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', voucherAddress, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', voucherAddress, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', voucherAddress, 'balance', VOUCHER_BALANCE.toString());
        assert.fieldEquals('Voucher', voucherAddress, 'expiration', VOUCHER_EXPIRATION.toString());
    });
});
