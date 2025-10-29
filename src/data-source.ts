import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { TransactionHistory } from './entities/transaction-history.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'balance_db',
  entities: [User, TransactionHistory],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});

