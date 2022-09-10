export default interface RateLimiterCacheInterface {
	hasReachedRateLimit(key: string): Promise<boolean>;
	incr(key: string): void;
}
