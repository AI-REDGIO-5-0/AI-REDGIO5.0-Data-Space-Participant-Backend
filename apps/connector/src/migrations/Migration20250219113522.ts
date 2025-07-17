import { Migration } from '@mikro-orm/migrations';

export class Migration20250219113522 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "title" drop not null;`);
    this.addSql(`alter table "metadata" alter column "keywords" type varchar(255) using ("keywords"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "keywords" drop not null;`);
    this.addSql(`alter table "metadata" alter column "language" type varchar(255) using ("language"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "language" drop not null;`);
    this.addSql(`alter table "metadata" alter column "publisher" type varchar(255) using ("publisher"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "publisher" drop not null;`);
    this.addSql(`alter table "metadata" alter column "published" type boolean using ("published"::boolean);`);
    this.addSql(`alter table "metadata" alter column "published" drop not null;`);
    this.addSql(`alter table "metadata" alter column "user" type varchar(255) using ("user"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "user" drop not null;`);
    this.addSql(`alter table "metadata" alter column "contract_terms" type varchar(255) using ("contract_terms"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "contract_terms" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "metadata" alter column "title" type varchar(255) using ("title"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "title" set not null;`);
    this.addSql(`alter table "metadata" alter column "keywords" type varchar(255) using ("keywords"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "keywords" set not null;`);
    this.addSql(`alter table "metadata" alter column "language" type varchar(255) using ("language"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "language" set not null;`);
    this.addSql(`alter table "metadata" alter column "publisher" type varchar(255) using ("publisher"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "publisher" set not null;`);
    this.addSql(`alter table "metadata" alter column "published" type boolean using ("published"::boolean);`);
    this.addSql(`alter table "metadata" alter column "published" set not null;`);
    this.addSql(`alter table "metadata" alter column "user" type varchar(255) using ("user"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "user" set not null;`);
    this.addSql(`alter table "metadata" alter column "contract_terms" type varchar(255) using ("contract_terms"::varchar(255));`);
    this.addSql(`alter table "metadata" alter column "contract_terms" set not null;`);
  }

}
