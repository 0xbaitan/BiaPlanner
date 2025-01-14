import { MigrationInterface, QueryRunner } from "typeorm";

export class ConcreteRecipeMigration1736890535768 implements MigrationInterface {
    name = 'ConcreteRecipeMigration1736890535768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`concrete-ingredients\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`concreteRecipeId\` bigint NOT NULL, \`ingredientId\` bigint NOT NULL, \`pantryId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`concrete-recipes\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`recipeId\` bigint NOT NULL, \`mealType\` enum ('breakfast', 'lunch', 'dinner') NOT NULL, \`numberOfServings\` json NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD CONSTRAINT \`FK_143b6ec4fc335e3fcc17d206c78\` FOREIGN KEY (\`concreteRecipeId\`) REFERENCES \`concrete-recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` ADD CONSTRAINT \`FK_405ddf02687d70365c17bd4bf57\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` DROP FOREIGN KEY \`FK_405ddf02687d70365c17bd4bf57\``);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP FOREIGN KEY \`FK_143b6ec4fc335e3fcc17d206c78\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE \`concrete-recipes\``);
        await queryRunner.query(`DROP TABLE \`concrete-ingredients\``);
    }

}
