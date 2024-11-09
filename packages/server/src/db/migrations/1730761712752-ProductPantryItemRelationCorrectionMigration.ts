import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductPantryItemRelationCorrectionMigration1730761712752 implements MigrationInterface {
    name = 'ProductPantryItemRelationCorrectionMigration1730761712752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`pantry-items\` ADD CONSTRAINT \`FK_6f282d4eb8c25f6221645b5e338\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`pantry-items\` DROP FOREIGN KEY \`FK_6f282d4eb8c25f6221645b5e338\``);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`dateOfBirth\` \`dateOfBirth\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

}
