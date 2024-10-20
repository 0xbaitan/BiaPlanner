import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1729446425823 implements MigrationInterface {
    name = 'InitialMigration1729446425823'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`age\` int NOT NULL DEFAULT '0', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`phone-entries\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`countryCode\` varchar(255) NOT NULL, \`countryCallingCode\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`isForWork\` tinyint NOT NULL DEFAULT 0, \`isForHome\` tinyint NOT NULL DEFAULT 0, \`isMobile\` tinyint NOT NULL DEFAULT 0, \`isLandline\` tinyint NOT NULL DEFAULT 0, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` bigint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`phone-entries\` ADD CONSTRAINT \`FK_198b048aa5b1d52d992b7a850d4\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`phone-entries\` DROP FOREIGN KEY \`FK_198b048aa5b1d52d992b7a850d4\``);
        await queryRunner.query(`DROP TABLE \`phone-entries\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
