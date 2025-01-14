import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeCascadeMigration1736865417290 implements MigrationInterface {
    name = 'RecipeCascadeMigration1736865417290'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` DROP FOREIGN KEY \`FK_ba28f66b7caa59c6e82456d6f93\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` ADD CONSTRAINT \`FK_ba28f66b7caa59c6e82456d6f93\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` DROP FOREIGN KEY \`FK_ba28f66b7caa59c6e82456d6f93\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` ADD CONSTRAINT \`FK_ba28f66b7caa59c6e82456d6f93\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
