import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

export const APP_PROVIDERS = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
];
