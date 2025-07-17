import { Migration } from '@mikro-orm/migrations';

export class Migration20250313175012 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" add column "file_ext" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" drop column "file_ext";`);
  }

}
