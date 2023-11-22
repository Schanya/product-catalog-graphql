import { CacheKeys, getCacheKey } from '@libs/common';

export function getProductCacheKey(id?: number): string {
  const result = getCacheKey(CacheKeys.PRODUCT, id);

  return result;
}
