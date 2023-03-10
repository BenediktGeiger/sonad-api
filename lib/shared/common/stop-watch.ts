import LoggerInterface from '@lib/application/ports/logger.interface';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction = (...args: any[]) => Promise<any>;

export const asyncStopWatch = <Func extends AsyncFunction>(func: Func, logger: LoggerInterface) => {
	return async (...args: Parameters<Func>): Promise<ReturnType<Func>> => {
		const start = process.hrtime.bigint();
		const result = await func(...args);
		const end = process.hrtime.bigint();
		const elapsedTime = (Number(end - start) / 1000000).toFixed(2);
		logger.info({
			message: `${func.name} execution time ${elapsedTime}ms`,
			method: func?.name,
			elapsedTime,
			start,
			end,
		});
		return result;
	};
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SyncFunction = (...args: any[]) => any;

export const syncStopWatch = <Func extends SyncFunction>(func: Func, logger: LoggerInterface) => {
	return (...args: Parameters<Func>): ReturnType<Func> => {
		const start = process.hrtime.bigint();
		const result = func(...args);
		const end = process.hrtime.bigint();
		const elapsedTime = (Number(end - start) / 1000000).toFixed(2);
		logger.info({
			message: `${func.name} execution time ${elapsedTime}ms`,
			method: func?.name,
			elapsedTime,
			start,
			end,
		});
		return result;
	};
};
