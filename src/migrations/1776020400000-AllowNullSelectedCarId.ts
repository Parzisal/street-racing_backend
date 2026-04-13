import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowNullSelectedCarId1776020400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE profiles
      ALTER COLUMN selected_car_id DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE profiles
      ALTER COLUMN selected_car_id SET NOT NULL;
    `);
  }
}
