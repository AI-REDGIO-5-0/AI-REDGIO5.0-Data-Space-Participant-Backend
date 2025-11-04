import { Module } from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderController } from './provider.controller';
import { ConfigurableModuleClass, } from './provider.module-definition';
import { HttpModule } from '@nestjs/axios';
import { MinioModule } from '../minio';
import { MetadataModule } from '../metadata';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Transactions } from '../consumer';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [HttpModule, MinioModule, MetadataModule, NestjsFormDataModule, MikroOrmModule.forFeature([Transactions]), ScheduleModule.forRoot()],
  controllers: [ProviderController],
  providers: [ProviderService],
  exports: [],
})
export class ProviderModule extends ConfigurableModuleClass {}
