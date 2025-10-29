const { DataSource } = require('typeorm');
const { User } = require('./dist/entities/user.entity');
const { TransactionHistory } = require('./dist/entities/transaction-history.entity');

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'balance_db',
  entities: [User, TransactionHistory],
  migrations: ['dist/migrations/*.js'],
});

async function runMigrations() {
  try {
    await dataSource.initialize();
    console.log('Data Source initialized');

    const migrations = await dataSource.runMigrations();
    console.log(`Executed ${migrations.length} migrations`);

    await dataSource.destroy();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

