# event-nft
All comands must be executed in root folder of project

## Installation

For install all dependencies
```
npm install 
```

## Usage

You need  reanme ```.env.example``` to ```.env``` and put your account private key to ownerKey field

### Test
After that you can run test

For run test on local machine on hardhat network

```npm run test```

Or you can run test on Rinkeby Network (you need balance on your account)

```npm run test:rinkeby```

Also you can check test coverage of Smart Contracts

```npm run test:coverage```

### Deploy 

Deploy on Rinkeby (you need balance on your account)

```npm run deploy:rinkeby```

Deploy on Mainnet (you need balance on your account)

```npm run deploy:mainnet```

All deploy comand will return in terminal contract verification comand, which will verify you easely your contract

Example
```yarn hardhat verify --network rinkeby 0x248C2F7EFbACB0A022f1f6357691f4391fbA232c```

You just need copy paste it in terminal and run it