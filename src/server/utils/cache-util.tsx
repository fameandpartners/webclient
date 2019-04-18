import NodeCache from 'node-cache';

export async function cache<TResult>(cacheBaseKey: string, nodeCache: NodeCache, fn: () => Promise<TResult>, ttlInSeconds: number): Promise<TResult> {
    const key = cacheBaseKey;
    const cachedValue: TResult|undefined = nodeCache.get(key);

    if (cachedValue !== undefined) {
        return cachedValue as TResult;
    } else {
        const newValue = await fn();
        nodeCache.set(key, newValue, ttlInSeconds);
        return newValue;
    }
}