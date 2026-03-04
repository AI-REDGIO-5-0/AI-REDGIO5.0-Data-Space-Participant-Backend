import { Migration } from '@mikro-orm/migrations';

export class Migration20251105120813 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "accessPolicy" ("id" varchar(255) not null, "title" varchar(255) null, "description" varchar(255) null, "default" boolean null, "scopes" text[] null, "groups" text[] null, "countries" text[] null, "sizes" text[] null, "domains" text[] null, "categories" text[] null, "trust_level" int null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "accessPolicy_pkey" primary key ("id"));`);

    this.addSql(`create table "metadata" ("id" varchar(255) not null, "asset_id" varchar(255) not null, "version" varchar(255) null, "data_type" text not null, "title" varchar(255) null, "description" varchar(255) null, "keywords" text[] null, "language" varchar(255) null, "publisher" varchar(255) null, "published" boolean null, "user" varchar(255) null, "filesize" real not null, "domain" varchar(255) null, "acquired_on" timestamptz null, "license" varchar(255) null, "contract_terms" varchar(255) null, "file_ext" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "metadata_pkey" primary key ("id"));`);

    this.addSql(`create table "transactions" ("id" varchar(255) not null, "version" varchar(255) null, "seller" varchar(255) not null, "asset_title" varchar(255) not null, "asset_id" varchar(255) not null, "sector" varchar(255) not null, "type" varchar(255) not null, "transaction_id" varchar(255) null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "transactions_pkey" primary key ("id"));`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "accessPolicy" cascade;`);

    this.addSql(`drop table if exists "metadata" cascade;`);

    this.addSql(`drop table if exists "transactions" cascade;`);
  }

}
