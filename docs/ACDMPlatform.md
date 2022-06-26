# ACDMPlatform

*Sfy Mantissa*

> A DAO proposal voting implementation with ERC-20 tokens.





## Methods

### DAO

```solidity
function DAO() external view returns (bytes32)
```



*Used to identify DAO contract.*


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



*Used to set the initial sale price.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### INITIAL_VOLUME

```solidity
function INITIAL_VOLUME() external view returns (uint256)
```



*Used to set the initial sale volume.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### REGISTERED

```solidity
function REGISTERED() external view returns (bytes32)
```



*Used to identify registered users.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### acdmToken

```solidity
function acdmToken() external view returns (contract ACDMToken)
```



*ACDM Token instance.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract ACDMToken | undefined |

### addOrder

```solidity
function addOrder(uint256 price, uint256 amount) external nonpayable
```



*Place an order to trade.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| price | uint256 | Price of the provided assets. |
| amount | uint256 | Quantity of the provided assets. |

### burnTokens

```solidity
function burnTokens() external nonpayable
```



*Buy XXX Coins for all commission and burn      them (can ONLY be decided by a vote).*


### buyACDM

```solidity
function buyACDM() external payable
```



*Buy ACDM tokens.*


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



*List of all placed orders.*

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



*Address of the contract&#39;s deployer.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### redeemOrder

```solidity
function redeemOrder(uint256 orderId, uint256 amount) external payable
```



*Redeem an order fully or partially.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId | uint256 | ID of the order to redeem. |
| amount | uint256 | Quantity of assets to redeem. |

### refererOneCommission

```solidity
function refererOneCommission() external view returns (uint256)
```



*Commission for the first referer in the sale round.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### refererTradeCommission

```solidity
function refererTradeCommission() external view returns (uint256)
```



*Commission for each referer per trade.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### refererTwoCommission

```solidity
function refererTwoCommission() external view returns (uint256)
```



*Commission for the second referer in the sale round.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### register

```solidity
function register(address referer) external nonpayable
```



*Allows the user to register.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| referer | address | User&#39;s referer.        Set to address(0) if there&#39;s no referer. |

### removeOrder

```solidity
function removeOrder(uint256 orderId) external nonpayable
```



*Remove an order from trade.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId | uint256 | ID of the order to remove. |

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

### salePrice

```solidity
function salePrice() external view returns (uint256)
```



*Sale price.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### setRefererOneCommission

```solidity
function setRefererOneCommission(uint256 _value) external nonpayable
```



*Change 1st referer sale commission (can ONLY be decided by a vote).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### setRefererTradeCommission

```solidity
function setRefererTradeCommission(uint256 _value) external nonpayable
```



*Change referer trade commission (can ONLY be decided by a vote).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### setRefererTwoCommission

```solidity
function setRefererTwoCommission(uint256 _value) external nonpayable
```



*Change 2nd referer sale commission (can ONLY be decided by a vote).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### startSaleRound

```solidity
function startSaleRound() external nonpayable
```



*Start the sale round.*


### startTradeRound

```solidity
function startTradeRound() external nonpayable
```



*Start the trade round.*


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



*Trade volume.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### uniV2Router

```solidity
function uniV2Router() external view returns (contract IUniswapV2Router02)
```



*Uniswap V2 Router instance.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IUniswapV2Router02 | undefined |

### wethAddress

```solidity
function wethAddress() external view returns (address)
```



*Address of WETH token on the network.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

### withdrawCommission

```solidity
function withdrawCommission() external nonpayable
```



*Withdraw the commission to owner (can ONLY be decided by a vote).*


### xxxToken

```solidity
function xxxToken() external view returns (contract XXXToken)
```



*XXX Coin instance.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract XXXToken | undefined |

### xxxTokenAddress

```solidity
function xxxTokenAddress() external view returns (address)
```



*Address of the XXX Coin on the network.*


#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |



## Events

### ACDMBought

```solidity
event ACDMBought(address userAddress, uint256 amount)
```



*Emits when a user buys ACDM tokens.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| userAddress  | address | undefined |
| amount  | uint256 | undefined |

### OrderAdded

```solidity
event OrderAdded(uint256 orderId, address seller, uint256 price, uint256 availableAmount)
```



*Emits when a user adds an order.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId  | uint256 | undefined |
| seller  | address | undefined |
| price  | uint256 | undefined |
| availableAmount  | uint256 | undefined |

### OrderRedeemed

```solidity
event OrderRedeemed(uint256 orderId, address buyer, uint256 deductedAmount)
```



*Emits when a user buys an order (partially or not).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId  | uint256 | undefined |
| buyer  | address | undefined |
| deductedAmount  | uint256 | undefined |

### OrderRemoved

```solidity
event OrderRemoved(uint256 orderId, uint256 leftAmount)
```



*Emits when a user removes an order.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| orderId  | uint256 | undefined |
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



*Emits when a sale or trade round starts.*

#### Parameters

| Name | Type | Description |
|---|---|---|
| finishTime  | uint256 | undefined |
| round  | enum ACDMPlatform.RoundType | undefined |

### UserRegistered

```solidity
event UserRegistered(address userAddress, address refererAddress)
```



*Emits when a user registers.      In case there&#39;s no referer, `refererAddress` should be set       to address(0).*

#### Parameters

| Name | Type | Description |
|---|---|---|
| userAddress  | address | undefined |
| refererAddress  | address | undefined |



