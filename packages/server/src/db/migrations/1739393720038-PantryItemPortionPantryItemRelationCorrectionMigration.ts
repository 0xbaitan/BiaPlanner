import { MigrationInterface, QueryRunner } from "typeorm";

export class PantryItemPortionPantryItemRelationCorrectionMigration1739393720038 implements MigrationInterface {
    name = 'PantryItemPortionPantryItemRelationCorrectionMigration1739393720038'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`REL_c5aa1f7d0d5700de4c6cbde7ac\` ON \`pantry_item_portion_entity\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_c5aa1f7d0d5700de4c6cbde7ac\` ON \`pantry_item_portion_entity\` (\`pantryItemId\`)`);
    }

}
