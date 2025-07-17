import { Migration } from '@mikro-orm/migrations';

export class Migration20250219141616 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "keywords" type text[] using ("keywords"::text[]);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "keywords" type varchar(255) using ("keywords"::varchar(255));`);
  }

}
