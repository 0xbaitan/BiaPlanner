import { MigrationInterface, QueryRunner } from "typeorm";

export class QueryProductViewUpdateMigration1743469164379 implements MigrationInterface {
    name = 'QueryProductViewUpdateMigration1743469164379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`CREATE VIEW \`query_product_view\` AS SELECT \`product\`.\`id\` AS \`id\`, \`product\`.\`name\` AS \`name\`, \`product\`.\`description\` AS \`description\`, \`product\`.\`brandId\` AS \`brandId\`, \`product\`.\`measurement\` AS \`measurement\`, \`product\`.\`measurementType\` AS \`measurementType\`, \`brand\`.\`name\` AS \`brandName\`, \`productCategories\`.\`id\` AS \`productCategories_id\`, \`productCategories\`.\`name\` AS \`productCategories_name\`, \`productCategories\`.\`createdAt\` AS \`productCategories_createdAt\`, \`productCategories\`.\`updatedAt\` AS \`productCategories_updatedAt\`, \`productCategories\`.\`deletedAt\` AS \`productCategories_deletedAt\` FROM \`products\` \`product\` LEFT JOIN \`brands\` \`brand\` ON  \`product\`.\`brandId\` = \`brand\`.\`id\` AND \`brand\`.\`deletedAt\` IS NULL  LEFT JOIN \`product-categories\` \`productCategories\` ON \`productCategories\`.\`deletedAt\` IS NULL WHERE \`product\`.\`deletedAt\` IS NULL`);
        await queryRunner.query(`INSERT INTO \`biaplanner\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)`, ["biaplanner","VIEW","query_product_view","SELECT `product`.`id` AS `id`, `product`.`name` AS `name`, `product`.`description` AS `description`, `product`.`brandId` AS `brandId`, `product`.`measurement` AS `measurement`, `product`.`measurementType` AS `measurementType`, `brand`.`name` AS `brandName`, `productCategories`.`id` AS `productCategories_id`, `productCategories`.`name` AS `productCategories_name`, `productCategories`.`createdAt` AS `productCategories_createdAt`, `productCategories`.`updatedAt` AS `productCategories_updatedAt`, `productCategories`.`deletedAt` AS `productCategories_deletedAt` FROM `products` `product` LEFT JOIN `brands` `brand` ON  `product`.`brandId` = `brand`.`id` AND `brand`.`deletedAt` IS NULL  LEFT JOIN `product-categories` `productCategories` ON `productCategories`.`deletedAt` IS NULL WHERE `product`.`deletedAt` IS NULL"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`biaplanner\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ?`, ["VIEW","query_product_view","biaplanner"]);
        await queryRunner.query(`DROP VIEW \`query_product_view\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
    }

}
