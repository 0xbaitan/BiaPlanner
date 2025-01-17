import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductMeasurementsMigration1737102089572 implements MigrationInterface {
    name = 'ProductMeasurementsMigration1737102089572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4d12d5b92dba9da1a38be16ede\` ON \`brands\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`millisecondsToExpiryAfterOpening\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`numberOfServingsOrPieces\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`useMeasurementMetric\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`volumePerContainerOrPacket\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`volumeUnit\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`weightPerContainerOrPacket\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`weightUnit\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`measurements\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`timeTillExpiryAfterOpening\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`timeTillExpiryAfterOpening\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`measurements\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`weightUnit\` enum ('kg', 'g', 'lb', 'oz', 'mg', 'mcg') NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`weightPerContainerOrPacket\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`volumeUnit\` enum ('L', 'mL', 'gal', 'qt', 'pt', 'cup', 'tbsp', 'tsp', 'fl oz', 'm3', 'cm3', 'in3') NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`volumePerContainerOrPacket\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`useMeasurementMetric\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`millisecondsToExpiryAfterOpening\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4d12d5b92dba9da1a38be16ede\` ON \`brands\` (\`logoId\`)`);
    }

}
