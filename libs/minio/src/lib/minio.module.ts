import { DynamicModule, Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigurableModuleClass } from './minio.module-definition';
import { Client } from 'minio';
import { HttpModule } from '@nestjs/axios';


export interface MinioModuleOptions {
    endPoint: string;
    port: number;
    accessKey: string;
    secretKey: string;
    useSSL?: boolean;
  }
  
  @Global()
  @Module({})
  export class MinioModule extends ConfigurableModuleClass {
    static forRoot(options: MinioModuleOptions): DynamicModule {
      const minioProvider = {
        provide: 'MINIO_CLIENT',
        useFactory: () => {
          console.log('🔗 Connecting to MinIO at', options.endPoint);
          return new Client({
            endPoint: options.endPoint || 'localhost',
            port: options.port || 9000,
            useSSL: options.useSSL || false,
            accessKey: options.accessKey,
            secretKey: options.secretKey,
          });
        },
      };
  
      return {
        module: MinioModule,
        imports:[HttpModule],
        providers: [minioProvider, MinioService],
        exports: [MinioService],
      };
    }
  }