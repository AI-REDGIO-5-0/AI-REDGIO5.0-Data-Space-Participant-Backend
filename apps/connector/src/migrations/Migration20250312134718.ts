import { Migration } from '@mikro-orm/migrations';

export class Migration20250312134718 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "accessPolicy" ("id" varchar(255) not null, "title" varchar(255) null, "default" boolean null, "scopes" text[] null, "groups" text[] null, "countries" text[] null, "sizes" text[] null, "domains" text[] null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "accessPolicy_pkey" primary key ("id"));`);

    this.addSql(`alter table "metadata" add column "price" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "accessPolicy" cascade;`);

    this.addSql(`alter table "metadata" drop column "price";`);
  }

}
