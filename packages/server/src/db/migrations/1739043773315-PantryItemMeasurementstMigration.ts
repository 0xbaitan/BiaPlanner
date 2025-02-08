import { MigrationInterface, QueryRunner } from "typeorm";

export class PantryItemMeasurementstMigration1739043773315 implements MigrationInterface {
    name = 'PantryItemMeasurementstMigration1739043773315'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`totalMeasurements\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`availableMeasurements\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`consumedMeasurements\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`consumedMeasurements\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`availableMeasurements\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`totalMeasurements\``);
    }

}
