import { MigrationInterface, QueryRunner } from "typeorm";

export class DateOfColumnMigration1729469061290 implements MigrationInterface {
    name = 'DateOfColumnMigration1729469061290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dateOfBirth\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`dateOfBirth\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`dateOfBirth\` datetime NOT NULL`);
    }

}
