import { MigrationInterface, QueryRunner } from "typeorm";

export class ConcreteIngredientRemoveRedundantFieldsMigration1739365018640 implements MigrationInterface {
    name = 'ConcreteIngredientRemoveRedundantFieldsMigration1739365018640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP COLUMN \`pantryId\``);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP COLUMN \`measurement\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD \`measurement\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD \`pantryId\` bigint NULL`);
    }

}
