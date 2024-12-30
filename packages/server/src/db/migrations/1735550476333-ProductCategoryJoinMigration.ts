import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductCategoryJoinMigration1735550476333 implements MigrationInterface {
    name = 'ProductCategoryJoinMigration1735550476333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP FOREIGN KEY \`FK_7c5938995ef0e554b6d40352313\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD CONSTRAINT \`FK_7c5938995ef0e554b6d40352313\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD CONSTRAINT \`FK_83f4b7319fd1e2ee3d4e5ae86eb\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product-categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP FOREIGN KEY \`FK_83f4b7319fd1e2ee3d4e5ae86eb\``);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP FOREIGN KEY \`FK_7c5938995ef0e554b6d40352313\``);
        await queryRunner.query(`ALTER TABLE \`reminders\` CHANGE \`reminderDate\` \`reminderDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD CONSTRAINT \`FK_7c5938995ef0e554b6d40352313\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
