import { Address, BigInt } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { Voucher, VoucherType } from '../../../generated/schema';
import { handleAccountAuthorized } from '../../../src/voucher';
import { createAccountAuthorizedEvent } from '../utils/utils';

// Shared constants
const VOUCHER_TYPE_ID = '1';
const VOUCHER_DESCRIPTION = 'Test Voucher Type';
const VOUCHER_DURATION = BigInt.fromI32(86400);
const VOUCHER_OWNER = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

describe('AccountAuthorizedEvent', () => {
    beforeEach(() => {
        clearStore();

        // Initialize a VoucherType entity
        let voucherType = new VoucherType(VOUCHER_TYPE_ID);
        voucherType.description = VOUCHER_DESCRIPTION;
        voucherType.duration = VOUCHER_DURATION;
        voucherType.eligibleAssets = [];
        voucherType.save();
    });

    test('Should add an account to authorizedAccounts when the Voucher exists', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create and initialize a mock Voucher entity
        let voucher = new Voucher(voucherAddress);
        voucher.authorizedAccounts = []; // Initialize the array
        voucher.voucherType = VOUCHER_TYPE_ID;
        voucher.owner = VOUCHER_OWNER;
        voucher.value = BigInt.fromI32(100);
        voucher.balance = BigInt.fromI32(100);
        voucher.expiration = BigInt.fromI32(999999);
        voucher.save();

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

    test('Should not modify authorizedAccounts if Voucher does not exist', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        assert.notInStore('Voucher', voucherAddress);
    });

    test('Should not add duplicate accounts to authorizedAccounts', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create and initialize a mock Voucher entity
        let voucher = new Voucher(voucherAddress);
        voucher.authorizedAccounts = [authorizedAccount]; // Already authorized
        voucher.voucherType = VOUCHER_TYPE_ID;
        voucher.owner = VOUCHER_OWNER;
        voucher.value = BigInt.fromI32(100);
        voucher.balance = BigInt.fromI32(100);
        voucher.expiration = BigInt.fromI32(999999);
        voucher.save();

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

    test('Should not modify unrelated fields on Voucher', () => {
        // --- GIVEN
        const voucherAddress = '0x1234567890123456789012345678901234567890';
        const authorizedAccount = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

        // Create and initialize a mock Voucher entity
        let voucher = new Voucher(voucherAddress);
        voucher.authorizedAccounts = []; // Initialize the array
        voucher.voucherType = VOUCHER_TYPE_ID;
        voucher.owner = VOUCHER_OWNER;
        voucher.value = BigInt.fromI32(100);
        voucher.balance = BigInt.fromI32(100);
        voucher.expiration = BigInt.fromI32(999999);
        voucher.save();

        // --- WHEN
        const event = createAccountAuthorizedEvent(
            Address.fromString(voucherAddress),
            Address.fromString(authorizedAccount),
        );
        handleAccountAuthorized(event);

        // --- THEN
        // Ensure unrelated fields remain unchanged
        assert.fieldEquals('Voucher', voucherAddress, 'value', '100');
        assert.fieldEquals('Voucher', voucherAddress, 'balance', '100');
        assert.fieldEquals('Voucher', voucherAddress, 'expiration', '999999');
    });
});
