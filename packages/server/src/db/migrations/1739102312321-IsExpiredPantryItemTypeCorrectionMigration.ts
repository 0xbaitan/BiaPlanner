import { MigrationInterface, QueryRunner } from "typeorm";

export class IsExpiredPantryItemTypeCorrectionMigration1739102312321 implements MigrationInterface {
    name = 'IsExpiredPantryItemTypeCorrectionMigration1739102312321'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`isExpired\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`isExpired\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`isExpired\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`isExpired\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
