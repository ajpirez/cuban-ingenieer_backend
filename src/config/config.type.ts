import { CryptoConfig } from 'src/common/encrypting/config/crypto-config.type';
import { DatabaseConfig } from 'src/database/config/database-config.type';
import { RedisConfig } from 'src/redis/config/redis-config.type';
import { AuthConfig } from '../auth/config/auth-config.type';
import { AppConfig } from './app-config.type';

export type AllConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  crypto: CryptoConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
};
