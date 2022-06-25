// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract ACDMToken is ERC20, AccessControl {

  bytes32 public constant MANIPULATOR_ROLE = keccak256("MANIPULATOR_ROLE");

  constructor(address _externalManipulator) ERC20("ACADEM Coin", "ACDM") {
    _mint(msg.sender, 10000);
    _setupRole(MANIPULATOR_ROLE, msg.sender);
    _setupRole(MANIPULATOR_ROLE, _externalManipulator);
  }

  function decimals() public pure override returns (uint8) {
    return 6;
  }

  function mint(address account, uint256 amount)
    external
    // onlyRole(MANIPULATOR_ROLE)
  {
    _mint(account, amount);
  }

  function burn(address account, uint256 amount)
    external
    // onlyRole(MANIPULATOR_ROLE)
  {
    _burn(account, amount);
  }

}
