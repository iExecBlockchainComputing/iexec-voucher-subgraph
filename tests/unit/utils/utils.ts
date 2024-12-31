import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';
import {
    EligibleAssetAdded,
    EligibleAssetRemoved,
    VoucherCreated,
} from '../../../generated/VoucherHub/VoucherHub';
import { App, Dataset, Workerpool } from '../../../generated/schema';

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

/**
 * Utility function to create and save an entity.
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
