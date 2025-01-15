import { MigrationInterface, QueryRunner } from "typeorm";

export class BrandDescriptionAndLogoMigration1736946132154 implements MigrationInterface {
    name = 'BrandDescriptionAndLogoMigration1736946132154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`logoId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD UNIQUE INDEX \`IDX_4d12d5b92dba9da1a38be16ede\` (\`logoId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_4d12d5b92dba9da1a38be16ede\` ON \`brands\` (\`logoId\`)`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD CONSTRAINT \`FK_4d12d5b92dba9da1a38be16ede2\` FOREIGN KEY (\`logoId\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` DROP FOREIGN KEY \`FK_4d12d5b92dba9da1a38be16ede2\``);
        await queryRunner.query(`DROP INDEX \`REL_4d12d5b92dba9da1a38be16ede\` ON \`brands\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP INDEX \`IDX_4d12d5b92dba9da1a38be16ede\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`logoId\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`description\``);
    }

}
