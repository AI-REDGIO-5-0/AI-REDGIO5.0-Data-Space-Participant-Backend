import { DynamicModule, Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Transactions } from './transactions.entity';
import { User } from '@ai-redgio/users';
import { Metadata, MetadataModule } from '@ai-redgio/metadata';
import {
  ConfigurableModuleClass,
  CONSUMER_ASYNC_OPTIONS_TYPE,
  CONSUMER_OPTIONS_TYPE,
} from './consumer.module-definition';
import { MinioModule } from '@ai-redgio/minio';


@Module({
  imports:[MikroOrmModule.forFeature([Transactions, User, Metadata]), HttpModule, MetadataModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
  exports: [],
})
export class ConsumerModule extends ConfigurableModuleClass {
  static register(options: typeof CONSUMER_OPTIONS_TYPE): DynamicModule {
      return {
          imports: [MinioModule.register({ minioUrl: options.minioUrl, minioAccessKey: options.minioAccessKey, minioSecretKey: options.minioSecretKey })],

          ...super.register(options),
      };
  }

  static registerAsync(asyncOptions: typeof CONSUMER_ASYNC_OPTIONS_TYPE): DynamicModule {
      const parent = super.registerAsync(asyncOptions);

      parent.imports = [
          ...(parent.imports ?? []),
          MinioModule.registerAsync({
              imports: asyncOptions?.imports,
              inject: asyncOptions?.inject,
              useFactory: async (config: typeof asyncOptions.inject) => {
                  const options: any = asyncOptions.useFactory ? await asyncOptions.useFactory(config) : {};

                  return { minioUrl: options.minioUrl, minioAccessKey: options.minioAccessKey, minioSecretKey: options.minioSecretKey };
              },
          }),
      ];

      return { ...parent };
  }
}
