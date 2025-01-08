import { BigInt } from '@graphprotocol/graph-ts';
import { Deal, Voucher } from '../generated/schema';
import { PoCo as PoCoContract } from '../generated/templates/Voucher/PoCo';
import {
    AccountAuthorized,
    AccountUnauthorized,
    OrdersMatchedWithVoucher,
    Voucher as VoucherContract,
} from '../generated/templates/Voucher/Voucher';
import { VoucherHub as VoucherHubContract } from '../generated/templates/Voucher/VoucherHub';
import {
    loadOrCreateAccount,
    loadOrCreateApp,
    loadOrCreateDataset,
    loadOrCreateWorkerpool,
    nRLCToRLC,
} from './utils';

export function handleAccountAuthorized(event: AccountAuthorized): void {
    let voucherId = event.address.toHex();
    let authorizedAccountId = event.params.account.toHex();
    let voucher = Voucher.load(voucherId);
    if (voucher) {
        loadOrCreateAccount(authorizedAccountId);
        let authorizedAccounts = voucher.authorizedAccounts;
        let existingEntry = authorizedAccounts.indexOf(authorizedAccountId);
        // add if not already in list
        if (existingEntry === -1) {
            authorizedAccounts.push(authorizedAccountId);
            voucher.authorizedAccounts = authorizedAccounts;
            voucher.save();
        }
    }
}

export function handleAccountUnauthorized(event: AccountUnauthorized): void {
    let voucherId = event.address.toHex();
    let unauthorizedAccountId = event.params.account.toHex();
    let voucher = Voucher.load(voucherId);
    if (voucher) {
        loadOrCreateAccount(unauthorizedAccountId);
        let authorizedAccounts = voucher.authorizedAccounts;
        let existingEntry = authorizedAccounts.indexOf(unauthorizedAccountId);
        // remove if exists
        if (existingEntry !== -1) {
            authorizedAccounts.splice(existingEntry, 1);
            voucher.authorizedAccounts = authorizedAccounts;
            voucher.save();
        }
    }
}

export function handleOrdersMatchedWithVoucher(event: OrdersMatchedWithVoucher): void {
    let voucherId = event.address.toHex();
    let dealId = event.params.dealId.toHex();
    let voucher = Voucher.load(voucherId);
    // do not index if voucher is unknown
    if (voucher) {
        let voucherContract = VoucherContract.bind(event.address);
        let voucherHubContract = VoucherHubContract.bind(voucherContract.getVoucherHub());
        let pocoContract = PoCoContract.bind(voucherHubContract.getIexecPoco());
        let sponsoredAmount = voucherContract.getSponsoredAmount(event.params.dealId);
        // do not index deals if sponsored amount is 0
        if (sponsoredAmount.gt(new BigInt(0))) {
            let deal = new Deal(dealId);
            deal.timestamp = event.block.timestamp;
            deal.sponsor = voucherId;
            deal.sponsoredAmount = nRLCToRLC(sponsoredAmount);

            let pocoDeal = pocoContract.viewDeal(event.params.dealId);

            let app = loadOrCreateApp(pocoDeal.app.pointer);
            deal.app = app.id;

            // create dataset if a dataset is used
            if (
                pocoDeal.dataset.pointer.toHex() != // != because !== does not work
                '0x0000000000000000000000000000000000000000'
            ) {
                let dataset = loadOrCreateDataset(pocoDeal.dataset.pointer);
                deal.dataset = dataset.id;
            }

            let workerpool = loadOrCreateWorkerpool(pocoDeal.workerpool.pointer);
            deal.workerpool = workerpool.id;

            let requester = loadOrCreateAccount(pocoDeal.requester.toHex());
            deal.requester = requester.id;

            deal.appPrice = nRLCToRLC(pocoDeal.app.price);
            deal.datasetPrice = nRLCToRLC(pocoDeal.dataset.price);
            deal.workerpoolPrice = nRLCToRLC(pocoDeal.workerpool.price);

            deal.botSize = pocoDeal.botSize;

            deal.save();
        }
    }
}
