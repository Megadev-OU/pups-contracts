require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("@openzeppelin/hardhat-upgrades");
require("solidity-coverage");
require("dotenv/config");

require("hardhat-abi-exporter");

const forkingAccountsBalance = `50000${"0".repeat(18)}`;

let realAccounts = [
	{
		privateKey: `0x${process.env.ownerKey}`,
		balance: forkingAccountsBalance,
	},
];

module.exports = {
	defaultNetwork: "hardhat",
	networks: {
		hardhat: {
			accounts: realAccounts,
			chainId: 1337,
		},
		local: {
			url: "http://127.0.0.1:8545",
			chainId: 1337,
			accounts: [`0x${process.env.ownerKey}`],
			gasPrice: 20000000000,
			gas: 30000000,
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${process.env.infuraProjectRinkenbyId}`,
			accounts: [`0x${process.env.ownerKey}`],
			gasPrice: 2000000000,
		},
		godwokentest: {
			url: `https://godwoken-testnet-v1.ckbapp.dev`,
			accounts: [`0x${process.env.ownerKey}`],
			gasPrice: 90000000000000,
		},
		godwoken: {
			url: `https://v1.mainnet.godwoken.io/rpc`,
			accounts: [`0x${process.env.ownerKey}`],
			gasPrice: 90000000000000,
		},
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.infuraProjectMainbyId}`,
			accounts: [`0x${process.env.ownerKey}`],
			gasPrice: 60000000000,
		},
	},
	etherscan: {
		apiKey: {
			mainnet: process.env.ETHSCANAPIKEY,
			rinkeby: process.env.ETHSCANAPIKEY,
		},
	},
	solidity: {
		version: "0.8.9",
		docker: false,
		settings: {
			optimizer: {
				enabled: true,
				runs: 99999,
			},
		},
	},
	plugins: ["solidity-coverage"],
	testsTimeout: 10000000,
};
