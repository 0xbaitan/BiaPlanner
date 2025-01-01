import { MigrationInterface, QueryRunner } from "typeorm";

export class MajorFixesMigration1735623608860 implements MigrationInterface {
    name = 'MajorFixesMigration1735623608860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`brands\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`product-categories\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`product-categories\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`product-categories\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`bestBeforeDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`openedDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`manufacturedDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` ADD \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`reminders\` ADD \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`reminders\` ADD \`deletedAt\` timestamp(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`reminders\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`manufacturedDate\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`openedDate\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP COLUMN \`bestBeforeDate\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`product-categories\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`product-categories\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`product-categories\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`brands\` DROP COLUMN \`createdAt\``);
    }

}
