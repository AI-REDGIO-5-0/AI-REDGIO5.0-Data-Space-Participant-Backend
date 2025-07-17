import { Migration } from '@mikro-orm/migrations';

export class Migration20250225123905 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" drop column "download_url";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" add column "download_url" varchar(255) null;`);
  }

}
