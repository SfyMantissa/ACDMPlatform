# Staking

*Sfy Mantissa*

> A simple ERC-20 staking contract for the Uniswap testnet.





## Methods

### DAO

```solidity
function DAO() external view returns (bytes32)
```



*Role for DAO.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### DEFAULT_ADMIN_ROLE

```solidity
function DEFAULT_ADMIN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### changeLockInterval

```solidity
function changeLockInterval(uint256 _value) external nonpayable
```

Allows to change the lockInterval via DAO voting.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | The new lockInterval value. |

### claim

```solidity
function claim() external nonpayable
```

Allows the user to claim the reward.




### getRoleAdmin

```solidity
function getRoleAdmin(bytes32 role) external view returns (bytes32)
```



*Returns the admin role that controls `role`. See {grantRole} and {revokeRole}. To change a role&#39;s admin, use {_setRoleAdmin}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### grantRole

```solidity
function grantRole(bytes32 role, address account) external nonpayable
```



*Grants `role` to `account`. If `account` had not been already granted `role`, emits a {RoleGranted} event. Requirements: - the caller must have ``role``&#39;s admin role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### hasRole

```solidity
function hasRole(bytes32 role, address account) external view returns (bool)
```



*Returns `true` if `account` has been granted `role`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### lockInterval

```solidity
function lockInterval() external view returns (uint256)
```

Get the interval for which `claim()`         function remains unavailable.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### renounceRole

```solidity
function renounceRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from the calling account. Roles are often managed via {grantRole} and {revokeRole}: this function&#39;s purpose is to provide a mechanism for accounts to lose their privileges if they are compromised (such as when a trusted device is misplaced). If the calling account had been revoked `role`, emits a {RoleRevoked} event. Requirements: - the caller must be `account`.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### revokeRole

```solidity
function revokeRole(bytes32 role, address account) external nonpayable
```



*Revokes `role` from `account`. If `account` had been granted `role`, emits a {RoleRevoked} event. Requirements: - the caller must have ``role``&#39;s admin role.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| role | bytes32 | undefined |
| account | address | undefined |

### rewardInterval

```solidity
function rewardInterval() external view returns (uint256)
```

Get the interval for reward returns.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardPercentage

```solidity
function rewardPercentage() external view returns (uint256)
```

Get the percentage of staked tokens which is returned every         rewardInterval as reward tokens.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardTokenAddress

```solidity
function rewardTokenAddress() external view returns (address)
```

Get the reward token address.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### stake

```solidity
function stake(uint256 _amount) external nonpayable
```

Allows the user to stake a specified `amount` of tokens.



#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | The amount of tokens to be staked. |

### stakeOf

```solidity
function stakeOf(address) external view returns (uint256 balance, uint256 stakeStartTimestamp, uint256 stakeEndTimestamp, uint256 lastClaimTimestamp)
```

Get user&#39;s stake data.

*balance is current amount of tokens staked by user.      stakeStartTimestamp is the UNIX timestamp of last stake      made by the user.      stakeEndTimestamp is the UNIX timestamp of the user      calling claim().      claimedReward is the flag to tell whether the      user already claimed the reward.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| balance | uint256 | undefined |
| stakeStartTimestamp | uint256 | undefined |
| stakeEndTimestamp | uint256 | undefined |
| lastClaimTimestamp | uint256 | undefined |

### stakeTokenAddress

```solidity
function stakeTokenAddress() external view returns (address)
```

Get the stake token address.




#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```



*See {IERC165-supportsInterface}.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| interfaceId | bytes4 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bool | undefined |

### unstake

```solidity
function unstake() external nonpayable
```

Allows the user to unstake all staked tokens.






## Events

### Claimed

```solidity
event Claimed(address to, uint256 amount)
```

Get triggered when the reward is claimed by the account.



#### Parameters

| Name | Type | Description |
|---|---|---|
| to  | address | undefined |
| amount  | uint256 | undefined |

### RoleAdminChanged

```solidity
event RoleAdminChanged(bytes32 indexed role, bytes32 indexed previousAdminRole, bytes32 indexed newAdminRole)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| previousAdminRole `indexed` | bytes32 | undefined |
| newAdminRole `indexed` | bytes32 | undefined |

### RoleGranted

```solidity
event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### RoleRevoked

```solidity
event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| role `indexed` | bytes32 | undefined |
| account `indexed` | address | undefined |
| sender `indexed` | address | undefined |

### Staked

```solidity
event Staked(address from, uint256 amount)
```

Gets triggered when tokens are staked by the account.



#### Parameters

| Name | Type | Description |
|---|---|---|
| from  | address | undefined |
| amount  | uint256 | undefined |

### Unstaked

```solidity
event Unstaked(address to, uint256 amount)
```

Gets triggered when tokens are unstaked by the account.



#### Parameters

| Name | Type | Description |
|---|---|---|
| to  | address | undefined |
| amount  | uint256 | undefined |



