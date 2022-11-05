const { ethers, network } = require("hardhat");

const { getFactories } = require("./lib.js");

async function main() {
	[owner] = await ethers.getSigners();

	const cs = {};
	cs.factories = await getFactories(owner);
	cs.EventERC1155 = await cs.factories.EventERC1155UriStorage.attach("0x42B28E2Dc1843A636347C1D521d08711Ac18B2FB");

	console.log("EventERC1155 deployed to:", cs.EventERC1155.address);

	await cs.EventERC1155.grantRole(
		"0x0000000000000000000000000000000000000000000000000000000000000000",
		"0x2dA4a1f1cBdfa7F1D4E49c1db5d1AeE10d78A814",
	);

	console.log("EventERC1155 deployed to:", cs.EventERC1155.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
