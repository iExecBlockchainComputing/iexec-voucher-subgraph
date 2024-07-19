import {
  Approval as ApprovalEvent,
  DefaultAdminDelayChangeCanceled as DefaultAdminDelayChangeCanceledEvent,
  DefaultAdminDelayChangeScheduled as DefaultAdminDelayChangeScheduledEvent,
  DefaultAdminTransferCanceled as DefaultAdminTransferCanceledEvent,
  DefaultAdminTransferScheduled as DefaultAdminTransferScheduledEvent,
  EligibleAssetAdded as EligibleAssetAddedEvent,
  EligibleAssetRemoved as EligibleAssetRemovedEvent,
  Initialized as InitializedEvent,
  RoleAdminChanged as RoleAdminChangedEvent,
  RoleGranted as RoleGrantedEvent,
  RoleRevoked as RoleRevokedEvent,
  Transfer as TransferEvent,
  Upgraded as UpgradedEvent,
  VoucherCreated as VoucherCreatedEvent,
  VoucherDebited as VoucherDebitedEvent,
  VoucherDrained as VoucherDrainedEvent,
  VoucherRefunded as VoucherRefundedEvent,
  VoucherToppedUp as VoucherToppedUpEvent,
  VoucherTypeCreated as VoucherTypeCreatedEvent,
  VoucherTypeDescriptionUpdated as VoucherTypeDescriptionUpdatedEvent,
  VoucherTypeDurationUpdated as VoucherTypeDurationUpdatedEvent,
} from "../generated/VoucherHub/VoucherHub"
import {
  Approval,
  DefaultAdminDelayChangeCanceled,
  DefaultAdminDelayChangeScheduled,
  DefaultAdminTransferCanceled,
  DefaultAdminTransferScheduled,
  EligibleAssetAdded,
  EligibleAssetRemoved,
  Initialized,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked,
  Transfer,
  Upgraded,
  VoucherCreated,
  VoucherDebited,
  VoucherDrained,
  VoucherRefunded,
  VoucherToppedUp,
  VoucherTypeCreated,
  VoucherTypeDescriptionUpdated,
  VoucherTypeDurationUpdated,
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.owner = event.params.owner
  entity.spender = event.params.spender
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDefaultAdminDelayChangeCanceled(
  event: DefaultAdminDelayChangeCanceledEvent,
): void {
  let entity = new DefaultAdminDelayChangeCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDefaultAdminDelayChangeScheduled(
  event: DefaultAdminDelayChangeScheduledEvent,
): void {
  let entity = new DefaultAdminDelayChangeScheduled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newDelay = event.params.newDelay
  entity.effectSchedule = event.params.effectSchedule

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDefaultAdminTransferCanceled(
  event: DefaultAdminTransferCanceledEvent,
): void {
  let entity = new DefaultAdminTransferCanceled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDefaultAdminTransferScheduled(
  event: DefaultAdminTransferScheduledEvent,
): void {
  let entity = new DefaultAdminTransferScheduled(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.newAdmin = event.params.newAdmin
  entity.acceptSchedule = event.params.acceptSchedule

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEligibleAssetAdded(event: EligibleAssetAddedEvent): void {
  let entity = new EligibleAssetAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.VoucherHub_id = event.params.id
  entity.asset = event.params.asset

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEligibleAssetRemoved(
  event: EligibleAssetRemovedEvent,
): void {
  let entity = new EligibleAssetRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.VoucherHub_id = event.params.id
  entity.asset = event.params.asset

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.version = event.params.version

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleAdminChanged(event: RoleAdminChangedEvent): void {
  let entity = new RoleAdminChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.previousAdminRole = event.params.previousAdminRole
  entity.newAdminRole = event.params.newAdminRole

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleGranted(event: RoleGrantedEvent): void {
  let entity = new RoleGranted(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRoleRevoked(event: RoleRevokedEvent): void {
  let entity = new RoleRevoked(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.role = event.params.role
  entity.account = event.params.account
  entity.sender = event.params.sender

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUpgraded(event: UpgradedEvent): void {
  let entity = new Upgraded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.implementation = event.params.implementation

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherCreated(event: VoucherCreatedEvent): void {
  let entity = new VoucherCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voucher = event.params.voucher
  entity.owner = event.params.owner
  entity.voucherType = event.params.voucherType
  entity.expiration = event.params.expiration
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherDebited(event: VoucherDebitedEvent): void {
  let entity = new VoucherDebited(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voucher = event.params.voucher
  entity.sponsoredAmount = event.params.sponsoredAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherDrained(event: VoucherDrainedEvent): void {
  let entity = new VoucherDrained(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voucher = event.params.voucher
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherRefunded(event: VoucherRefundedEvent): void {
  let entity = new VoucherRefunded(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voucher = event.params.voucher
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherToppedUp(event: VoucherToppedUpEvent): void {
  let entity = new VoucherToppedUp(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.voucher = event.params.voucher
  entity.expiration = event.params.expiration
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherTypeCreated(event: VoucherTypeCreatedEvent): void {
  let entity = new VoucherTypeCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.VoucherHub_id = event.params.id
  entity.description = event.params.description
  entity.duration = event.params.duration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherTypeDescriptionUpdated(
  event: VoucherTypeDescriptionUpdatedEvent,
): void {
  let entity = new VoucherTypeDescriptionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.VoucherHub_id = event.params.id
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoucherTypeDurationUpdated(
  event: VoucherTypeDurationUpdatedEvent,
): void {
  let entity = new VoucherTypeDurationUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.VoucherHub_id = event.params.id
  entity.duration = event.params.duration

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
