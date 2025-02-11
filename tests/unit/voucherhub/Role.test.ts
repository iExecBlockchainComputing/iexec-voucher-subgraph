import { Address, Bytes } from '@graphprotocol/graph-ts';
import { assert, beforeEach, clearStore, describe, test } from 'matchstick-as/assembly/index';
import { Account, Role } from '../../../generated/schema';
import { getRoleName } from '../../../src/utils';
import { handleRoleGranted, handleRoleRevoked } from '../../../src/voucherHub';
import { createRoleGrantedEvent, createRoleRevokedEvent } from '../utils/utils';

// Constants for testing
const ACCOUNT_ID = '0x1234567890abcdef1234567890abcdef12345678';
const DEFAULT_ADMIN_ROLE_ID = '0x00';
const UPGRADER_ROLE_ID = '0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3';
const MANAGER_ROLE_ID = '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08';
const MINTER_ROLE_ID = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
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

    test('Should assign DEFAULT_ADMIN_ROLE to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(DEFAULT_ADMIN_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', DEFAULT_ADMIN_ROLE_ID);
        assert.fieldEquals('Role', DEFAULT_ADMIN_ROLE_ID, 'name', 'DEFAULT_ADMIN_ROLE');
    });

    test('Should assign UPGRADER_ROLE to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(UPGRADER_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', UPGRADER_ROLE_ID);
        assert.fieldEquals('Role', UPGRADER_ROLE_ID, 'name', 'UPGRADER_ROLE');
    });

    test('Should assign MANAGER_ROLE to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(MANAGER_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', MANAGER_ROLE_ID);
        assert.fieldEquals('Role', MANAGER_ROLE_ID, 'name', 'MANAGER_ROLE');
    });

    test('Should assign MINTER_ROLE to an account on RoleGranted event', () => {
        // --- GIVEN
        const event = createRoleGrantedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(MINTER_ROLE_ID),
        );

        // WHEN
        handleRoleGranted(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', MINTER_ROLE_ID);
        assert.fieldEquals('Role', MINTER_ROLE_ID, 'name', 'MINTER_ROLE');
    });

    test('Should revoke DEFAULT_ADMIN_ROLE from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, DEFAULT_ADMIN_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(DEFAULT_ADMIN_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', DEFAULT_ADMIN_ROLE_ID, 'name', 'DEFAULT_ADMIN_ROLE');
    });

    test('Should revoke UPGRADER_ROLE from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, UPGRADER_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(UPGRADER_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', UPGRADER_ROLE_ID, 'name', 'UPGRADER_ROLE');
    });

    test('Should revoke MANAGER_ROLE from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, MANAGER_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(MANAGER_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', MANAGER_ROLE_ID, 'name', 'MANAGER_ROLE');
    });

    test('Should revoke MINTER_ROLE from an account on RoleRevoked event', () => {
        // --- GIVEN
        setupInitialAccount(ACCOUNT_ID, MINTER_ROLE_ID);

        const event = createRoleRevokedEvent(
            Address.fromString(ACCOUNT_ID),
            Bytes.fromHexString(MINTER_ROLE_ID),
        );

        // WHEN
        handleRoleRevoked(event);

        // THEN
        assert.fieldEquals('Account', ACCOUNT_ID, 'id', ACCOUNT_ID);
        assert.fieldEquals('Account', ACCOUNT_ID, 'role', 'null');
        assert.fieldEquals('Role', MINTER_ROLE_ID, 'name', 'MINTER_ROLE');
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
