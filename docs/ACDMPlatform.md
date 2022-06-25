# ACDMPlatform









## Methods

### DAO

```solidity
function DAO() external view returns (bytes32)
```






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

### INITIAL_PRICE

```solidity
function INITIAL_PRICE() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### INITIAL_VOLUME

```solidity
function INITIAL_VOLUME() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### REGISTERED

```solidity
function REGISTERED() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### _sellAmount

```solidity
function _sellAmount() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### _totalCommissionEth

```solidity
function _totalCommissionEth() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### acdmTokenAddress

```solidity
function acdmTokenAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### addOrder

```solidity
function addOrder(uint256 price, uint256 amount) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| price | uint256 | undefined |
| amount | uint256 | undefined |

### burnTokens

```solidity
function burnTokens() external nonpayable
```






### buyACDM

```solidity
function buyACDM() external payable
```






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

### orders

```solidity
function orders(uint256) external view returns (address seller, uint256 price, uint256 availableAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| seller | address | undefined |
| price | uint256 | undefined |
| availableAmount | uint256 | undefined |

### owner

```solidity
function owner() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### redeemOrder

```solidity
function redeemOrder(uint256 orderId, uint256 amount) external payable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId | uint256 | undefined |
| amount | uint256 | undefined |

### refererOneCommission

```solidity
function refererOneCommission() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### refererTradeCommission

```solidity
function refererTradeCommission() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### refererTwoCommission

```solidity
function refererTwoCommission() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### register

```solidity
function register(address referer) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| referer | address | undefined |

### removeOrder

```solidity
function removeOrder(uint256 orderId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId | uint256 | undefined |

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

### sellPrice

```solidity
function sellPrice() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### setRefererOneCommission

```solidity
function setRefererOneCommission(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### setRefererTradeCommission

```solidity
function setRefererTradeCommission(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### setRefererTwoCommission

```solidity
function setRefererTwoCommission(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### startSaleRound

```solidity
function startSaleRound() external nonpayable
```






### startTradeRound

```solidity
function startTradeRound() external nonpayable
```






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

### tradeVolume

```solidity
function tradeVolume() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### uniswapV2Router

```solidity
function uniswapV2Router() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### weth

```solidity
function weth() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### withdrawCommission

```solidity
function withdrawCommission() external nonpayable
```






### xxxTokenAddress

```solidity
function xxxTokenAddress() external view returns (address)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### ACDMBought

```solidity
event ACDMBought(address userAddress, uint256 amount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| userAddress  | address | undefined |
| amount  | uint256 | undefined |

### OrderAdded

```solidity
event OrderAdded(uint256 indexed orderId, address indexed seller, uint256 indexed price, uint256 availableAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId `indexed` | uint256 | undefined |
| seller `indexed` | address | undefined |
| price `indexed` | uint256 | undefined |
| availableAmount  | uint256 | undefined |

### OrderRedeemed

```solidity
event OrderRedeemed(uint256 indexed orderId, address indexed buyer, uint256 deductedAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId `indexed` | uint256 | undefined |
| buyer `indexed` | address | undefined |
| deductedAmount  | uint256 | undefined |

### OrderRemoved

```solidity
event OrderRemoved(uint256 indexed orderId, uint256 leftAmount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId `indexed` | uint256 | undefined |
| leftAmount  | uint256 | undefined |

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

### RoundStarted

```solidity
event RoundStarted(uint256 finishTime, enum ACDMPlatform.RoundType round)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| finishTime  | uint256 | undefined |
| round  | enum ACDMPlatform.RoundType | undefined |

### UserRegistered

```solidity
event UserRegistered(address userAddress, address refererAddress)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| userAddress  | address | undefined |
| refererAddress  | address | undefined |



