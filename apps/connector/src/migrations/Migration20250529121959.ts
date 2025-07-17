import { Migration } from '@mikro-orm/migrations';

export class Migration20250529121959 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "accessPolicy" add column "trust_level" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accessPolicy" drop column "trust_level";`);
  }

}
