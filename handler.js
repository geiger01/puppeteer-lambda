const chromium = require('@sparticuz/chromium');
const puppeteerExtra = require('puppeteer-extra');
const stealthPlugin = require('puppeteer-extra-plugin-stealth');

require('dotenv').config();

async function getBrowser() {
	const isLocal = process.env.AWS_EXECUTION_ENV === undefined;
	if (isLocal) {
		return await require('puppeteer').launch({
			headless: true,
		});
	}

	return await puppeteerExtra.launch({
		args: [...chromium.args, '--single-process'],
		defaultViewport: chromium.defaultViewport,
		executablePath: await chromium.executablePath(),
		headless: chromium.headless,
		ignoreHTTPSErrors: true,
	});
}

exports.handler = async (event) => {
	console.log('Starting handler with event:', event);

	let payload = {};
	let url;
	let browser;

	try {
		if (event?.body) {
			// For API Gateway
			// const secret = event?.headers['secret'] || '';

			// if (!secret || secret !== process.env.SECRET) {
			// 	return {
			// 		statusCode: 401,
			// 		body: JSON.stringify({
			// 			message: 'Unauthorized',
			// 		}),
			// 	};
			// }

			try {
				payload =
					typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
			} catch (err) {
				console.error('Error parsing event.body: ', err);
				throw err;
			}
		}

		url = (
			event?.url ||
			payload?.url ||
			event?.queryStringParameters?.url ||
			''
		).trim();

		if (!url) {
			throw new Error('No URL provided in the query string.');
		}

		puppeteerExtra.use(stealthPlugin());
		browser = await getBrowser();

		const page = await browser.newPage();

		console.log(`Navigating to URL: ${url}`);
		await page.goto(url, { waitUntil: 'networkidle2' });

		const data = await page.evaluate(
			() => document.querySelector('*').outerHTML
		);

		await browser.close();

		return {
			statusCode: 200,
			body: JSON.stringify({ data }),
		};
	} catch (error) {
		console.error('Error in Lambda:', error);

		if (browser) {
			await browser.close();
		}

		return {
			statusCode: 500,
			body: JSON.stringify({ error: error.message }),
		};
	}
};

// Testing run `node handler.js`
// (async () => {
// 	const mockEvent = {
// 		url:'https://commoninja.com'
// 	};

// 	try {
// 		const response = await exports.handler(mockEvent);
// 	} catch (error) {
// 		console.error('Error in local execution:', error);
// 	}
// })();
