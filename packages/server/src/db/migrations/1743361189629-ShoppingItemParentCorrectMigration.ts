import { MigrationInterface, QueryRunner } from "typeorm";

export class ShoppingItemParentCorrectMigration1743361189629 implements MigrationInterface {
    name = 'ShoppingItemParentCorrectMigration1743361189629'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shopping-items\` DROP FOREIGN KEY \`FK_dc3e121639954c33c28658ab547\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`shopping-items\` ADD CONSTRAINT \`FK_dc3e121639954c33c28658ab547\` FOREIGN KEY (\`shoppingListId\`) REFERENCES \`shopping-lists\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shopping-items\` DROP FOREIGN KEY \`FK_dc3e121639954c33c28658ab547\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`shopping-items\` ADD CONSTRAINT \`FK_dc3e121639954c33c28658ab547\` FOREIGN KEY (\`shoppingListId\`) REFERENCES \`shopping-items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
