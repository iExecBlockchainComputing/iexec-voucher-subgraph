import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { newMockEvent } from 'matchstick-as/assembly/index';
import { EligibleAssetRemoved, VoucherCreated } from '../../../generated/VoucherHub/VoucherHub';
import { App } from '../../../generated/schema';

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

/**
 * Utility function to create and save an App entity.
 */
export function createAndSaveApp(appId: string, name: string): void {
    let app = new App(appId);
    app.name = name;
    app.save();
}
