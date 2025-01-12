import { MigrationInterface, QueryRunner } from "typeorm";

export class RecipeEntitiesMigration1736675390728 implements MigrationInterface {
    name = 'RecipeEntitiesMigration1736675390728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`cuisines\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recipe_ingredients\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`quantity\` int NOT NULL DEFAULT '0', \`volumeUnit\` enum ('L', 'mL', 'gal', 'qt', 'pt', 'cup', 'tbsp', 'tsp', 'fl oz', 'm3', 'cm3', 'in3') NULL, \`weightUnit\` enum ('kg', 'g', 'lb', 'oz', 'mg', 'mcg') NULL, \`approximateUnit\` enum ('pinch', 'dash', 'drop', 'smidgen', 'pc(s)') NULL, \`recipeId\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recipe_tags\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`name\` varchar(255) NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recipes\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` timestamp(6) NULL, \`title\` varchar(255) NOT NULL, \`description\` text NULL, \`difficultyLevel\` enum ('easy', 'medium', 'hard') NOT NULL, \`cuisineId\` bigint NOT NULL, \`prepTimeMagnitude\` float NOT NULL, \`prepTimeUnit\` enum ('ms', 's', 'm', 'h', 'd', 'w', 'mo', 'y', 'dec', 'c', 'ml') NOT NULL, \`cookTimeMagnitude\` float NOT NULL, \`cookTimeUnit\` enum ('ms', 's', 'm', 'h', 'd', 'w', 'mo', 'y', 'dec', 'c', 'ml') NOT NULL, \`defaultNumberOfServings\` text NOT NULL, \`instructions\` text NOT NULL, \`notes\` text NULL, \`source\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recipe_ingredients_product_categories\` (\`recipeIngredientId\` bigint NOT NULL, \`productCategoryId\` bigint NOT NULL, INDEX \`IDX_ffe6e680cc5591753c407ca4dc\` (\`recipeIngredientId\`), INDEX \`IDX_6307faf2ced5c1c9902af8ee70\` (\`productCategoryId\`), PRIMARY KEY (\`recipeIngredientId\`, \`productCategoryId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`recipes_recipe_tags\` (\`recipeId\` bigint NOT NULL, \`tagId\` bigint NOT NULL, INDEX \`IDX_ba28f66b7caa59c6e82456d6f9\` (\`recipeId\`), INDEX \`IDX_09f019d5927b029f76946835f5\` (\`tagId\`), PRIMARY KEY (\`recipeId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` ADD CONSTRAINT \`FK_2d7f407ae694e91bb3da1798c61\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recipes\` ADD CONSTRAINT \`FK_4622b1f6f1cb7540a7a2ed1e5f3\` FOREIGN KEY (\`cuisineId\`) REFERENCES \`cuisines\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients_product_categories\` ADD CONSTRAINT \`FK_ffe6e680cc5591753c407ca4dc3\` FOREIGN KEY (\`recipeIngredientId\`) REFERENCES \`recipe_ingredients\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients_product_categories\` ADD CONSTRAINT \`FK_6307faf2ced5c1c9902af8ee709\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product-categories\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` ADD CONSTRAINT \`FK_ba28f66b7caa59c6e82456d6f93\` FOREIGN KEY (\`recipeId\`) REFERENCES \`recipes\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` ADD CONSTRAINT \`FK_09f019d5927b029f76946835f56\` FOREIGN KEY (\`tagId\`) REFERENCES \`recipe_tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` DROP FOREIGN KEY \`FK_09f019d5927b029f76946835f56\``);
        await queryRunner.query(`ALTER TABLE \`recipes_recipe_tags\` DROP FOREIGN KEY \`FK_ba28f66b7caa59c6e82456d6f93\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients_product_categories\` DROP FOREIGN KEY \`FK_6307faf2ced5c1c9902af8ee709\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients_product_categories\` DROP FOREIGN KEY \`FK_ffe6e680cc5591753c407ca4dc3\``);
        await queryRunner.query(`ALTER TABLE \`recipes\` DROP FOREIGN KEY \`FK_4622b1f6f1cb7540a7a2ed1e5f3\``);
        await queryRunner.query(`ALTER TABLE \`recipe_ingredients\` DROP FOREIGN KEY \`FK_2d7f407ae694e91bb3da1798c61\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP INDEX \`IDX_09f019d5927b029f76946835f5\` ON \`recipes_recipe_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_ba28f66b7caa59c6e82456d6f9\` ON \`recipes_recipe_tags\``);
        await queryRunner.query(`DROP TABLE \`recipes_recipe_tags\``);
        await queryRunner.query(`DROP INDEX \`IDX_6307faf2ced5c1c9902af8ee70\` ON \`recipe_ingredients_product_categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_ffe6e680cc5591753c407ca4dc\` ON \`recipe_ingredients_product_categories\``);
        await queryRunner.query(`DROP TABLE \`recipe_ingredients_product_categories\``);
        await queryRunner.query(`DROP TABLE \`recipes\``);
        await queryRunner.query(`DROP TABLE \`recipe_tags\``);
        await queryRunner.query(`DROP TABLE \`recipe_ingredients\``);
        await queryRunner.query(`DROP TABLE \`cuisines\``);
    }

}
