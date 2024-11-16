import { MigrationInterface, QueryRunner } from "typeorm";

export class ResetMigration1731796148650 implements MigrationInterface {
    name = 'ResetMigration1731796148650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_96db6bbbaa6f23cad26871339b\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product-categories\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_2f577d0aa068f996bca5a2c5a6\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`brandId\` bigint NOT NULL, \`canQuicklyExpireAfterOpening\` tinyint NOT NULL DEFAULT 0, \`millisecondsToExpiryAfterOpening\` int NULL, \`createdById\` bigint NULL, \`isGlobal\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pantry-items\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`createdById\` bigint NULL, \`productId\` bigint NULL, \`quantity\` int NOT NULL, \`expiryDate\` timestamp NULL, \`isExpired\` timestamp NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`phone-entries\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`countryCode\` varchar(255) NOT NULL, \`countryCallingCode\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`isForWork\` tinyint NOT NULL DEFAULT 0, \`isForHome\` tinyint NOT NULL DEFAULT 0, \`isMobile\` tinyint NOT NULL DEFAULT 0, \`isLandline\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`dateOfBirth\` timestamp NOT NULL, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products_product_categories_product-categories\` (\`productsId\` bigint NOT NULL, \`productCategoriesId\` bigint NOT NULL, INDEX \`IDX_9a8164bc3baa9d1ebd50a0a92b\` (\`productsId\`), INDEX \`IDX_10a4e7623ba7ca4f3ce23d13c3\` (\`productCategoriesId\`), PRIMARY KEY (\`productsId\`, \`productCategoriesId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ea86d0c514c4ecbb5694cbf57df\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_de1043dff8f68e83a20480b00f7\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD CONSTRAINT \`FK_171121d1b1f373c10d81f995e54\` FOREIGN KEY (\`createdById\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD CONSTRAINT \`FK_6f282d4eb8c25f6221645b5e338\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` ADD CONSTRAINT \`FK_198b048aa5b1d52d992b7a850d4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products_product_categories_product-categories\` ADD CONSTRAINT \`FK_9a8164bc3baa9d1ebd50a0a92ba\` FOREIGN KEY (\`productsId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`products_product_categories_product-categories\` ADD CONSTRAINT \`FK_10a4e7623ba7ca4f3ce23d13c3b\` FOREIGN KEY (\`productCategoriesId\`) REFERENCES \`product-categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_product_categories_product-categories\` DROP FOREIGN KEY \`FK_10a4e7623ba7ca4f3ce23d13c3b\``);
        await queryRunner.query(`ALTER TABLE \`products_product_categories_product-categories\` DROP FOREIGN KEY \`FK_9a8164bc3baa9d1ebd50a0a92ba\``);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` DROP FOREIGN KEY \`FK_198b048aa5b1d52d992b7a850d4\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP FOREIGN KEY \`FK_6f282d4eb8c25f6221645b5e338\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP FOREIGN KEY \`FK_171121d1b1f373c10d81f995e54\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_de1043dff8f68e83a20480b00f7\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ea86d0c514c4ecbb5694cbf57df\``);
        await queryRunner.query(`DROP INDEX \`IDX_10a4e7623ba7ca4f3ce23d13c3\` ON \`products_product_categories_product-categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_9a8164bc3baa9d1ebd50a0a92b\` ON \`products_product_categories_product-categories\``);
        await queryRunner.query(`DROP TABLE \`products_product_categories_product-categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`phone-entries\``);
        await queryRunner.query(`DROP TABLE \`pantry-items\``);
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_2f577d0aa068f996bca5a2c5a6\` ON \`product-categories\``);
        await queryRunner.query(`DROP TABLE \`product-categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_96db6bbbaa6f23cad26871339b\` ON \`brands\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
    }

}
