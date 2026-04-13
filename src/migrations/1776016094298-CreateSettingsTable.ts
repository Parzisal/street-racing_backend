import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSettingsTable1776016094298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS settings (
                id INT PRIMARY KEY NOT NULL DEFAULT 1,
                default_start_level INT NOT NULL DEFAULT 1,
                default_experience INT NOT NULL DEFAULT 0,
                default_silver INT NOT NULL DEFAULT 5000,
                default_gold INT NOT NULL DEFAULT 10,
                default_garage_slots INT NOT NULL DEFAULT 4,
                default_car_id UUID REFERENCES cars(id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS settings;
        `);
  }
}
