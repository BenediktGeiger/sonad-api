export class FlashcardGetByIdDto {
	private _id: number;

	constructor(id: number) {
		this._id = id;
	}

	get id() {
		return this._id;
	}
}

export class FlashcardGetByIdResponseDto {
	private _id: number;
	private _clue: string;
	private _answer: string;

	constructor(id: number, clue: string, answer: string) {
		this._id = id;
		this._clue = clue;
		this._answer = answer;
	}

	serialize() {
		return {
			id: this._id,
			clue: this._clue,
			answer: this._answer,
		};
	}
}
