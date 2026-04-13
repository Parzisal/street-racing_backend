import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Если таблица settings уже создана без колонки id (старая версия миграции).
 */
export class AddSettingsIdColumn1776016094300 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE settings ADD COLUMN IF NOT EXISTS id INT NOT NULL DEFAULT 1;
    `);
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.table_constraints
          WHERE table_schema = 'public'
            AND table_name = 'settings'
            AND constraint_type = 'PRIMARY KEY'
        ) THEN
          ALTER TABLE settings ADD CONSTRAINT settings_pkey PRIMARY KEY (id);
        END IF;
      END $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE settings DROP CONSTRAINT IF EXISTS settings_pkey;
    `);
    await queryRunner.query(`
      ALTER TABLE settings DROP COLUMN IF EXISTS id;
    `);
  }
}
