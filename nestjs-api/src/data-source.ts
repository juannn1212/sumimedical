import { DataSource } from 'typeorm';
import { Order } from './orders/entities/order.entity';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3309,
  username: process.env.DB_USERNAME || 'nestjs',
  password: process.env.DB_PASSWORD || 'nestjs',
  database: process.env.DB_DATABASE || 'nestjs_orders',
  entities: [Order],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
