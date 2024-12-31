import { Address, ethereum } from '@graphprotocol/graph-ts';
import { mockFunction } from 'matchstick-as';

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
