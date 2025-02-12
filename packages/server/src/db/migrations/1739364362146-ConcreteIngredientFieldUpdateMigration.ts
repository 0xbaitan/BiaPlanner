import { MigrationInterface, QueryRunner } from "typeorm";

export class ConcreteIngredientFieldUpdateMigration1739364362146 implements MigrationInterface {
    name = 'ConcreteIngredientFieldUpdateMigration1739364362146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP FOREIGN KEY \`FK_143b6ec4fc335e3fcc17d206c78\``);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` CHANGE \`concreteRecipeId\` \`concreteRecipeId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` CHANGE \`ingredientId\` \`ingredientId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD CONSTRAINT \`FK_143b6ec4fc335e3fcc17d206c78\` FOREIGN KEY (\`concreteRecipeId\`) REFERENCES \`concrete-recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP FOREIGN KEY \`FK_143b6ec4fc335e3fcc17d206c78\``);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` CHANGE \`ingredientId\` \`ingredientId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` CHANGE \`concreteRecipeId\` \`concreteRecipeId\` bigint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD CONSTRAINT \`FK_143b6ec4fc335e3fcc17d206c78\` FOREIGN KEY (\`concreteRecipeId\`) REFERENCES \`concrete-recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
