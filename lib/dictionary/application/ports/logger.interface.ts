export type LogPayload = {
	message: string;
	context: string;
	[x: string | number | symbol]: unknown;
};

export default interface Logger {
	info(payload: LogPayload): void;
	warning(payload: LogPayload): void;
	error(payload: LogPayload): void;
	critical(payload: LogPayload): void;
	debug(payload: LogPayload): void;
}
