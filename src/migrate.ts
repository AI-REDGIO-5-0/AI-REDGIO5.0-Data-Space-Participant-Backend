import { MikroORM } from '@mikro-orm/postgresql';
import mikroConfig from '../mikro-orm.config';

(async () => {
  const orm = await MikroORM.init(mikroConfig); // Use existing config
  const migrator = orm.getMigrator();

  console.log('📢 Running migrations...');
  await migrator.up(); // Apply all pending migrations
  console.log('✅ Migrations completed');

  await orm.close(true);
})();
