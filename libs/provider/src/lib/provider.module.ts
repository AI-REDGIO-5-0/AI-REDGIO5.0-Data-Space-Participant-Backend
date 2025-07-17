import { DynamicModule, Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { ConfigurableModuleClass, PROVIDER_ASYNC_OPTIONS_TYPE, PROVIDER_OPTIONS_TYPE } from './provider.module-definition';
import { HttpModule } from '@nestjs/axios';
import { MinioModule } from '@ai-redgio/minio';
import { MetadataModule } from '@ai-redgio/metadata';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Transactions } from '@ai-redgio/consumer';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, MinioModule, MetadataModule, NestjsFormDataModule, MikroOrmModule.forFeature([Transactions]), ScheduleModule.forRoot()],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [],
})
export class ProviderModule extends ConfigurableModuleClass {
  static register(options: typeof PROVIDER_OPTIONS_TYPE): DynamicModule {
      return {
          // imports: [
          //     DataStorageModule.register({ url: options.dataStorageUrl }),
          //     BlockchainModule.register({ url: options.blockchainUrl }),
          //     MetadataRepositoryModule.register({ url: options.metadataRepositoryUrl }),
          // ],
          ...super.register(options),
      };
  }

  static registerAsync(asyncOptions: typeof PROVIDER_ASYNC_OPTIONS_TYPE): DynamicModule {
      const parent = super.registerAsync(asyncOptions);

      // parent.imports = [
      //     ...(parent.imports ?? []),
      //     DataStorageModule.registerAsync({
      //         imports: asyncOptions?.imports,
      //         inject: asyncOptions?.inject,
      //         useFactory: async (config: typeof asyncOptions.inject) => {
      //             const options: any = asyncOptions.useFactory ? await asyncOptions.useFactory(config) : {};

      //             return { url: options.dataStorageUrl };
      //         },
      //     }),
      //     BlockchainModule.registerAsync({
      //         imports: asyncOptions?.imports,
      //         inject: asyncOptions?.inject,
      //         useFactory: async (config: typeof asyncOptions.inject) => {
      //             const options: any = asyncOptions.useFactory ? await asyncOptions.useFactory(config) : {};

      //             return { url: options.blockchainUrl };
      //         },
      //     }),
      //     MetadataRepositoryModule.registerAsync({
      //         imports: asyncOptions?.imports,
      //         inject: asyncOptions?.inject,
      //         useFactory: async (config: typeof asyncOptions.inject) => {
      //             const options: any = asyncOptions.useFactory ? await asyncOptions.useFactory(config) : {};

      //             return { url: options.metadataRepositoryUrl };
      //         },
      //     }),
      // ];
      return { ...parent };
  }
}
