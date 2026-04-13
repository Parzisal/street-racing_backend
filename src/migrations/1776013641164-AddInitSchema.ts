import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddInitSchema1776013641164 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
             CREATE TABLE IF NOT EXISTS cars (
                id UUID PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                model TEXT NOT NULL,
                base_power INT NOT NULL,
                base_rating INT NOT NULL,
                buy_level INT NOT NULL,
                price_silver INT NOT NULL,
                price_gold INT NOT NULL,
                image_url TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS profiles(
                id UUID PRIMARY KEY NOT NULL,
                level INT NOT NULL,
                experience INT NOT NULL,
                silver INT NOT NULL,
                gold INT NOT NULL,
                garage_slots INT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS profiles_cars(
                id UUID PRIMARY KEY NOT NULL,
                profile_id UUID NOT NULL REFERENCES profiles(id),
                car_id UUID NOT NULL REFERENCES cars(id)
            );

            ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_car_id UUID REFERENCES profiles_cars(id);

            CREATE TABLE IF NOT EXISTS parts(
                id UUID PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                level INT NOT NULL,
                power_boost INT NOT NULL,
                price_silver INT NOT NULL,
                image_url TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS profiles_cars_parts(
                profile_car_id UUID NOT NULL REFERENCES profiles_cars(id),
                part_id UUID NOT NULL REFERENCES parts(id)
            );

            CREATE TABLE IF NOT EXISTS users_telegram(
                id UUID PRIMARY KEY NOT NULL,
                profile_id UUID NOT NULL REFERENCES profiles(id)
            );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                DROP TABLE IF EXISTS users_telegram;
                DROP TABLE IF EXISTS profiles_cars_parts;
                DROP TABLE IF EXISTS parts;
                ALTER TABLE profiles DROP COLUMN IF EXISTS selected_car_id;
                DROP TABLE IF EXISTS profiles_cars;
                DROP TABLE IF EXISTS profiles;
                DROP TABLE IF EXISTS cars;
            `);
  }
}
