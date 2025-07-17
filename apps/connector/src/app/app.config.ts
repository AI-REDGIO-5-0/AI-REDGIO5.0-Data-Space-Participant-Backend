import { registerAs } from '@nestjs/config';
import { IAppConfig } from '@ai-redgio/shared';

export type IConnectorConfig = IAppConfig & {
    minioUrl: string;
    minioAccessKey: string;
    minioSecretKey: string;
    cloudCatalogUrl: string;
    userId: string;
    // notificationsUrl: string;
};

export const AppConfig = registerAs(
    'app',
    (): IConnectorConfig => ({
        name: process.env.APP_NAME,
        port: +process.env.APP_PORT,
        database: {
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            dbName: process.env.DB_NAME,
        },
        minioUrl: process.env.MINIO_ENDPOINT,
        minioAccessKey: process.env.MINIO_ACCESS_KEY,
        minioSecretKey: process.env.MINIO_SECRET_KEY,
        cloudCatalogUrl: process.env.CLOUD_CATALOG_URL,
        userId: process.env.USER_ID,
        keycloak: {
            url: process.env.KC_URL,
            realm: process.env.KC_REALM,
            clientId: process.env.KC_CLIENT_ID,
            clientSecret: process.env.KC_CLIENT_SECRET,
        },
        isDevelopment: process.env.NODE_ENV !== 'production',
        swaggerBaseUrl: process.env.SWAGGER_BASE_URL ?? '/',
    }),
);
