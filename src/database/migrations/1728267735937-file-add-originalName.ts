import { MigrationInterface, QueryRunner } from "typeorm";

export class FileAddOriginalName1728267735937 implements MigrationInterface {
    name = 'FileAddOriginalName1728267735937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "file_original_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "file_original_name"`);
    }

}
