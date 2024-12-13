import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { Account, App, Dataset, Workerpool } from "../generated/schema";
import { App as AppContract } from "../generated/templates/Voucher/App";
import { Dataset as DatasetContract } from "../generated/templates/Voucher/Dataset";
import { Workerpool as WorkerpoolContract } from "../generated/templates/Voucher/Workerpool";

export function loadOrCreateAccount(id: string): Account {
  let account = Account.load(id);
  if (!account) {
    account = new Account(id);
    account.save();
  }
  return account;
}

export function loadOrCreateApp(address: Address): App {
  let app = App.load(address.toHex());
  if (!app) {
    app = new App(address.toHex());
    let contract = AppContract.bind(address);
    app.name = contract.m_appName();
    app.save();
  }
  return app;
}

export function loadOrCreateDataset(address: Address): Dataset {
  let dataset = Dataset.load(address.toHex());
  if (!dataset) {
    dataset = new Dataset(address.toHex());
    let contract = DatasetContract.bind(address);
    dataset.name = contract.m_datasetName();
    dataset.save();
  }
  return dataset;
}

export function loadOrCreateWorkerpool(address: Address): Workerpool {
  let workerpool = Workerpool.load(address.toHex());
  if (!workerpool) {
    workerpool = new Workerpool(address.toHex());
    let contract = WorkerpoolContract.bind(address);
    workerpool.description = contract.m_workerpoolDescription();
    workerpool.save();
  }
  return workerpool;
}

export function getEventId(event: ethereum.Event): string {
  return (
    event.transaction.hash.toHex() + "_" + event.transactionLogIndex.toString()
  );
}

export function nRLCToRLC(value: BigInt): BigInt {
  let divisor = BigInt.fromI32(1_000_000_000);
  return value.div(divisor);
}
