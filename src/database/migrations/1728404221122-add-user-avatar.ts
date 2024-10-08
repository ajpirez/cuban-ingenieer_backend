import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserAvatar1728404221122 implements MigrationInterface {
    name = 'AddUserAvatar1728404221122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatar" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    }

}
