export type LogPayload = {
	message: string;
	method: string;
	[x: string | number | symbol]: unknown;
};

export default interface Logger {
	info(payload: LogPayload): void;
	warning(payload: LogPayload): void;
	error(payload: LogPayload): void;
	critical(payload: LogPayload): void;
}
