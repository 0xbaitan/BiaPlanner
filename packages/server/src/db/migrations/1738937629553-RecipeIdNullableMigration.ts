import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeIdNullableMigration1738937629553 implements MigrationInterface {
    name = 'RecipeIdNullableMigration1738937629553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP FOREIGN KEY \`FK_2d7f407ae694e91bb3da1798c61\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` CHANGE \`recipeId\` \`recipeId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD CONSTRAINT \`FK_2d7f407ae694e91bb3da1798c61\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP FOREIGN KEY \`FK_2d7f407ae694e91bb3da1798c61\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` CHANGE \`recipeId\` \`recipeId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD CONSTRAINT \`FK_2d7f407ae694e91bb3da1798c61\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
