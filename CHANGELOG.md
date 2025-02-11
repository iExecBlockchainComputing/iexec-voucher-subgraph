# Changelog

## vNEXT

## v1.1.0

### Added

- Support for `RoleGranted` and `RoleRevoked` event handling in the voucherHub module (#19):
  - Recognized roles are now mapped to specific names:
    - DEFAULT_ADMIN_ROLE (`0x00`)
    - UPGRADER_ROLE (`0x189ab7a9244df0848122154315af71fe140f3db0fe014031783b0946b8c9d2e3`)
    - MANAGER_ROLE (`0x241ecf16d79d0f8dbfb92cbc07fe17840425976cf0667f022fe9877caa831b08`)
    - MINTER_ROLE (`0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6`)
  - Unrecognized roles are labeled as UNKNOWN_ROLE.

### Changed

- [BREAKING] Update: Transition to RLC as the Unit in Subgraph Fields. The unit for several fields in the subgraph will be updated from nRLC to RLC (#11). The impacted fields include:
  - appPrice
  - datasetPrice
  - workerpoolPrice
  - sponsoredAmount
  - drainedAmount
  - refundedAmount
  - topUpValue
  - value

- Add unit tests for Event:
  - voucherCreated
  - AccountAuthorized, AccountUnauthorized (#20)
  - VoucherTypeDurationUpdated, VoucherTypeDescriptionUpdated (#21)
  - VoucherTypeCreated (#22)
  - VoucherDrained (#24)
- Set voucher balance, value, app/dataset/workerpool price as BigDecimal (#23)
- Update Jenkins deployer to have new IPFS and GraphNode URLs (#25)

## v1.0.0
