import { Address, BigDecimal, BigInt, Bytes } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';
import {
    EligibleAssetAdded,
    EligibleAssetRemoved,
    RoleGranted,
    RoleRevoked,
    VoucherCreated,
    VoucherDebited,
    VoucherDrained,
    VoucherTypeCreated,
    VoucherTypeDescriptionUpdated,
    VoucherTypeDurationUpdated,
} from '../../../generated/VoucherHub/VoucherHub';
import { App, Dataset, Voucher, VoucherType, Workerpool } from '../../../generated/schema';
import {
    AccountAuthorized,
    AccountUnauthorized,
} from '../../../generated/templates/Voucher/Voucher';
import { EventParamBuilder } from './EventParamBuilder';

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

    event.parameters = EventParamBuilder.init()
        .address('voucher', voucher)
        .address('owner', owner)
        .bigInt('voucherType', voucherType)
        .bigInt('expiration', expiration)
        .bigInt('value', value)
        .build();

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

    event.parameters = EventParamBuilder.init().bigInt('id', id).address('asset', asset).build();

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

    event.parameters = EventParamBuilder.init()
        .bigInt('id', id)
        .string('description', description)
        .bigInt('duration', duration)
        .build();

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

    event.parameters = EventParamBuilder.init().bigInt('id', id).address('asset', asset).build();

    return event;
}

export function createVoucherTypeDurationUpdatedEvent(
    id: BigInt,
    duration: BigInt,
): VoucherTypeDurationUpdated {
    let mockEvent = newMockEvent();
    let event = new VoucherTypeDurationUpdated(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters = EventParamBuilder.init()
        .bigInt('id', id)
        .bigInt('duration', duration)
        .build();

    return event;
}

export function createVoucherTypeDescriptionUpdatedEvent(
    id: BigInt,
    description: string,
): VoucherTypeDescriptionUpdated {
    let mockEvent = newMockEvent();
    let event = new VoucherTypeDescriptionUpdated(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        new Array(),
        mockEvent.receipt,
    );

    event.parameters = EventParamBuilder.init()
        .bigInt('id', id)
        .string('description', description)
        .build();

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

    event.parameters = EventParamBuilder.init()
        .bytes('role', role)
        .address('account', account)
        .build();

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

    event.parameters = EventParamBuilder.init()
        .bytes('role', role)
        .address('account', account)
        .build();

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

    event.parameters = EventParamBuilder.init().address('account', account).build();

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

    event.parameters = EventParamBuilder.init().address('account', account).build();

    return event;
}

export function createVoucherDrainedEvent(voucher: Address, amount: BigInt): VoucherDrained {
    let mockEvent = newMockEvent();
    let event = new VoucherDrained(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        mockEvent.receipt,
    );

    event.parameters = EventParamBuilder.init()
        .address('voucher', voucher)
        .bigInt('amount', amount)
        .build();

    return event;
}

export function createVoucherDebitedEvent(
    voucher: Address,
    sponsoredAmount: BigInt,
): VoucherDebited {
    let mockEvent = newMockEvent();
    let event = new VoucherDebited(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        mockEvent.receipt,
    );

    event.parameters = EventParamBuilder.init()
        .address('voucher', voucher)
        .bigInt('sponsoredAmount', sponsoredAmount)
        .build();

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
    value: BigDecimal,
    balance: BigDecimal,
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
