export class Result<T> {
	private value: T | undefined;
	public isSuccess: boolean;
	public isFailure: boolean;
	public error: T | null;

	public constructor(isSuccess: boolean, error: T | null, value?: T) {
		if (isSuccess && error) {
			throw new Error(`InvalidOperation: A result cannot be successful and contain an error`);
		}
		if (!isSuccess && !error) {
			throw new Error(`InvalidOperation: A failing result needs to contain an error message`);
		}

		this.value = value;
		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this.error = error;

		Object.freeze(this);
	}

	public getValue(): T | undefined {
		if (!this.isSuccess) {
			throw new Error(`Cant retrieve the value from a failed result.`);
		}

		return this.value;
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, null, value);
	}

	public static fail<U>(error: any): Result<U> {
		return new Result<U>(false, error);
	}

	public static combine(results: Result<unknown>[]): Result<unknown> {
		for (const result of results) {
			if (result.isFailure) return result;
		}
		return Result.ok<unknown>();
	}
}
