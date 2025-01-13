import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeInstructionsTextMigration1736802183541 implements MigrationInterface {
    name = 'RecipeInstructionsTextMigration1736802183541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
