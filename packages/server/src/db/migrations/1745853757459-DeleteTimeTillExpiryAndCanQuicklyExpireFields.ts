import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteTimeTillExpiryAndCanQuicklyExpireFields1745853757459 implements MigrationInterface {
    name = 'DeleteTimeTillExpiryAndCanQuicklyExpireFields1745853757459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`canQuicklyExpireAfterOpening\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`timeTillExpiryAfterOpening\``);
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` (\`name\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`product_full_text_fields_idx\` ON \`products\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP INDEX \`IDX_4c9fb58de893725258746385e1\``);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`product_full_text_fields_idx\` ON \`products\` (\`name\`, \`description\`)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`timeTillExpiryAfterOpening\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`canQuicklyExpireAfterOpening\` tinyint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_4c9fb58de893725258746385e1\` ON \`products\` (\`name\`)`);
    }

}
