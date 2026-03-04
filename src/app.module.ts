import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConsumerModule } from '../modules/consumer';
import { ProviderModule } from '../modules/provider';
import { IAppConfig } from './app-config.interface';
import { AppConfig } from './app.config';
import { IConnectorConfig } from './app.config';
import { MinioModule } from '../modules/minio';
import {
  AuthGuard,
  KeycloakConnectModule,
  PolicyEnforcementMode,
  RoleGuard,
  TokenValidation,
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';
import { MorganMiddleware } from './logger/morgan.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forFeature(AppConfig),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(AppConfig)],
      useFactory: async (options: IAppConfig) => ({
        driver: PostgreSqlDriver,
        ...options.database,
        autoLoadEntities: true,
      }),
      inject: [AppConfig.KEY],
      driver: PostgreSqlDriver,
    }),
    ConsumerModule.registerAsync({
      imports: [ConfigModule.forFeature(AppConfig)],
      useFactory: async (options: IConnectorConfig) => ({
        cloudCatalogUrl: options.cloudCatalogUrl,
        bucketName: options.bucketName,
      }),
      inject: [AppConfig.KEY],
    }),
    MinioModule.forRoot({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: +(process.env.MINIO_PORT)!,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
      useSSL: process.env.MINIO_SSL === 'true',
    }),
    ProviderModule.registerAsync({
      imports: [ConfigModule.forFeature(AppConfig)],
      useFactory: async (options: IConnectorConfig) => ({
        cloudCatalogUrl: options.cloudCatalogUrl,
        userId: options.userId,
        bucketName: options.bucketName,
      }),
      inject: [AppConfig.KEY],
    }),
    KeycloakConnectModule.registerAsync({
      imports: [ConfigModule.forFeature(AppConfig)],
      inject: [AppConfig.KEY],
      useFactory: (options: IAppConfig) => ({
        logLevels: ['error'],
        authServerUrl: options.keycloak.url,
        realm: options.keycloak.realm,
        clientId: options.keycloak.clientId,
        secret: options.keycloak.clientSecret,
        useNestLogger: false,
        policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
        tokenValidation: TokenValidation.OFFLINE,
      }),
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('{*splat}');
  }
}
