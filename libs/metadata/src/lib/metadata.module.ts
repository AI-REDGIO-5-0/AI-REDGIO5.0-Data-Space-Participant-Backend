import { Module } from '@nestjs/common';
import { MetadataService } from './metadata.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Metadata } from './metadata.entity';
import { AccessPolicy } from './access-policy.entity';

@Module({
  imports:[MikroOrmModule.forFeature([Metadata, AccessPolicy])],
  controllers: [],
  providers: [MetadataService],
  exports: [MetadataService],
})
export class MetadataModule {}
