import { DataSourceOptions } from 'typeorm';

export const config: DataSourceOptions = {
  type: 'better-sqlite3',
  database: '.db/sql',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
};
