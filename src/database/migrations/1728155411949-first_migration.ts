import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1728155411949 implements MigrationInterface {
    name = 'FirstMigration1728155411949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "restored_at" TIMESTAMP, "email" character varying NOT NULL, "password" character varying, "role" character varying NOT NULL DEFAULT 'user', "createdById" uuid, "deletedById" uuid, "updatedById" uuid, "restoredById" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "restored_at" TIMESTAMP, "title" character varying NOT NULL, "completed" boolean NOT NULL DEFAULT false, "userId" uuid, "createdById" uuid, "deletedById" uuid, "updatedById" uuid, "restoredById" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_c3062c4102a912dfe7195a72bfb" FOREIGN KEY ("deletedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_f64173699316860c0a9fd6be296" FOREIGN KEY ("restoredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_26b96babe5a5ce54c7b2f10f158" FOREIGN KEY ("deletedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_c4e89b2a663dddc89aaedb46ed8" FOREIGN KEY ("updatedById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_8830e6835cb11f7c86a46a3c39e" FOREIGN KEY ("restoredById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_8830e6835cb11f7c86a46a3c39e"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_c4e89b2a663dddc89aaedb46ed8"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_26b96babe5a5ce54c7b2f10f158"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_91d76dd2ae372b9b7dfb6bf3fd2"`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_f316d3fe53497d4d8a2957db8b9"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_f64173699316860c0a9fd6be296"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_db5173f7d27aa8a98a9fe6113df"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_c3062c4102a912dfe7195a72bfb"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_45c0d39d1f9ceeb56942db93cc5"`);
        await queryRunner.query(`DROP TABLE "task"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
