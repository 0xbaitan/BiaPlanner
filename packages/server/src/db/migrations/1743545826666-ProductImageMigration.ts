import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductImageMigration1743545826666 implements MigrationInterface {
    name = 'ProductImageMigration1743545826666'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`coverId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`logoId\` bigint NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_1cb1961c70a20b379b6cf15c91\` (\`logoId\`)`);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_1cb1961c70a20b379b6cf15c91\` ON \`products\` (\`logoId\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_1cb1961c70a20b379b6cf15c91b\` FOREIGN KEY (\`logoId\`) REFERENCES \`files\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_1cb1961c70a20b379b6cf15c91b\``);
        await queryRunner.query(`DROP INDEX \`REL_1cb1961c70a20b379b6cf15c91\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_1cb1961c70a20b379b6cf15c91\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`logoId\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`coverId\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
    }

}
