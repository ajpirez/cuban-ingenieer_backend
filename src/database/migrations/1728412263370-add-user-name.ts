import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserName1728412263370 implements MigrationInterface {
    name = 'AddUserName1728412263370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "name"`);
    }

}
