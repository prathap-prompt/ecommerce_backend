import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUsersPhoneToVarchar1783262416687 implements MigrationInterface {
    name = 'ChangeUsersPhoneToVarchar1783262416687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" TYPE character varying(20)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" TYPE integer USING ("phone"::integer)`);
    }
}
