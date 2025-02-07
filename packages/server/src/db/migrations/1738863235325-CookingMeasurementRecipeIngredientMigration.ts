import { MigrationInterface, QueryRunner } from "typeorm";

export class CookingMeasurementRecipeIngredientMigration1738863235325 implements MigrationInterface {
    name = 'CookingMeasurementRecipeIngredientMigration1738863235325'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP COLUMN \`volumeUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP COLUMN \`weightUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP COLUMN \`approximateUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD \`measurement\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP COLUMN \`measurement\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD \`approximateUnit\` enum ('pinch', 'dash', 'drop', 'smidgen', 'pc(s)') NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD \`weightUnit\` enum ('kg', 'g', 'lb', 'oz', 'mg', 'mcg') NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD \`volumeUnit\` enum ('L', 'mL', 'gal', 'qt', 'pt', 'cup', 'tbsp', 'tsp', 'fl oz', 'm3', 'cm3', 'in3') NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD \`quantity\` int NOT NULL DEFAULT '0'`);
    }

}
