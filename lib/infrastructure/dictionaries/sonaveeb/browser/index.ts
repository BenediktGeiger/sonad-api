import puppeteer, { Page } from 'puppeteer';

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
			const browser = await puppeteer.launch({
				devtools: true,
				headless: true,
				args: ['--disable-setuid-sandbox'],
				ignoreHTTPSErrors: true,
			});

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
}

export default PageSingleton;
