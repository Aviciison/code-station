import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyUserHeadPic1729130983284 implements MigrationInterface {
  name = 'ModifyUserHeadPic1729130983284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` COMMENT 'b端用户表'`);
    await queryRunner.query(`ALTER TABLE \`web_users\` COMMENT '后管用户表'`);
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`headPic\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`headPic\` varchar(255) NULL COMMENT '头像'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`headPic\``);
    await queryRunner.query(
      `ALTER TABLE \`users\` ADD \`headPic\` varchar(100) NULL COMMENT '头像'`,
    );
    await queryRunner.query(`ALTER TABLE \`web_users\` COMMENT ''`);
    await queryRunner.query(`ALTER TABLE \`users\` COMMENT ''`);
  }
}
