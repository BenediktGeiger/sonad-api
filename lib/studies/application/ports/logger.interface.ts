export type LogBody = {
	message?: string;
	[x: string | number | symbol]: any;
};

export default interface Logger {
	info(logBody: LogBody, message: string): void;
	warning(logBody: LogBody, message: string): void;
	error(logBody: LogBody, message: string): void;
	critical(logBody: LogBody, message: string): void;
}
