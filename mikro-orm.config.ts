import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import entities from './src/entities';

const config: MikroOrmModuleOptions = {
  entities,
  dbName: process.env.DB_NAME || 'connector',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  driver: PostgreSqlDriver, // PostgreSQL database type
  migrations: {
    path: 'migrations', // Migrations folder for compiled files
    pathTs: 'src/migrations', // Migrations folder for TypeScript files
    tableName: 'mikroorm_migrations', // Name of migrations table in DB
    glob: '!(*.d).{js,ts}', // Include JS & TS files
  },
  debug: true,
};

export default config;
