import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialUser20251029093312 implements MigrationInterface {
  name = 'SeedInitialUser20251029093312';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "users" ("id", "balance") VALUES (1, 1000.00)
    `);

    await queryRunner.query(`
      INSERT INTO "transaction_history" ("user_id", "action", "amount")
      VALUES (1, 'credit', 1000.00)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "transaction_history" WHERE "user_id" = 1`);
    await queryRunner.query(`DELETE FROM "users" WHERE "id" = 1`);
  }
}

