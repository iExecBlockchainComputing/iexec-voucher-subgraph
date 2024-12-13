import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  beforeEach,
} from "matchstick-as/assembly/index";
import { Address, BigInt } from "@graphprotocol/graph-ts";
import { createVoucherCreatedEvent } from "./utils/utils";
import { VoucherType, App } from "../../generated/schema";
import { handleVoucherCreated } from "../../src/voucherHub";

describe("VoucherCreatedEvent", () => {
  beforeEach(() => {
    clearStore();
  });

  afterEach(() => {
    clearStore();
  });

  test("Should create a new Voucher when VoucherType exists", () => {
    // --- GIVEN
    let voucherTypeId = "1";
    let voucherType = new VoucherType(voucherTypeId);
    voucherType.description = "Test Voucher Type";
    voucherType.duration = BigInt.fromI32(86400); // 1 day in seconds

    // Create a mock App
    let appId = "app1";
    let app = new App(appId);
    app.name = "Test App";
    app.save();
    voucherType.eligibleAssets = [appId];
    voucherType.save();

    let voucherAddress = "0x1234567890123456789012345678901234567890";
    let owner = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
    let value = BigInt.fromI32(2_000_000_000); // in nRLC
    let expiration = BigInt.fromI32(1234567890);

    // --- WHEN
    let event = createVoucherCreatedEvent(
      Address.fromString(voucherAddress),
      Address.fromString(owner),
      BigInt.fromString(voucherTypeId),
      value,
      expiration
    );
    handleVoucherCreated(event);

    // --- THEN
    assert.entityCount("Voucher", 1);
    assert.entityCount("VoucherCreation", 1);

    assert.fieldEquals("Voucher", voucherAddress, "voucherType", voucherTypeId);
    assert.fieldEquals("Voucher", voucherAddress, "owner", owner);
    assert.fieldEquals("Voucher", voucherAddress, "value", "2");
    assert.fieldEquals("Voucher", voucherAddress, "balance", "2");
    assert.fieldEquals(
      "Voucher",
      voucherAddress,
      "expiration",
      expiration.toString()
    );
  });

  test("Should not create a Voucher when VoucherType does not exist", () => {
    // --- GIVEN
    let voucherTypeId = "2";
    let voucherAddress = "0x1234567890123456789012345678901234567890";
    let owner = "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd";
    let value = BigInt.fromI32(3_000_000_000); // in nRLC
    let expiration = BigInt.fromI32(1234567890);

    // --- WHEN
    let event = createVoucherCreatedEvent(
      Address.fromString(voucherAddress),
      Address.fromString(owner),
      BigInt.fromString(voucherTypeId),
      value,
      expiration
    );
    handleVoucherCreated(event);

    // --- THEN
    assert.entityCount("Voucher", 0);
    assert.entityCount("VoucherCreation", 0);
  });
});
