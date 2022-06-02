import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Client } from 'pg';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
import { getSsl } from 'src/common/get-ssl';

const API_KEY = '123456';
const API_KEY_PROD = '654321';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const ssl = getSsl();
        return {
          entities: ['dist/**/*.entity{.ts,.js}'],
          type: 'postgres',
          url: configService.postgresUrl,
          synchronize: false,
          autoLoadEntities: true,
          ssl,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const ssl = getSsl();
        const client = new Client({
          connectionString: configService.postgresUrl,
          ssl,
        });
        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'PG', TypeOrmModule],
})
export class DatabaseModule {}
