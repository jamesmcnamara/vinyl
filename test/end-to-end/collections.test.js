const faker = require('faker');

const tutil = require('../tools/testUtils');

const choice = arr => arr[Math.floor(Math.random() * arr.length)];

const SEL = {
	searchButton: '[data-id="show-hide-search"]',
	searchBar: '[data-id="search-bar-target"]',
	searchTrack: '[data-track-type="search"]',
	queueTrack: '[data-track-type="queue"]'
};
const waitForAnimation = page => page.waitFor(() => !document.querySelector('.velocity-animating'));

async function loadCollection(page, collection) {
	page.goto(`${tutil.baseUrl()}/${collection}`);

	await page.waitForNavigation();
	await page.waitForSelector('h1');
}

async function checkHasHeader(page, collection) {
	const title = await page.$eval('h1', el => el.innerHTML);
	expect(title).toEqual('/' + collection);
}

async function searchFor(page, query) {
	const searchButton = await page.$(SEL.searchButton);
	searchButton.click();
	await waitForAnimation(page);
	await page.waitForSelector(SEL.searchBar);
	await page.type(SEL.searchBar, query);
}

async function addSongFromQuery(page, query) {
	await waitForAnimation(page);
	await searchFor(page, query);
	await page.waitFor(250);
	await page.waitForSelector(SEL.searchTrack);
	const track = choice(await page.$$(SEL.searchTrack));

	const trackName = await track.$eval('h4', track => track.innerText);

	await track.click();
	await page.click(SEL.searchButton);
	await waitForAnimation(page);
	return trackName;
}

async function getQueueTrackName(page) {
	await page.waitForSelector(SEL.queueTrack);
	return page.$eval(`${SEL.queueTrack} > h4`, el => el.innerText);
}

function getQueueNames(page) {
	return page.$$eval(`${SEL.queueTrack} > h4`, tracks => tracks.map(n => n.innerText));
}

async function testAddSong(page, query) {
	const trackName = await addSongFromQuery(page, query);
	const queueName = await getQueueTrackName(page);
	expect(queueName).toEqual(trackName);
	return trackName;
}

async function testAddSongAddedToRemote(remotePage, trackName) {
	const remoteQueueName = await getQueueTrackName(remotePage);
	expect(remoteQueueName).toEqual(trackName);
}

async function testDragAndDrop(page, remotePage) {
	async function dragTracks() {
		await waitForAnimation(page);
		await page.waitFor(
			selector => document.querySelectorAll(selector).length > 1,
			{},
			SEL.queueTrack
		);
		const tracks = await page.$$(SEL.queueTrack);
		const [one, two] = await Promise.all(tracks.map(el => el.boundingBox()));

		await page.mouse.move(one.x + one.width / 2, one.y + one.height / 2);
		await page.mouse.down();
		await page.mouse.move(two.x + two.width / 2, two.y + two.height / 2 + 10, {steps: 10});
		await page.mouse.up();
	}

	await addSongFromQuery(page, 'butts');

	const [oldOne, oldTwo] = await getQueueNames(page);

	await dragTracks();
	await page.waitFor(1000);

	const [newOne, newTwo] = await getQueueNames(page);
	expect(newTwo).toEqual(oldOne);
	expect(newOne).toEqual(oldTwo);

	const [remoteOne, remoteTwo] = await getQueueNames(remotePage);

	expect(remoteTwo).toEqual(oldOne);
	expect(remoteOne).toEqual(oldTwo);
}

describe('Collections Page', () => {
	let page;
	let remotePage;

	const collection = faker.lorem.word();

	beforeAll(async () => {
		page = await tutil.page();
		remotePage = await tutil.page();
	});

	afterAll(() => page.close());

	// Because jest doesn't allow any sort of ordering of tests, there's no way for us to
	// break our integration tests into multiple tests, so we're stuck putting everyting into
	// one test
	test(
		'everything',
		async () => {
			await loadCollection(page, collection);
			await loadCollection(remotePage, collection);
			await page.bringToFront();

			await checkHasHeader(page, collection);
			console.log('has header passed!');

			// Searching for a song and clicking it adds it to the queue
			const trackName = await testAddSong(page, 'song');
			console.log('Track added passed!');

			// Adding a song pushes it to all remote clients
			await testAddSongAddedToRemote(remotePage, trackName);
			console.log('Remote sync passed!');

			await testDragAndDrop(page, remotePage);
			console.log('Drag and drop passed!');
		},
		600 * 1000
	);
});
