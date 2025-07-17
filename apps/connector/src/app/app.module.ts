import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { ConsumerModule } from "@ai-redgio/consumer";
import { ProviderModule } from "@ai-redgio/provider";
import { IAppConfig, MorganMiddleware } from "@ai-redgio/shared";
import { AppConfig, IConnectorConfig } from './app.config';
import { MinioModule } from '@ai-redgio/minio';
import { UsersModule } from '@ai-redgio/users';
import { AuthGuard, KeycloakConnectModule, PolicyEnforcementMode, RoleGuard, TokenValidation } from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

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
        minioUrl: options.minioUrl,
        minioAccessKey: options.minioAccessKey,
        minioSecretKey: options.minioSecretKey,
        cloudCatalogUrl: options.cloudCatalogUrl,
        // notificationsUrl: options.notificationsUrl,
      }),
      inject: [AppConfig.KEY],
    }),
    MinioModule.forRoot({
      endPoint: process.env.MINIO_ENDPOINT || 'minio',
      port: parseInt(process.env.MINIO_PORT, 10) || 9000,
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
      useSSL: false,
    }),
    ProviderModule.registerAsync({
      imports: [ConfigModule.forFeature(AppConfig)],
      useFactory: async (options: IConnectorConfig) => ({
        minioUrl: options.minioUrl,
        minioAccessKey: options.minioAccessKey,
        minioSecretKey: options.minioSecretKey,
        cloudCatalogUrl: options.cloudCatalogUrl,
        userId: options.userId,
        // notificationsUrl: options.notificationsUrl,
      }),
      inject: [AppConfig.KEY],
    }),
    KeycloakConnectModule.registerAsync({
        imports: [ConfigModule.forFeature(AppConfig)],
        inject: [AppConfig.KEY],
        useFactory: (options: IAppConfig) => ({
            authServerUrl: options.keycloak.url,
            realm: options.keycloak.realm,
            clientId: options.keycloak.clientId,
            secret: options.keycloak.clientSecret,
            useNestLogger: true,
            policyEnforcement: PolicyEnforcementMode.PERMISSIVE,
            tokenValidation: TokenValidation.OFFLINE,
        }),
    }),
    UsersModule
  ],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AuthGuard,
},
{
    provide: APP_GUARD,
    useClass: RoleGuard,
},],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MorganMiddleware).forRoutes('*');
  }
}
