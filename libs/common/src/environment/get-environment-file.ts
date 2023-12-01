import { ENV } from './env.constants';

export function getEnvironmentFile(env: string) {
  if (!env) {
    return '.envDocker';
  }

  switch (env.trim()) {
    case ENV.DEV:
      return '.env';
    case ENV.PROD:
      return '.envProduction';
    case ENV.TEST:
      return '.envTesting';
    case ENV.DOCKER:
      return '.envDocker';
    default:
      return '.envDocker';
  }
}
