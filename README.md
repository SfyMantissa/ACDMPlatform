# Description

📈 ACDM trading platform.

## Features

- [x] Each of 5 smart contracts is verified on Etherscan:
    - [XXXToken](https://rinkeby.etherscan.io/address/0xe8cFcc36373Ab8741C013A80A9178d2380340320#code)
    - [ACDMToken](https://rinkeby.etherscan.io/address/0x050Db22eBbE3E1f08D2C1A70c9b6C8EfABd2bEf9#code)
    - [Staking](https://rinkeby.etherscan.io/address/0xe20962a4F01F6F8519C6a3862fDe8b39D9E44Fe3#code)
    - [DAO](https://rinkeby.etherscan.io/address/0xA565D30BEB272B69125Ff7d77476D7D34A7A53Af#code)
    - [ACDMPlatform](https://rinkeby.etherscan.io/address/0x9dc67b28b32d859f38980a074e6b63207d4B8581#code)
- [x] Each contract has a comprehensive NatSpec documentation.
- [x] Utility scripts are located in _utils/_ to ease deployment.
- [x] Deployment scripts for each contract are stored in _deploy/_.
- [x] Ordered tests with 100% coverage are located in _test/_.
- [x] All core methods are covered by tasks, they are stored in _tasks/_.

## Usage

1. Recommended deployment order is:
`Tokens → Staking → DAO → ACDMPlatform → Post-deploy utils.`

2. Note various methods which allow manipulation only via DAO votings.
You may find examples of such in tests.

## Demonstration

![](demo/tests.png)
