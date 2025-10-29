import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndTransactionHistory1730000000000 implements MigrationInterface {
  name = 'CreateUsersAndTransactionHistory1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL NOT NULL,
        "balance" NUMERIC(10,2) NOT NULL DEFAULT 0,
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "transaction_action_enum" AS ENUM('debit', 'credit')
    `);

    await queryRunner.query(`
      CREATE TABLE "transaction_history" (
        "id" SERIAL NOT NULL,
        "user_id" INTEGER NOT NULL,
        "action" "transaction_action_enum" NOT NULL,
        "amount" NUMERIC(10,2) NOT NULL,
        "ts" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_transaction_history" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "transaction_history"
      ADD CONSTRAINT "FK_transaction_history_user"
      FOREIGN KEY ("user_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_transaction_history_user_id" ON "transaction_history" ("user_id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_transaction_history_user_id"`);
    await queryRunner.query(`ALTER TABLE "transaction_history" DROP CONSTRAINT "FK_transaction_history_user"`);
    await queryRunner.query(`DROP TABLE "transaction_history"`);
    await queryRunner.query(`DROP TYPE "transaction_action_enum"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}

