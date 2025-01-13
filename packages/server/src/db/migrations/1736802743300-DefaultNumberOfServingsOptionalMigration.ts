import { MigrationInterface, QueryRunner } from "typeorm";

export class DefaultNumberOfServingsOptionalMigration1736802743300 implements MigrationInterface {
    name = 'DefaultNumberOfServingsOptionalMigration1736802743300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes\` CHANGE \`defaultNumberOfServings\` \`defaultNumberOfServings\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipes\` CHANGE \`defaultNumberOfServings\` \`defaultNumberOfServings\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
