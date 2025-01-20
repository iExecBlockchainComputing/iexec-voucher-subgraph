import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts';

export class EventParam {
    constructor(
        public key: string,
        public value: ethereum.Value,
    ) {}
}

export class EventParamBuilder {
    private params: EventParam[] = [];

    static init(): EventParamBuilder {
        return new EventParamBuilder();
    }

    address(key: string, value: Address): EventParamBuilder {
        this.params.push(new EventParam(key, ethereum.Value.fromAddress(value)));
        return this;
    }

    bytes(key: string, value: Bytes): EventParamBuilder {
        this.params.push(new EventParam(key, ethereum.Value.fromBytes(value)));
        return this;
    }

    bigInt(key: string, value: BigInt): EventParamBuilder {
        this.params.push(new EventParam(key, ethereum.Value.fromUnsignedBigInt(value)));
        return this;
    }

    string(key: string, value: string): EventParamBuilder {
        this.params.push(new EventParam(key, ethereum.Value.fromString(value)));
        return this;
    }

    build(event: ethereum.Event): void {
        event.parameters = new Array<ethereum.EventParam>();
        for (let i = 0; i < this.params.length; i++) {
            event.parameters.push(
                new ethereum.EventParam(this.params[i].key, this.params[i].value),
            );
        }
    }
}
