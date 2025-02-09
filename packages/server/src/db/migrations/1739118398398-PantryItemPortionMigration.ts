import { MigrationInterface, QueryRunner } from "typeorm";

export class PantryItemPortionMigration1739118398398 implements MigrationInterface {
    name = 'PantryItemPortionMigration1739118398398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`pantry_item_portion_entity\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`pantryItemId\` bigint NOT NULL, \`portion\` json NULL, \`concreteIngredientId\` bigint NULL, UNIQUE INDEX \`REL_c5aa1f7d0d5700de4c6cbde7ac\` (\`pantryItemId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` ADD CONSTRAINT \`FK_c5aa1f7d0d5700de4c6cbde7ac9\` FOREIGN KEY (\`pantryItemId\`) REFERENCES \`pantry-items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` ADD CONSTRAINT \`FK_e9ff416c2d5d280ea2d04e80446\` FOREIGN KEY (\`concreteIngredientId\`) REFERENCES \`concrete-ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` DROP FOREIGN KEY \`FK_e9ff416c2d5d280ea2d04e80446\``);
        await queryRunner.query(`ALTER TABLE \`pantry_item_portion_entity\` DROP FOREIGN KEY \`FK_c5aa1f7d0d5700de4c6cbde7ac9\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP INDEX \`REL_c5aa1f7d0d5700de4c6cbde7ac\` ON \`pantry_item_portion_entity\``);
        await queryRunner.query(`DROP TABLE \`pantry_item_portion_entity\``);
    }

}
