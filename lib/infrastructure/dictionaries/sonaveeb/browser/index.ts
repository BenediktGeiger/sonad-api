import puppeteer, { Page } from 'puppeteer';
import isDocker from '@lib/common/is-docker';

class PrivatePageSingleton {
	private readonly page: Page;
	constructor(page: Page) {
		this.page = page;
	}

	getPage() {
		return this.page;
	}
}

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

	private static getLaunchOptions() {
		const isDockerEnv = isDocker();
		console.log('isDocker', isDockerEnv);
		if (isDocker()) {
			return {
				executablePath: '/usr/bin/chromium-browser',
				devtools: true,
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
