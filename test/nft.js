const { ethers } = require("hardhat");
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { testsTimeout } = require("../hardhat.config.js");

const { localDeployLinks } = require("../scripts/lib.js");

describe("EventERC1155UriStorage contract test", function () {
	let owner;
	const token0 = 0;
	const baseURI = "https://ipfs.infura.io/ipfs/";
	const wrongOwner = "0x682d0A324a2c42b0b40b4f0d54cd7c0Cf06afaC3";

	beforeEach(async function () {
		this.timeout(testsTimeout);

		[owner] = await ethers.getSigners();

		cs = await localDeployLinks();
	});

	it("default and ipfs methods", async () => {
		this.timeout(testsTimeout);

		expect(
			await cs.EventERC1155UriStorage.hasRole(await cs.EventERC1155UriStorage.DEFAULT_ADMIN_ROLE(), owner.address),
		).to.equal(true);

		expect(await cs.EventERC1155UriStorage.uri(token0)).to.equal("");

		await cs.EventERC1155UriStorage.setBaseURI(baseURI).then((tx) => tx.wait());
		expect(await cs.EventERC1155UriStorage._baseURI()).to.equal(baseURI);

		expect(await cs.EventERC1155UriStorage.allEvents()).to.eql([
			["", "", BigNumber.from(token0), "", "0x0000000000000000000000000000000000000000", ""],
		]);

		await cs.EventERC1155UriStorage.pause();

		expect(await cs.EventERC1155UriStorage.paused()).to.equal(true);

		await cs.EventERC1155UriStorage.unpause();

		expect(await cs.EventERC1155UriStorage.paused()).to.equal(false);
	});

	it("add event methods", async () => {
		this.timeout(testsTimeout);
		let nextEvent = 1;
		await cs.EventERC1155UriStorage.createEvent(wrongOwner, "1", "2", "3", "4").then((tx) => tx.wait());
		expect(await cs.EventERC1155UriStorage.allEvents()).to.eql([
			["", "", BigNumber.from(0), "", ethers.constants.AddressZero, ""],
			["1", "2", BigNumber.from(nextEvent), "4", wrongOwner, "3"],
		]);

		await expect(cs.EventERC1155UriStorage.addUserToEvent([owner.address, wrongOwner], nextEvent)).to.be.revertedWith(
			"Only event owner can set event minters",
		);

		nextEvent++;

		await cs.EventERC1155UriStorage.createEvent(owner.address, "4", "3", "2", "1").then((tx) => tx.wait());

		await cs.EventERC1155UriStorage.addUserToEvent([owner.address, wrongOwner], nextEvent);

		expect(await cs.EventERC1155UriStorage.getNftsIdsOfUser(owner.address)).to.eql([BigNumber.from(nextEvent)]);
	});

	it("upgrade contract check", async () => {
		this.timeout(testsTimeout);
		const EventERC1155UriStoragev2 = await ethers.getContractFactory("EventERC1155UriStoragev2");

		await expect(upgrades.upgradeProxy(cs.EventERC1155UriStorage.address, EventERC1155UriStoragev2)).to.be.revertedWith(
			"Pausable: not paused",
		);

		await cs.EventERC1155UriStorage.pause();

		EventERC1155UriStorage = await upgrades.upgradeProxy(cs.EventERC1155UriStorage.address, EventERC1155UriStoragev2);

		EventERC1155UriStorage;

		expect(await EventERC1155UriStorage.name()).to.equal(await cs.EventERC1155UriStorage.name());
	});
});
