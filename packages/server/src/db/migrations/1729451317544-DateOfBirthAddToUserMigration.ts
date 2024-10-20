import { MigrationInterface, QueryRunner } from "typeorm";

export class DateOfBirthAddToUserMigration1729451317544 implements MigrationInterface {
    name = 'DateOfBirthAddToUserMigration1729451317544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`age\` \`dateOfBirth\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dateOfBirth\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dateOfBirth\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`age\` int NOT NULL DEFAULT '0'`);
    }

}
