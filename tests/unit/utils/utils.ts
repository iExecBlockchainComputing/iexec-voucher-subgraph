import { newMockEvent } from "matchstick-as/assembly/index";
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts";
import { VoucherCreated } from "../../../generated/VoucherHub/VoucherHub";

export function createVoucherCreatedEvent(
  voucher: Address,
  owner: Address,
  voucherType: BigInt,
  value: BigInt,
  expiration: BigInt
): VoucherCreated {
  let mockEvent = newMockEvent();
  let event = new VoucherCreated(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    mockEvent.receipt
  );

  event.parameters = new Array();

  event.parameters.push(
    new ethereum.EventParam("voucher", ethereum.Value.fromAddress(voucher))
  );
  event.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  );
  event.parameters.push(
    new ethereum.EventParam(
      "voucherType",
      ethereum.Value.fromUnsignedBigInt(voucherType)
    )
  );
  event.parameters.push(
    new ethereum.EventParam(
      "expiration",
      ethereum.Value.fromUnsignedBigInt(expiration)
    )
  );
  event.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  );

  return event;
}
