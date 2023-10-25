import { EntityManager, EntityTarget, Repository } from 'typeorm';

export async function getRepositoryFromTransaction<T>(
  entityManager: EntityManager,
  entityTarget: EntityTarget<T>,
): Promise<Repository<T>> {
  return entityManager.getRepository(entityTarget);
}
