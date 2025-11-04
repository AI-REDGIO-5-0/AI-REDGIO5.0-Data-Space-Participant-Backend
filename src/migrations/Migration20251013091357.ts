import { Migration } from '@mikro-orm/migrations';

export class Migration20251013091357 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "assetRetrievalInfo" cascade;`);

    this.addSql(`drop table if exists "mikro_orm_migrations" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`alter table "accessPolicy" add column "categories" text[] null, add column "trust_level" int null;`);

    this.addSql(`alter table "metadata" drop column "price";`);

    this.addSql(`alter table "transactions" drop column "price";`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "assetRetrievalInfo" ("id" varchar(255) not null, "cloud_asset_id" varchar(255) not null, "version" varchar(255) null, "offset" int4 not null default 0, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, constraint "assetRetrievalInfo_pkey" primary key ("id"));`);
    this.addSql(`alter table "assetRetrievalInfo" add constraint "assetRetrievalInfo_cloud_asset_id_unique" unique ("cloud_asset_id");`);

    this.addSql(`create table "mikro_orm_migrations" ("id" serial primary key, "name" varchar(255) null, "executed_at" timestamptz(6) null default CURRENT_TIMESTAMP);`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "surname" varchar(255) not null, "org_name" varchar(255) not null, "org_address" varchar(255) not null, "org_country" varchar(255) not null, "manufacturing_sector" text[] not null, "org_size" varchar(255) not null, "profit_operation" varchar(255) not null, "ownership" int4 not null, "geo_scope" varchar(255) not null, "participant_hash" varchar(255) not null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, "participant_url" varchar(255) not null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`alter table "accessPolicy" drop column "categories", drop column "trust_level";`);

    this.addSql(`alter table "metadata" add column "price" varchar(255) null;`);

    this.addSql(`alter table "transactions" add column "price" int4 null;`);
  }

}
