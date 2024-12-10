import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductCategoryCascadeMigration11733867731172 implements MigrationInterface {
    name = 'ProductCategoryCascadeMigration11733867731172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_7c5938995ef0e554b6d4035231\` ON \`products_product-categories\` (\`productId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_83f4b7319fd1e2ee3d4e5ae86e\` ON \`products_product-categories\` (\`productCategoryId\`)`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD CONSTRAINT \`FK_7c5938995ef0e554b6d40352313\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD CONSTRAINT \`FK_83f4b7319fd1e2ee3d4e5ae86eb\` FOREIGN KEY (\`productCategoryId\`) REFERENCES \`product-categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP FOREIGN KEY \`FK_83f4b7319fd1e2ee3d4e5ae86eb\``);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` DROP FOREIGN KEY \`FK_7c5938995ef0e554b6d40352313\``);
        await queryRunner.query(`DROP INDEX \`IDX_83f4b7319fd1e2ee3d4e5ae86e\` ON \`products_product-categories\``);
        await queryRunner.query(`DROP INDEX \`IDX_7c5938995ef0e554b6d4035231\` ON \`products_product-categories\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`products\` CHANGE \`numberOfServingsOrPieces\` \`numberOfServingsOrPieces\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`products_product-categories\` ADD \`id\` bigint NOT NULL`);
    }

}
