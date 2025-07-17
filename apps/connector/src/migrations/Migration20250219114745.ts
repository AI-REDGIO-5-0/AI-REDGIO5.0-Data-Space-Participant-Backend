import { Migration } from '@mikro-orm/migrations';

export class Migration20250219114745 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "filesize" type real using ("filesize"::real);`);
    this.addSql(`alter table "metadata" alter column "domain" type varchar(255) using ("domain"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "domain" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "filesize" type int using ("filesize"::int);`);
    this.addSql(`alter table "metadata" alter column "domain" type varchar(255) using ("domain"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "domain" set not null;`);
  }

}
