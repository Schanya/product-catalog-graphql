import { CacheKeys, getCacheKey } from '@libs/common';

export function getOrderCacheKey(id?: number): string {
  const result = getCacheKey(CacheKeys.ORDER, id);

  return result;
}
