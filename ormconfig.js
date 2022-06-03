import { join } from 'path';

module.exports = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: false,
  migrationsRun: true,
  migrations: [join(__dirname, '../migrations/**/*{.ts,.js}')],
  migrationsTableName: 'migrations',
  entities: [join(__dirname + './**/*.entity{.ts,.js}')],
  cli: {
    migrationsDir: 'src/database/migrations',
  },
  ssl: {
    rejectUnauthorized: false,
  },
};
