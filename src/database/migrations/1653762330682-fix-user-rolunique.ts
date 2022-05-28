import {MigrationInterface, QueryRunner} from "typeorm";

export class fixUserRolunique1653762330682 implements MigrationInterface {
    name = 'fixUserRolunique1653762330682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_6620cd026ee2b231beac7cfe578"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_6620cd026ee2b231beac7cfe578" UNIQUE ("role")`);
    }

}
