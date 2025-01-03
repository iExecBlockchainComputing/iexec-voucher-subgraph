import { Address, Bytes } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { Account, Role } from '../../../generated/schema';
import { getRoleName } from '../../../src/utils';
import { handleRoleGranted, handleRoleRevoked } from '../../../src/voucherHub';
import { createRoleGrantedEvent, createRoleRevokedEvent } from '../utils/utils';

// Constants for testing
const ACCOUNT_ID = '0x1234567890abcdef1234567890abcdef12345678';
const VALID_ROLE_ID = '0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3';
const UNKNOWN_ROLE_ID = '0x544b2cd71ba72d14e3ad1fab938f5145ba5fc248560466e1d7cc20c78080e0fb';

function setupInitialAccount(accountId: string, roleId: string | null): void {
    let account = new Account(accountId);
    account.role = roleId;
    account.save();

    if (roleId) {
        let role = new Role(roleId);
        role.name = getRoleName(roleId);
        role.save();
    }
}

describe('Role Handlers', () => {
    beforeEach(() => {
        clearStore();
    });

    test('Should assign a recognized role to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(VALID_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', VALID_ROLE_ID);
        assert.fieldEquals('Role', VALID_ROLE_ID, 'name', 'UPGRADER_ROLE');
    });

    test('Should assign an unknown role to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(UNKNOWN_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', UNKNOWN_ROLE_ID);
        assert.fieldEquals('Role', UNKNOWN_ROLE_ID, 'name', 'UNKNOWN_ROLE');
    });

    test('Should revoke a recognized role from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, VALID_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(VALID_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', VALID_ROLE_ID, 'name', 'UPGRADER_ROLE');
    });

    test('Should revoke an unknown role from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, UNKNOWN_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(UNKNOWN_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', UNKNOWN_ROLE_ID, 'name', 'UNKNOWN_ROLE');
    });
});
