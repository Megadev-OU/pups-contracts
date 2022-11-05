const { ethers, network } = require("hardhat");
const { getImplementationAddress } = require("@openzeppelin/upgrades-core");

const { localDeployLinks } = require("./lib.js");

async function main() {
	const cs = await localDeployLinks();

	await cs.EventERC1155UriStorage.setBaseURI("https://ipfs.infura.io/ipfs/");
	const address = await getImplementationAddress(ethers.provider, cs.EventERC1155UriStorage.address);
	console.log("\fLinksNFT implementation:", address);
	console.log("\fLinksNFT proxy:", cs.EventERC1155UriStorage.address);

	console.log("Enter to console for verify contract:");
	console.log(`yarn hardhat verify --network ${network.name} ${cs.EventERC1155UriStorage.address}`);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
