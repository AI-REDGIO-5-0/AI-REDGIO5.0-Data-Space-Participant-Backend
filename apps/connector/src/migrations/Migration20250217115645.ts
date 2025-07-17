import { Migration } from '@mikro-orm/migrations';

export class Migration20250217115645 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "metadata" ("id" varchar(255) not null, "asset_id" varchar(255) not null, "version" varchar(255) null, "data_type" text not null, "title" varchar(255) not null, "description" varchar(255) null, "keywords" varchar(255) not null, "language" varchar(255) not null, "publisher" varchar(255) not null, "published" boolean not null, "user" varchar(255) not null, "filesize" int not null, "domain" varchar(255) not null, "acquired_on" timestamptz null, "contract_terms" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "metadata_pkey" primary key ("id"));`);
    this.addSql(`alter table "metadata" add constraint "metadata_asset_id_unique" unique ("asset_id");`);

    this.addSql(`create table "transactions" ("id" varchar(255) not null, "version" varchar(255) null, "seller" varchar(255) not null, "asset_title" varchar(255) not null, "asset_id" varchar(255) not null, "price" int null, "sector" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "transactions_pkey" primary key ("id"));`);

    this.addSql(`create table "user" ("id" varchar(255) not null, "name" varchar(255) not null, "surname" varchar(255) not null, "org_name" varchar(255) not null, "org_address" varchar(255) not null, "org_country" varchar(255) not null, "manufacturing_sector" text[] not null, "org_size" varchar(255) not null, "profit_operation" varchar(255) not null, "ownership" int not null, "geo_scope" varchar(255) not null, "participant_hash" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "user_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "connectorInfo" cascade;`);

    this.addSql(`drop table if exists "contracts" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "connectorInfo" ("id" uuid not null, "contract_id" varchar(255) not null, "asset_id" varchar(255) not null, "consumer_id" varchar(255) not null, "provider_id" varchar(255) not null, "version_id" int4 null, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, constraint "connectorInfo_pkey" primary key ("id"));`);

    this.addSql(`create table "contracts" ("id" uuid not null, "consumer_id" varchar(255) not null, "provider_id" varchar(255) not null, "type" varchar(255) not null, "is_valid" bool not null default false, "created_at" timestamptz(6) not null, "updated_at" timestamptz(6) not null, constraint "contracts_pkey" primary key ("id"));`);

    this.addSql(`drop table if exists "metadata" cascade;`);

    this.addSql(`drop table if exists "transactions" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

}
