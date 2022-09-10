import nodeFetch from 'node-fetch';
import fetchCookie from 'fetch-cookie';
import { parseDocument } from 'htmlparser2';
import htmlparser2 from 'htmlparser2';
import * as domutils from 'domutils';
import { caseNames } from '@lib/infrastructure/dictionaries/sonaveeb/parser/constants';
import { Result } from '@lib/common/result';

fetchCookie(nodeFetch);

export default class SonaVeebParser {
	parser: any;
	domUtils: any;
	cases: {
		caseName: string;
		singular: string;
		plural: string;
	}[];

	constructor() {
		this.parser = htmlparser2;
		this.domUtils = domutils;
		this.cases = [];
	}

	#getCase(caseName: string, htmlTable: any) {
		if (!htmlTable) {
			return;
		}
		const caseColumn = this.domUtils.findOne(
			(element: any) => element.name === 'td' && this.domUtils.innerText(element).includes(caseName),
			[htmlTable]
		);

		const caseParentRow = this.domUtils.getParent(caseColumn);

		const fieldValues = this.domUtils.findAll(
			(element: any) => element?.attribs?.class === 'form-value-field',
			[caseParentRow]
		);

		const values = fieldValues.map((element: any) => this.domUtils.innerText(element).replace(/\s\s+/g, ' '));
		this.cases.push({
			caseName: caseName.toUpperCase().replace(' ', '_'),
			singular: values[0],
			plural: values[1] ?? '',
		});
	}

	async getWordId({ rawHtml }: { rawHtml: string }) {
		const result = parseDocument(rawHtml);
		const allTexts = this.domUtils.findAll((element: any) => element?.attribs?.name === 'word-id', result.children);
		const wordId = allTexts[0]?.attribs?.value;

		if (!wordId) {
			return Result.fail('No Word ID');
		}

		return Result.ok(wordId);
	}

	async getParadimId({ rawHtml }: { rawHtml: string }) {
		const result = parseDocument(rawHtml);

		const node = this.domUtils.findOne(
			(element: any) => this.domUtils.hasAttrib(element, 'data-paradigm-id'),
			result.children
		);
		const paradigmId = node?.attribs['data-paradigm-id'] ?? 0;

		if (!paradigmId) {
			Result.fail('No Paradigm ID');
		}
		return Result.ok(paradigmId);
	}

	async parseWordCases({ rawHtml }: { rawHtml: string }) {
		this.cases = [];
		const result = parseDocument(rawHtml);

		const scrollableTable = this.domUtils.findOne(
			(element: any) => element?.attribs?.class === 'first-row-sizes',
			result.children
		);
		Object.values(caseNames).forEach((caseName) => this.#getCase(caseName, scrollableTable));
		return this.cases;
	}
}
