import DictionaryCache from '@lib/application/ports/dictionary-cache.interface';
import Redis from 'ioredis';

export default class RedisDictionaryCache implements DictionaryCache {
	private redisClient;

	constructor(redisClient: Redis) {
		this.redisClient = redisClient;
	}
	async get(key: string): Promise<string | null> {
		return await this.redisClient.get(key);
	}

	async set(key: string, value: string) {
		await this.redisClient.set(key, value, 'EX', 3600);
	}
}
