import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeEntitySegmentedTimesMigration1741526858287 implements MigrationInterface {
    name = 'RecipeEntitySegmentedTimesMigration1741526858287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`prepTimeMagnitude\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`cookTimeMagnitude\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`cookTimeUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`cookTimeUnit\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`prepTimeUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`prepTimeUnit\` json NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` ADD CONSTRAINT \`FK_c5aa1f7d0d5700de4c6cbde7ac9\` FOREIGN KEY (\`pantryItemId\`) REFERENCES \`pantry-items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` DROP FOREIGN KEY \`FK_c5aa1f7d0d5700de4c6cbde7ac9\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`prepTimeUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`prepTimeUnit\` enum ('ms', 's', 'm', 'h', 'd', 'w', 'mo', 'y', 'dec', 'c', 'ml') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP COLUMN \`cookTimeUnit\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`cookTimeUnit\` enum ('ms', 's', 'm', 'h', 'd', 'w', 'mo', 'y', 'dec', 'c', 'ml') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`cookTimeMagnitude\` float(12) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD \`prepTimeMagnitude\` float(12) NOT NULL`);
    }

}
