import { Migration } from '@mikro-orm/migrations';

export class Migration20250313083113 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "accessPolicy" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accessPolicy" drop column "description";`);
  }

}
