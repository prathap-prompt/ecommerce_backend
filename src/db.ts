import './env';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Address } from './entities/address';
import { Cart } from './entities/cart';
import { cartitems } from './entities/cartitems';
import { Category } from './entities/categories';
import { Order } from './entities/oders';
import { OrderItem } from './entities/oderitems';
import { Payment } from './entities/payments';
import { PasswordResetToken } from './entities/passwordreset';
import { Product } from './entities/product';
import { ProductVariant } from './entities/productvarients';
import { Review } from './entities/reviews';
import { users } from './entities/users.entity';
import { Warehouse } from './entities/warehouse';
import { WishlistItem } from './entities/wishlist';


declare const process: {
  env: {
    DATABASE_URL?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_USERNAME?: string;
    DB_PASSWORD?: string;
    DB_NAME?: string;
    DB_SSL?: string;
    MIGRATION_DATABASE_URL?: string;
    DIRECT_URL?: string;
  };
};

declare const __dirname: string;

const usableUrl = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const placeholderPatterns = ['[YOUR-PASSWORD]', 'YOUR-PASSWORD'];
  for (const pattern of placeholderPatterns) {
    if (value.includes(pattern)) {
      return undefined;
    }
  }

  return value;
};

const connectionUrl =
  usableUrl(process.env.DIRECT_URL) ||
  usableUrl(process.env.MIGRATION_DATABASE_URL) ||
  usableUrl(process.env.DATABASE_URL);

export const dataSourceOptions = {
  type: 'postgres' as const,
  url: connectionUrl,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'project1',
  ssl:
    process.env.DB_SSL === 'true'
      ? { rejectUnauthorized: false }
      : undefined,
  extra: {
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  },
  entities: [
    Address,
    Cart,
    cartitems,
    Category,
    Order,
    OrderItem,
    Payment,
    PasswordResetToken,
    Product,
    ProductVariant,
    Review,
    users,
    Warehouse,
    WishlistItem,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true,
  logging: true,
};

export const migrationDataSourceOptions = {
  ...dataSourceOptions,
  url: connectionUrl,
} as DataSourceOptions;

export default new DataSource(migrationDataSourceOptions);
