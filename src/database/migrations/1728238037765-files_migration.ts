import { MigrationInterface, QueryRunner } from "typeorm";

export class FilesMigration1728238037765 implements MigrationInterface {
    name = 'FilesMigration1728238037765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."files_file_status_enum" AS ENUM('uploaded', 'compressed')`);
        await queryRunner.query(`CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "restored_at" TIMESTAMP, "file_name" character varying NOT NULL, "file_size" integer NOT NULL, "file_status" "public"."files_file_status_enum" NOT NULL DEFAULT 'uploaded', "original_file_path" character varying, "compressed_file_path" character varying, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "compressed_at" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP TABLE "files"`);
        await queryRunner.query(`DROP TYPE "public"."files_file_status_enum"`);
    }

}
