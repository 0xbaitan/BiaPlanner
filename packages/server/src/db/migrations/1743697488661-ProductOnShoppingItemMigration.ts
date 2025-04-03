import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductOnShoppingItemMigration1743697488661 implements MigrationInterface {
    name = 'ProductOnShoppingItemMigration1743697488661'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`DROP INDEX \`FK_cfc7e466dc17c283c407d4f53b1\` ON \`shopping-items\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`ALTER TABLE \`shopping-items\` ADD CONSTRAINT \`FK_cfc7e466dc17c283c407d4f53b1\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shopping-items\` DROP FOREIGN KEY \`FK_cfc7e466dc17c283c407d4f53b1\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`CREATE INDEX \`FK_cfc7e466dc17c283c407d4f53b1\` ON \`shopping-items\` (\`productId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
    }

}
