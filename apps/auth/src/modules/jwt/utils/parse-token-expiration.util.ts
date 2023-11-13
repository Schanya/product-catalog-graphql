export function parseTokenExpiration(expirationString: string): number {
  const matches = expirationString.match(/^(\d+)([smhdwMy]?)$/);

  if (!matches) {
    throw new Error('Incorrect token expiration date format');
  }

  const value = parseInt(matches[1]);
  const unit = matches[2];

  const multipliers = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
    w: 604800000,
    M: 2629746000,
    y: 31556952000,
  };

  const multiplier = multipliers[unit];

  if (!multiplier) {
    throw new Error('Invalid token expiration unit');
  }

  return value * multiplier;
}
