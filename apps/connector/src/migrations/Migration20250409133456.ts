import { Migration } from '@mikro-orm/migrations';

export class Migration20250409133456 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "transactions" add column "transaction_id" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "transactions" drop column "transaction_id";`);
  }

}
