import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';

// Configuración de base de datos con valores por defecto para desarrollo local
// Usar 127.0.0.1 en lugar de localhost para evitar problemas con IPv6
const defaultHost = process.env.DB_HOST || '127.0.0.1';
const dbConfig = {
  type: 'mysql' as const,
  host: defaultHost,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3309,
  username: process.env.DB_USERNAME || 'nestjs',
  password: process.env.DB_PASSWORD || 'nestjs',
  database: process.env.DB_DATABASE || 'nestjs_orders',
  entities: [Order],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  retryAttempts: 5,
  retryDelay: 3000,
  autoLoadEntities: true,
  extra: {
    connectionLimit: 10,
    connectTimeout: 60000, // 60 segundos para el timeout de conexión
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  },
};

// Log de configuración en desarrollo (sin mostrar contraseña)
if (process.env.NODE_ENV === 'development') {
  console.log('🔌 Configuración de Base de Datos:');
  console.log(`   Host: ${dbConfig.host}`);
  console.log(`   Port: ${dbConfig.port}`);
  console.log(`   Database: ${dbConfig.database}`);
  console.log(`   Username: ${dbConfig.username}`);
}

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    OrdersModule,
  ],
})
export class AppModule {}
