const { ethers, upgrades } = require("hardhat");

async function mine(sleepDuration) {
	if (sleepDuration) {
		await ethers.provider.send("evm_increaseTime", [sleepDuration]);
	}

	return ethers.provider.send("evm_mine");
}

async function getFactories(owner) {
	let factories = {};

	factories.EventERC1155UriStorage = await ethers.getContractFactory("EventERC1155UriStorage", owner);
	return factories;
}

async function localDeployLinks() {
	[owner] = await ethers.getSigners();

	const contracts = {};
	contracts.factories = await getFactories(owner);

	contracts.EventERC1155UriStorage = await upgrades.deployProxy(contracts.factories.EventERC1155UriStorage, {
		initializer: "initialize",
		kind: "uups",
	});

	await contracts.EventERC1155UriStorage.deployed();

	return contracts;
}

async function getLastBlockTimestamp() {
	const blockNumber = await ethers.provider.getBlockNumber();
	const block = await ethers.provider.getBlock(blockNumber);
	return block.timestamp;
}

module.exports = {
	mine,
	getFactories,
	getLastBlockTimestamp,
	localDeployLinks,
};
