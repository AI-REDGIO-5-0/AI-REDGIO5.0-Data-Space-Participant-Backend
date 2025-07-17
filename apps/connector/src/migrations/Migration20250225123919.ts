import { Migration } from '@mikro-orm/migrations';

export class Migration20250225123919 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" add column "license" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" drop column "license";`);
  }

}
