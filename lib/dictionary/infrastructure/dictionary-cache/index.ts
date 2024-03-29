import RedisCacheRepository from '@lib/dictionary/infrastructure/dictionary-cache/redis-cache/redis-cache-repository';
import NoCacheRepository from '@lib/dictionary/infrastructure/dictionary-cache/no-cache/no-cache-repository';
import Redis from 'ioredis';

import DictionaryCache from '@lib/dictionary/application/ports/dictionary-cache.interface';

export default {
	getDictionaryCache(): DictionaryCache {
		if (process.env.REDIS) {
			try {
				const redisClient = new Redis(String(process.env.REDIS));
				return new RedisCacheRepository(redisClient);
			} catch (err) {
				return new NoCacheRepository();
			}
		}

		return new NoCacheRepository();
	},
};
