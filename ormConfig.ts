import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost', // Your PostgreSQL host
  username: 'ahmed_abdelkader',
  password: '#122000FGH',
  port: 5432, // Your PostgreSQL port
  database: 'Chat', // PostgreSQL database name4
  entities: ['dist/src/**/*.entity.js'],
  synchronize: true, // Should be disabled in production, syncs the schema with the DB
};

export default config;
