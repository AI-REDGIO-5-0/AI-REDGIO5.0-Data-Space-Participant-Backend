import { Migration } from '@mikro-orm/migrations';

export class Migration20250408120845 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" drop constraint "metadata_asset_id_unique";`);

    this.addSql(`alter table "transactions" add column "type" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" add constraint "metadata_asset_id_unique" unique ("asset_id");`);

    this.addSql(`alter table "transactions" drop column "type";`);
  }

}
