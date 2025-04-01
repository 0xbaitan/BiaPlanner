import { MigrationInterface, QueryRunner } from "typeorm";

export class QueryProductViewAndIndicesMigration1743462171018 implements MigrationInterface {
    name = 'QueryProductViewAndIndicesMigration1743462171018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`CREATE VIEW \`search_product_view\` AS SELECT \`product\`.\`id\` AS \`id\`, \`product\`.\`name\` AS \`name\`, \`product\`.\`description\` AS \`description\`, \`product\`.\`brandId\` AS \`brandId\`, \`product\`.\`measurement\` AS \`measurement\`, \`product\`.\`measurementType\` AS \`measurementType\`, \`brand\`.\`name\` AS \`brandName\`, \`productCategories\`.\`id\` AS \`productCategories_id\`, \`productCategories\`.\`name\` AS \`productCategories_name\`, \`productCategories\`.\`createdAt\` AS \`productCategories_createdAt\`, \`productCategories\`.\`updatedAt\` AS \`productCategories_updatedAt\`, \`productCategories\`.\`deletedAt\` AS \`productCategories_deletedAt\` FROM \`products\` \`product\` LEFT JOIN \`brands\` \`brand\` ON  \`product\`.\`brandId\` = \`brand\`.\`id\` AND \`brand\`.\`deletedAt\` IS NULL  LEFT JOIN \`products_product-categories\` \`product_productCategories\` ON \`product_productCategories\`.\`productId\`=\`product\`.\`id\` LEFT JOIN \`product-categories\` \`productCategories\` ON \`productCategories\`.\`id\`=\`product_productCategories\`.\`productCategoryId\` AND (\`productCategories\`.\`deletedAt\` IS NULL) WHERE \`product\`.\`deletedAt\` IS NULL`);
        await queryRunner.query(`INSERT INTO \`biaplanner\`.\`typeorm_metadata\`(\`database\`, \`schema\`, \`table\`, \`type\`, \`name\`, \`value\`) VALUES (DEFAULT, ?, DEFAULT, ?, ?, ?)`, ["biaplanner","VIEW","search_product_view","SELECT `product`.`id` AS `id`, `product`.`name` AS `name`, `product`.`description` AS `description`, `product`.`brandId` AS `brandId`, `product`.`measurement` AS `measurement`, `product`.`measurementType` AS `measurementType`, `brand`.`name` AS `brandName`, `productCategories`.`id` AS `productCategories_id`, `productCategories`.`name` AS `productCategories_name`, `productCategories`.`createdAt` AS `productCategories_createdAt`, `productCategories`.`updatedAt` AS `productCategories_updatedAt`, `productCategories`.`deletedAt` AS `productCategories_deletedAt` FROM `products` `product` LEFT JOIN `brands` `brand` ON  `product`.`brandId` = `brand`.`id` AND `brand`.`deletedAt` IS NULL  LEFT JOIN `products_product-categories` `product_productCategories` ON `product_productCategories`.`productId`=`product`.`id` LEFT JOIN `product-categories` `productCategories` ON `productCategories`.`id`=`product_productCategories`.`productCategoryId` AND (`productCategories`.`deletedAt` IS NULL) WHERE `product`.`deletedAt` IS NULL"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM \`biaplanner\`.\`typeorm_metadata\` WHERE \`type\` = ? AND \`name\` = ? AND \`schema\` = ?`, ["VIEW","search_product_view","biaplanner"]);
        await queryRunner.query(`DROP VIEW \`search_product_view\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`description\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
    }

}
