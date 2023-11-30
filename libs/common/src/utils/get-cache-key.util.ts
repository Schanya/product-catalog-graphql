export function getCacheKey(key: string, id?: number): string {
  if (id) return key + id;
  return key;
}
