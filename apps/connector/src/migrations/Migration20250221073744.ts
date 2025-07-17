import { Migration } from '@mikro-orm/migrations';

export class Migration20250221073744 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "participant_url" varchar(255) not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" drop column "participant_url";`);
  }

}
