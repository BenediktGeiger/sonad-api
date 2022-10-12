import promClient from 'prom-client';

import { requestCounter } from './counters';
import { requestDuration } from './histograms';

const register = new promClient.Registry();

register.registerMetric(requestCounter);
register.registerMetric(requestDuration);

const getEnv = (): string => {
	return process?.env?.NODE_ENV ?? 'development';
};

register.setDefaultLabels({ app: 'sonad-api', env: getEnv() });

promClient.collectDefaultMetrics({ register });

export { register, requestCounter, requestDuration };
