// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract XXXToken is ERC20, AccessControl {

  bytes32 public constant MANIPULATOR_ROLE = keccak256("MANIPULATOR_ROLE");

  constructor(address _externalManipulator) ERC20("XXX Coin", "XXX") {
    _mint(msg.sender, 10000);
    _setupRole(MANIPULATOR_ROLE, msg.sender);
    _setupRole(MANIPULATOR_ROLE, _externalManipulator);
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
