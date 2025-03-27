import { Address, BigDecimal, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';
import { mockFunction } from 'matchstick-as';
import { toNanoRLC } from '../../../src/utils';
import { VOUCHER_OWNER } from './constant';

export function mockGetIexecPoco(voucherHubAddress: string, pocoAddress: string): void {
    mockFunction(
        Address.fromString(voucherHubAddress),
        'getIexecPoco',
        'getIexecPoco():(address)',
        [],
        [ethereum.Value.fromAddress(Address.fromString(pocoAddress))],
        false,
    );
}

export function mockRegistryAddress(
    pocoAddress: string,
    registryType: string,
    registryAddress: string,
): void {
    mockFunction(
        Address.fromString(pocoAddress),
        registryType,
        `${registryType}():(address)`,
        [],
        [ethereum.Value.fromAddress(Address.fromString(registryAddress))],
        false,
    );
}

export function mockIsRegistered(
    registryAddress: string,
    assetAddress: string,
    isRegistered: boolean,
): void {
    mockFunction(
        Address.fromString(registryAddress),
        'isRegistered',
        'isRegistered(address):(bool)',
        [ethereum.Value.fromAddress(Address.fromString(assetAddress))],
        [ethereum.Value.fromBoolean(isRegistered)],
        false,
    );
}

export function mockGetterFunction(
    registryAddress: string,
    functionName: string,
    returnValue: string,
): void {
    mockFunction(
        Address.fromString(registryAddress),
        functionName,
        `${functionName}():(string)`,
        [],
        [ethereum.Value.fromString(returnValue)],
        false,
    );
}

export function mockVoucherContractCalls(
    voucherAddress: string,
    voucherHubAddress: string,
    dealId: Bytes,
    appPrice: BigDecimal,
    datasetPrice: BigDecimal,
    workerpoolPrice: BigDecimal,
): void {
    mockFunction(
        Address.fromString(voucherAddress),
        'getVoucherHub',
        'getVoucherHub():(address)',
        [],
        [ethereum.Value.fromAddress(Address.fromString(voucherHubAddress))],
        false,
    );
    let sponsoredAmount = workerpoolPrice.plus(appPrice).plus(datasetPrice);
    mockFunction(
        Address.fromString(voucherAddress),
        'getSponsoredAmount',
        'getSponsoredAmount(bytes32):(uint256)',
        [ethereum.Value.fromFixedBytes(dealId)],
        [ethereum.Value.fromUnsignedBigInt(toNanoRLC(sponsoredAmount))],
        false,
    );
}

export function mockPocoViewDeal(
    pocoAddress: string,
    voucherAddress: string,
    dealId: Bytes,
    appAddress: string,
    datasetAddress: string,
    workerpoolAddress: string,
    appPrice: BigDecimal,
    datasetPrice: BigDecimal,
    workerpoolPrice: BigDecimal,
): void {
    const dealTuple = createDealTuple(
        dealId,
        appAddress,
        appPrice,
        datasetAddress,
        datasetPrice,
        workerpoolAddress,
        workerpoolPrice,
        voucherAddress,
    );
    mockFunction(
        Address.fromString(pocoAddress),
        'viewDeal',
        'viewDeal(bytes32):(((address,address,uint256),(address,address,uint256),(address,address,uint256),uint256,uint256,bytes32,address,address,address,string,uint256,uint256,uint256,uint256,uint256,address))',
        [ethereum.Value.fromFixedBytes(dealId)],
        [ethereum.Value.fromTuple(dealTuple)],
        false,
    );
}

function createDealTuple(
    dealId: Bytes,
    appAddress: string,
    appPrice: BigDecimal,
    datasetAddress: string,
    datasetPrice: BigDecimal,
    workerpoolAddress: string,
    workerpoolPrice: BigDecimal,
    voucherAddress: string,
): ethereum.Tuple {
    const appTuple = createOrderTuple(appAddress, appPrice);
    const datasetTuple = createOrderTuple(datasetAddress, datasetPrice);
    const workerpoolTuple = createOrderTuple(workerpoolAddress, workerpoolPrice);

    const dealTuple = new ethereum.Tuple();
    dealTuple.push(ethereum.Value.fromTuple(appTuple)); // app
    dealTuple.push(ethereum.Value.fromTuple(datasetTuple)); // dataset
    dealTuple.push(ethereum.Value.fromTuple(workerpoolTuple)); // workerpool
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // trust
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // category
    dealTuple.push(ethereum.Value.fromFixedBytes(dealId)); // tag
    dealTuple.push(ethereum.Value.fromAddress(Address.fromString(VOUCHER_OWNER))); // requester
    dealTuple.push(ethereum.Value.fromAddress(Address.fromString(VOUCHER_OWNER))); // beneficiary
    dealTuple.push(ethereum.Value.fromAddress(Address.zero())); // callback
    dealTuple.push(ethereum.Value.fromString('')); // params
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // start time
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // bot first
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(5))); // bot size
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // worker stake
    dealTuple.push(ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(0))); // schedulerRewardRatio
    dealTuple.push(ethereum.Value.fromAddress(Address.fromString(voucherAddress))); // sponsor
    return dealTuple;
}

function createOrderTuple(address: string, price: BigDecimal): ethereum.Tuple {
    const tuple = new ethereum.Tuple();
    tuple.push(ethereum.Value.fromAddress(Address.fromString(address)));
    tuple.push(ethereum.Value.fromAddress(Address.fromString(VOUCHER_OWNER)));
    tuple.push(ethereum.Value.fromUnsignedBigInt(toNanoRLC(price)));
    return tuple;
}
