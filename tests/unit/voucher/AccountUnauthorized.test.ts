import { Address } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { handleAccountUnauthorized } from '../../../src/voucher';
import {
    VOUCHER_ADDRESS,
    VOUCHER_BALANCE,
    VOUCHER_EXPIRATION,
    VOUCHER_OWNER,
    VOUCHER_TYPE_DESCRIPTION,
    VOUCHER_TYPE_DURATION,
    VOUCHER_TYPE_ELIGIBLE_ASSETS,
    VOUCHER_TYPE_ID,
    VOUCHER_VALUE,
} from '../utils/constant';
import {
    createAccountUnauthorizedEvent,
    createAndSaveVoucher,
    createAndSaveVoucherType,
} from '../utils/utils';

describe('AccountUnauthorizedEvent', () => {
    beforeEach(() => {
        clearStore();
        createAndSaveVoucherType(
            VOUCHER_TYPE_ID,
            VOUCHER_TYPE_DESCRIPTION,
            VOUCHER_TYPE_DURATION,
            VOUCHER_TYPE_ELIGIBLE_ASSETS,
        );
    });

    test('Should remove an account from authorizedAccounts when it exists', () => {
        // --- GIVEN
        let authorizedAccount1 = '0x1111111111111111111111111111111111111111';
        let authorizedAccount2 = '0x2222222222222222222222222222222222222222';

        // Create a mock Voucher entity with authorized accounts
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount1, authorizedAccount2],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(authorizedAccount1),
        );
        handleAccountUnauthorized(event);

        // // --- THEN
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'authorizedAccounts',
            `[${authorizedAccount2}]`,
        );
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'voucherType', VOUCHER_TYPE_ID);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'owner', VOUCHER_OWNER);
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'value', VOUCHER_VALUE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'balance', VOUCHER_BALANCE.toString());
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'expiration', VOUCHER_EXPIRATION.toString());
    });

    test('Should handle cases where the Voucher does not exist', () => {
        // --- GIVEN
        let unauthorizedAccount = '0x1111111111111111111111111111111111111111';
        // Ensure no Voucher entity exists
        assert.entityCount('Voucher', 0);

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(unauthorizedAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.notInStore('Voucher', VOUCHER_ADDRESS);
        assert.entityCount('Voucher', 0); // Ensure no entity is created or modified
    });

    test('Should handle empty authorizedAccounts gracefully', () => {
        // --- GIVEN
        let unauthorizedAccount = '0x1111111111111111111111111111111111111111';

        // Create a mock Voucher entity with no authorized accounts
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(unauthorizedAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.fieldEquals('Voucher', VOUCHER_ADDRESS, 'authorizedAccounts', '[]');
    });

    test('Should not modify authorizedAccounts when the account does not exist', () => {
        // --- GIVEN
        let authorizedAccount = '0x1111111111111111111111111111111111111111';
        let nonExistentAccount = '0x9999999999999999999999999999999999999999';

        // Create a mock Voucher entity with a single authorized account
        createAndSaveVoucher(
            VOUCHER_ADDRESS,
            VOUCHER_TYPE_ID,
            VOUCHER_OWNER,
            VOUCHER_VALUE,
            VOUCHER_BALANCE,
            VOUCHER_EXPIRATION,
            [authorizedAccount],
        );

        // --- WHEN
        let event = createAccountUnauthorizedEvent(
            Address.fromString(VOUCHER_ADDRESS),
            Address.fromString(nonExistentAccount),
        );
        handleAccountUnauthorized(event);

        // --- THEN
        assert.fieldEquals(
            'Voucher',
            VOUCHER_ADDRESS,
            'authorizedAccounts',
            `[${authorizedAccount}]`,
        );
    });
});
