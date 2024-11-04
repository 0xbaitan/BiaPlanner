import { MigrationInterface, QueryRunner } from "typeorm";

export class PantryRelatedMigration1730757557375 implements MigrationInterface {
    name = 'PantryRelatedMigration1730757557375'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`brands\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`brandName\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_6aac8072508b60a2c4173504a7\` (\`brandName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product-classifications\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`classificationName\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_c6909372902d9b4c3da271c6e6\` (\`classificationName\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NULL, \`productClassificationId\` bigint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`pantry-items\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`userId\` bigint NULL, \`brandedItemName\` varchar(255) NULL, \`brandId\` bigint NOT NULL, \`quantity\` decimal NOT NULL, \`productId\` bigint NOT NULL, \`expiryDate\` timestamp NULL, \`addedDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`bestBeforeDate\` timestamp NULL, \`manufacturedDate\` timestamp NULL, \`openedDate\` timestamp NULL, \`millisecondsToExpiryAfterOpening\` decimal NOT NULL DEFAULT '0', \`isExpired\` tinyint NOT NULL DEFAULT 0, \`canQuicklyExpireAfterOpening\` tinyint NOT NULL DEFAULT 0, \`numberOfServingsOrPieces\` decimal NOT NULL DEFAULT '0', \`weightPerContainerOrPacket\` decimal NOT NULL DEFAULT '0', \`weightUnit\` enum ('kg', 'g', 'lb', 'oz', 'mg', 'mcg') NOT NULL DEFAULT 'g', \`volumePerContainerOrPacket\` decimal NOT NULL DEFAULT '0', \`volumeUnit\` enum ('L', 'mL', 'gal', 'qt', 'pt', 'cup', 'tbsp', 'tsp', 'fl oz', 'm3', 'cm3', 'in3') NOT NULL DEFAULT 'mL', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_f2bf74038945184fe92f4765ca8\` FOREIGN KEY (\`productClassificationId\`) REFERENCES \`product-classifications\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD CONSTRAINT \`FK_6ee51add0184968402669260668\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD CONSTRAINT \`FK_3aed030341e43394f604b866148\` FOREIGN KEY (\`brandId\`) REFERENCES \`brands\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP FOREIGN KEY \`FK_3aed030341e43394f604b866148\``);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP FOREIGN KEY \`FK_6ee51add0184968402669260668\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_f2bf74038945184fe92f4765ca8\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`DROP TABLE \`pantry-items\``);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`DROP INDEX \`IDX_c6909372902d9b4c3da271c6e6\` ON \`product-classifications\``);
        await queryRunner.query(`DROP TABLE \`product-classifications\``);
        await queryRunner.query(`DROP INDEX \`IDX_6aac8072508b60a2c4173504a7\` ON \`brands\``);
        await queryRunner.query(`DROP TABLE \`brands\``);
    }

}
