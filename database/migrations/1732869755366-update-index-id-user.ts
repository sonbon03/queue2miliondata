import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndexIdUser1732869755366 implements MigrationInterface {
    name = 'UpdateIndexIdUser1732869755366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e752aee509d8f8118c6e5b1d8c"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_e752aee509d8f8118c6e5b1d8c" ON "users" ("email", "id") `);
    }

}
