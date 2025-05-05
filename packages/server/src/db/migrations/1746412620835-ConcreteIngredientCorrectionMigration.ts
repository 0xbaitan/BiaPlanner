import { MigrationInterface, QueryRunner } from "typeorm";

export class ConcreteIngredientCorrectionMigration1746412620835 implements MigrationInterface {
    name = 'ConcreteIngredientCorrectionMigration1746412620835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_15a01063b813de6a554b7bdb58e\` ON \`concrete-ingredients\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` CHANGE \`isSufficient\` \`isSufficient\` tinyint NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` CHANGE \`isCooked\` \`isCooked\` tinyint NULL DEFAULT '0'`);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` ADD CONSTRAINT \`FK_15a01063b813de6a554b7bdb58e\` FOREIGN KEY (\`ingredientId\`) REFERENCES \`recipe_ingredients\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`concrete-ingredients\` DROP FOREIGN KEY \`FK_15a01063b813de6a554b7bdb58e\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` CHANGE \`isCooked\` \`isCooked\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`concrete-recipes\` CHANGE \`isSufficient\` \`isSufficient\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_15a01063b813de6a554b7bdb58e\` ON \`concrete-ingredients\` (\`ingredientId\`)`);
    }

}
