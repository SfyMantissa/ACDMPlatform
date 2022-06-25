# DAOVoting









## Methods

### CHAIRMAN_ROLE

```solidity
function CHAIRMAN_ROLE() external view returns (bytes32)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | bytes32 | undefined |

### DAO_ROLE

```solidity
function DAO_ROLE() external view returns (bytes32)
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

### addProposal

```solidity
function addProposal(bytes _callData, address _recipient, string _description) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _callData | bytes | undefined |
| _recipient | address | undefined |
| _description | string | undefined |

### debatingPeriodDuration

```solidity
function debatingPeriodDuration() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### finishProposal

```solidity
function finishProposal(uint256 _proposalId) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _proposalId | uint256 | undefined |

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

### minimumQuorum

```solidity
function minimumQuorum() external view returns (uint256)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### proposals

```solidity
function proposals(uint256) external view returns (uint256 startTimeStamp, uint256 voteCount, uint256 positiveVoteCount, bool isFinished, address recipient, string description, bytes callData)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| startTimeStamp | uint256 | undefined |
| voteCount | uint256 | undefined |
| positiveVoteCount | uint256 | undefined |
| isFinished | bool | undefined |
| recipient | address | undefined |
| description | string | undefined |
| callData | bytes | undefined |

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

### setDebatingPeriodDuration

```solidity
function setDebatingPeriodDuration(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### setMinimumQuorum

```solidity
function setMinimumQuorum(uint256 _value) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _value | uint256 | undefined |

### staking

```solidity
function staking() external view returns (contract Staking)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract Staking | undefined |

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

### token

```solidity
function token() external view returns (contract IERC20)
```






#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | contract IERC20 | undefined |

### userToLastProposalId

```solidity
function userToLastProposalId(address) external view returns (uint256)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _0 | address | undefined |

#### Returns

| Name | Type | Description |
|---|---|---|
| _0 | uint256 | undefined |

### vote

```solidity
function vote(uint256 _proposalId, bool _decision) external nonpayable
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| _proposalId | uint256 | undefined |
| _decision | bool | undefined |



## Events

### ProposalAdded

```solidity
event ProposalAdded(uint256 proposalId, string description, uint256 startTimeStamp, address recipient)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| proposalId  | uint256 | undefined |
| description  | string | undefined |
| startTimeStamp  | uint256 | undefined |
| recipient  | address | undefined |

### ProposalFinished

```solidity
event ProposalFinished(uint256 proposalId, string description, bool decision, uint256 positiveVoteCount, uint256 voteCount)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| proposalId  | uint256 | undefined |
| description  | string | undefined |
| decision  | bool | undefined |
| positiveVoteCount  | uint256 | undefined |
| voteCount  | uint256 | undefined |

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

### VoteCasted

```solidity
event VoteCasted(uint256 proposalId, address voter, bool decision, uint256 votes)
```





#### Parameters

| Name | Type | Description |
|---|---|---|
| proposalId  | uint256 | undefined |
| voter  | address | undefined |
| decision  | bool | undefined |
| votes  | uint256 | undefined |



