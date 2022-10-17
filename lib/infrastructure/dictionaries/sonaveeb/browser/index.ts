import puppeteer, { Page, Browser } from 'puppeteer';

class PrivatePageSingleton {
	private readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	getPage() {
		return this.page;
	}
}

class PrivateBrowserSingleton {
	private readonly browser: Browser;
	constructor(browser: Browser) {
		this.browser = browser;
	}

	getBrowser() {
		return this.browser;
	}
}

export class BrowserSingleton {
	private static instance: PrivateBrowserSingleton;

	private constructor() {
		throw new Error('Singleton, use getInstance() instead');
	}

	static async getBrowser() {
		if (!this.instance) {
			const launchOptions = this.getLaunchOptions();
			const browser = await puppeteer.launch(launchOptions);

			this.instance = new PrivateBrowserSingleton(browser);
		}
		return this.instance.getBrowser();
	}

	private static isDocker() {
		return Boolean(process?.env?.RUNNER === 'docker');
	}

	private static getLaunchOptions() {
		if (this.isDocker()) {
			return {
				executablePath: '/usr/bin/chromium-browser',
				headless: true,
				args: ['--disable-setuid-sandbox', '--no-sandbox'],
				ignoreHTTPSErrors: true,
			};
		}

		return {
			headless: true,
			args: ['--disable-setuid-sandbox', '--no-sandbox'],
			ignoreHTTPSErrors: true,
		};
	}
}

// TODO remove, deprecated
class PageSingleton {
	private static instance: PrivatePageSingleton;

	private constructor() {
		throw new Error('Singleton, use getInstance() instead');
	}

	static async getPage() {
		if (!this.instance) {
			const launchOptions = this.getLaunchOptions();
			const browser = await puppeteer.launch(launchOptions);

			const page = await browser.newPage();
			await page.setRequestInterception(true);

			page.on('request', (req) => {
				if (req.resourceType() === 'image') {
					req.abort();
				} else {
					req.continue();
				}
			});
			this.instance = new PrivatePageSingleton(page);
		}
		return this.instance.getPage();
	}

	private static isDocker() {
		return Boolean(process?.env?.RUNNER === 'docker');
	}

	private static getLaunchOptions() {
		if (this.isDocker()) {
			return {
				executablePath: '/usr/bin/chromium-browser',
				headless: true,
				args: ['--disable-setuid-sandbox', '--no-sandbox'],
				ignoreHTTPSErrors: true,
			};
		}

		return {
			headless: true,
			args: ['--disable-setuid-sandbox'],
			ignoreHTTPSErrors: true,
		};
	}
}

export default PageSingleton;
