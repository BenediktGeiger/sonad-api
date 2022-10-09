export type Either<L, A> = Left<L, A> | Right<L, A>;

export class Left<L, A> {
	readonly payload: L;

	constructor(payload: L) {
		this.payload = payload;
	}

	isLeft(): this is Left<L, A> {
		return true;
	}

	isRight(): this is Right<L, A> {
		return false;
	}
}

export class Right<L, A> {
	readonly payload: A;

	constructor(payload: A) {
		this.payload = payload;
	}

	isLeft(): this is Left<L, A> {
		return false;
	}

	isRight(): this is Right<L, A> {
		return true;
	}
}

export const left = <L, A>(l: L): Either<L, A> => {
	return new Left(l);
};

export const right = <L, A>(a: A): Either<L, A> => {
	return new Right<L, A>(a);
};
