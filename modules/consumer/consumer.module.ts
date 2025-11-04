import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { HttpModule } from '@nestjs/axios';
import { Transactions } from './transactions.entity';
import { Metadata, MetadataModule } from '../metadata';
import {
  ConfigurableModuleClass,
} from './consumer.module-definition'


@Module({
  imports:[MikroOrmModule.forFeature([Transactions, Metadata]), HttpModule, MetadataModule],
  controllers: [ConsumerController],
  providers: [ConsumerService],
  exports: [],
})
export class ConsumerModule extends ConfigurableModuleClass {}
