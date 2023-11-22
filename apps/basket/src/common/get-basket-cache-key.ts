import { CacheKeys, getCacheKey } from '@libs/common';

export function getBasketCacheKey(id?: number): string {
  const result = getCacheKey(CacheKeys.BASKET, id);

  return result;
}
