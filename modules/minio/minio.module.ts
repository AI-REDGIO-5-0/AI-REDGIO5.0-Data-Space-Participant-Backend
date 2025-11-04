import { DynamicModule, Global, Module } from '@nestjs/common';
import { MinioService } from './minio.service';
import { ConfigurableModuleClass } from './minio.module-definition';
import * as Minio from 'minio';
import { HttpModule } from '@nestjs/axios';


export interface MinioModuleOptions {
    endPoint: string;
    port: number;
    accessKey: string;
    secretKey: string;
    useSSL: boolean;
  }
  
  @Global()
  @Module({})
  export class MinioModule extends ConfigurableModuleClass {
    static forRoot(options: MinioModuleOptions): DynamicModule {
      const minioProvider = {
        provide: 'MINIO_CLIENT',
        useFactory: () => {
          return new Minio.Client({
            endPoint: options.endPoint,
            port: options.port,
            useSSL: options.useSSL,
            accessKey: options.accessKey,
            secretKey: options.secretKey,
            pathStyle: true,
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