import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts';
import { Account, App, Dataset, Role, Workerpool } from '../generated/schema';
import { App as AppContract } from '../generated/templates/Voucher/App';
import { Dataset as DatasetContract } from '../generated/templates/Voucher/Dataset';
import { Workerpool as WorkerpoolContract } from '../generated/templates/Voucher/Workerpool';

export function loadOrCreateAccount(id: string): Account {
    let account = Account.load(id);
    if (!account) {
        account = new Account(id);
        account.save();
    }
    return account;
}

export function loadOrCreateRole(id: string): Role {
    let role = Role.load(id);
    if (!role) {
        role = new Role(id);
        role.name = getRoleName(id);
        role.save();
    }
    return role;
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
    return event.transaction.hash.toHex() + '_' + event.transactionLogIndex.toString();
}

export function nRLCToRLC(value: BigInt): BigInt {
    let divisor = BigInt.fromI32(1_000_000_000);
    return value.div(divisor);
}

export function getRoleName(roleId: string): string {
    if (roleId == '0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3') {
        return 'UPGRADER_ROLE';
    } else if (roleId == '0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08') {
        return 'MANAGER_ROLE';
    } else if (roleId == '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6') {
        return 'MINTER_ROLE';
    } else {
        return 'UNKNOWN_ROLE';
    }
}
