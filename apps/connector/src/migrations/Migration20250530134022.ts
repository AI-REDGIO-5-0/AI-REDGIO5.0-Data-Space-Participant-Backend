import { Migration } from '@mikro-orm/migrations';

export class Migration20250530134022 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "accessPolicy" add column "categories" text[] null;`);

    this.addSql(`alter table "metadata" drop column "price";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "accessPolicy" drop column "categories";`);

    this.addSql(`alter table "metadata" add column "price" varchar(255) null;`);
  }

}
