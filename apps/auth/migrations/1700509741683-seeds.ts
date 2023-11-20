import { MigrationInterface, QueryRunner } from 'typeorm';

const usersSeeds = [
  {
    id: 1,
    login: 'admin',
    email: 'admin@gmail.com',
    password: '$2b$10$of0VAlI2mK4MeCTmItBOU.6AB.pU/KeE10TZBV19JrhlEJMNfamQ.', //admin
    passwordSalt: '$2b$10$of0VAlI2mK4MeCTmItBOU.',
    role: 'ADMIN',
  },
  {
    id: 2,
    login: 'user',
    email: 'user@gmail.com',
    password: '$2b$10$kTeswHTEyUdmBR06X4Bdm.iHNDFTJB7Iva61XZthwRznDhjqDcOvW', //user
    passwordSalt: '$2b$10$kTeswHTEyUdmBR06X4Bdm.',
    role: 'USER',
  },
];

export class Seeds1700509741683 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO "users" ("login", "email", "password", "passwordSalt", "role")
      VALUES ${usersSeeds
        .map(
          (user) =>
            `('${user.login}', '${user.email}', '${user.password}', '${user.passwordSalt}', '${user.role}')`,
        )
        .join(',')}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
