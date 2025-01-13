import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';
import {
    EligibleAssetAdded,
    EligibleAssetRemoved,
    RoleGranted,
    RoleRevoked,
    VoucherCreated,
    VoucherTypeCreated,
} from '../../../generated/VoucherHub/VoucherHub';
import { App, Dataset, Voucher, VoucherType, Workerpool } from '../../../generated/schema';
import {
    AccountAuthorized,
    AccountUnauthorized,
} from '../../../generated/templates/Voucher/Voucher';

export function createVoucherCreatedEvent(
    voucher: Address,
    owner: Address,
    voucherType: BigInt,
    value: BigInt,
    expiration: BigInt,
): VoucherCreated {
    let mockEvent = newMockEvent();
    let event = new VoucherCreated(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('voucher', ethereum.Value.fromAddress(voucher)));
    event.parameters.push(new ethereum.EventParam('owner', ethereum.Value.fromAddress(owner)));
    event.parameters.push(
        new ethereum.EventParam('voucherType', ethereum.Value.fromUnsignedBigInt(voucherType)),
    );
    event.parameters.push(
        new ethereum.EventParam('expiration', ethereum.Value.fromUnsignedBigInt(expiration)),
    );
    event.parameters.push(
        new ethereum.EventParam('value', ethereum.Value.fromUnsignedBigInt(value)),
    );

    return event;
}

export function createEligibleAssetRemovedEvent(id: BigInt, asset: Address): EligibleAssetRemoved {
    let mockEvent = newMockEvent();
    let event = new EligibleAssetRemoved(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(id)));
    event.parameters.push(new ethereum.EventParam('asset', ethereum.Value.fromAddress(asset)));

    return event;
}

export function createVoucherTypeCreatedEvent(
    id: BigInt,
    description: string,
    duration: BigInt,
): VoucherTypeCreated {
    let mockEvent = newMockEvent();
    let event = new VoucherTypeCreated(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(id)));
    event.parameters.push(
        new ethereum.EventParam('description', ethereum.Value.fromString(description)),
    );
    event.parameters.push(
        new ethereum.EventParam('duration', ethereum.Value.fromUnsignedBigInt(duration)),
    );

    return event;
}

export function createEligibleAssetAddedEvent(id: BigInt, asset: Address): EligibleAssetAdded {
    let mockEvent = newMockEvent();
    let event = new EligibleAssetAdded(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('id', ethereum.Value.fromUnsignedBigInt(id)));
    event.parameters.push(new ethereum.EventParam('asset', ethereum.Value.fromAddress(asset)));

    return event;
}

export function createRoleGrantedEvent(account: Address, role: Bytes): RoleGranted {
    let mockEvent = newMockEvent();
    let event = new RoleGranted(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('role', ethereum.Value.fromBytes(role)));
    event.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return event;
}

export function createRoleRevokedEvent(account: Address, role: Bytes): RoleRevoked {
    let mockEvent = newMockEvent();
    let event = new RoleRevoked(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('role', ethereum.Value.fromBytes(role)));
    event.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return event;
}

export function createAccountAuthorizedEvent(
    voucher: Address,
    account: Address,
): AccountAuthorized {
    let mockEvent = newMockEvent();
    let event = new AccountAuthorized(
        voucher,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return event;
}

export function createAccountUnauthorizedEvent(
    voucher: Address,
    account: Address,
): AccountUnauthorized {
    let mockEvent = newMockEvent();
    let event = new AccountUnauthorized(
        voucher,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters.push(new ethereum.EventParam('account', ethereum.Value.fromAddress(account)));

    return event;
}

/**
 * Utility functions to create and save entities.
 */
export function createAndSaveApp(appId: string, name: string): void {
    let app = new App(appId);
    app.name = name;
    app.save();
}

export function createAndSaveDataset(datasetId: string, name: string): void {
    let dataset = new Dataset(datasetId);
    dataset.name = name;
    dataset.save();
}

export function createAndSaveWorkerpool(workerpoolId: string, description: string): void {
    let workerpool = new Workerpool(workerpoolId);
    workerpool.description = description;
    workerpool.save();
}

export function createAndSaveVoucherType(
    typeId: string,
    description: string,
    duration: BigInt,
    eligibleAssets: string[] = [],
): void {
    let voucherType = new VoucherType(typeId);
    voucherType.description = description;
    voucherType.duration = duration;
    voucherType.eligibleAssets = eligibleAssets;
    voucherType.save();
}

export function createAndSaveVoucher(
    address: string,
    typeId: string,
    owner: string,
    value: BigInt,
    balance: BigInt,
    expiration: BigInt,
    authorizedAccounts: string[] = [],
): void {
    let voucher = new Voucher(address);
    voucher.voucherType = typeId;
    voucher.owner = owner;
    voucher.value = value;
    voucher.balance = balance;
    voucher.expiration = expiration;
    voucher.authorizedAccounts = authorizedAccounts;
    voucher.save();
}
