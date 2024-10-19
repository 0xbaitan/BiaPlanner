import { DataSourceOptions, DataSource } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST ?? 'localhost',
  port: !isNaN(Number(process.env.MYSQL_PORT))
    ? Number(process.env.MYSQL_PORT)
    : 3306,
  username: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? 'root',
  database: process.env.MYSQL_DATABASE ?? 'biaplanner',
  synchronize: false,
  bigNumberStrings: true,
  logging: true,
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: ['dist/migrations/**/*.{ts,js}'],
  migrationsRun: true,
  migrationsTableName: 'migrations',
};
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
