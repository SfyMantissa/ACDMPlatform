# Staking









## Methods

### changeLockInterval

```solidity
function changeLockInterval(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### changeRewardInterval

```solidity
function changeRewardInterval(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### changeRewardPercentage

```solidity
function changeRewardPercentage(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### claim

```solidity
function claim() external nonpayable
```






### lockInterval

```solidity
function lockInterval() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address)
```



*Returns the address of the current owner.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### renounceOwnership

```solidity
function renounceOwnership() external nonpayable
```



*Leaves the contract without owner. It will not be possible to call `onlyOwner` functions anymore. Can only be called by the current owner. NOTE: Renouncing ownership will leave the contract without an owner, thereby removing any functionality that is only available to the owner.*


### rewardInterval

```solidity
function rewardInterval() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardPercentage

```solidity
function rewardPercentage() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### rewardTokenAddress

```solidity
function rewardTokenAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### stake

```solidity
function stake(uint256 _amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _amount | uint256 | undefined |

### stakeOf

```solidity
function stakeOf(address) external view returns (uint256 balance, uint256 stakeStartTimestamp, uint256 stakeEndTimestamp, uint256 lastClaimTimestamp)
```





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






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### transferOwnership

```solidity
function transferOwnership(address newOwner) external nonpayable
```



*Transfers ownership of the contract to a new account (`newOwner`). Can only be called by the current owner.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| newOwner | address | undefined |

### unstake

```solidity
function unstake() external nonpayable
```








## Events

### Claimed

```solidity
event Claimed(address to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to  | address | undefined |
| amount  | uint256 | undefined |

### OwnershipTransferred

```solidity
event OwnershipTransferred(address indexed previousOwner, address indexed newOwner)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| previousOwner `indexed` | address | undefined |
| newOwner `indexed` | address | undefined |

### Staked

```solidity
event Staked(address from, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| from  | address | undefined |
| amount  | uint256 | undefined |

### Unstaked

```solidity
event Unstaked(address to, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| to  | address | undefined |
| amount  | uint256 | undefined |



