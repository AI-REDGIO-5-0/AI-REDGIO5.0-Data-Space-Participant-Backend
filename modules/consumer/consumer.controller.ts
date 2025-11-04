import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';
import { MinioService } from '../minio';
import { AuthToken } from '../../src/decorators';
import { ParseUserInfoPipe } from '../../src/pipes';
import { AuthenticatedUser } from 'nest-keycloak-connect';
import type { Response } from 'express';
import { Public } from 'nest-keycloak-connect';
import type {ConsumerModuleOptions} from './consumer-module-options.interface';
import { CONSUMER_MODULE_OPTIONS } from './consumer.module-definition';

@Controller('consumer')
@ApiTags('consumer')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'Unauthorized.',
  schema: {
    example: {
      message: 'Unauthorized',
      status: 401,
    },
  },
})
@ApiNotFoundResponse({
  description: 'NotFound.',
  schema: {
    example: {
      message: 'NotFound',
      status: 404,
    },
  },
})
export class ConsumerController {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly minioService: MinioService,
    @Inject(CONSUMER_MODULE_OPTIONS) private options: ConsumerModuleOptions,
  ) {}

  @Post('/retrieve/:assetId')
  @ApiOkResponse({
    description: 'Consumer response',
    schema: {
      example: {
        asset_uuid: 'ae755a90-b7bc-4c28-bfc8-7a4fb247328b',
        message: 'Table created',
      },
    },
  })
  async retrieveData(
    @AuthenticatedUser(new ParseUserInfoPipe()) user: any,
    @Param('assetId') assetId: string,
    @Body() data: any,
    @AuthToken() token: string,
  ) {
    return await this.consumerService.retrieveData(assetId, user, token, data);
  }

  @Get()
  async getTransactions() {
    return await this.consumerService.getTransactions();
  }

  @Get(':id')
  async findTransaction(@Param('id') id: string) {
    return await this.consumerService.findTransaction(id);
  }

  @Get('/download/:filename')
  async getFile(@Param('filename') filename: string, @Query() query: any) {
    return await this.consumerService.getFile(filename, query);
  }

  @Get('/metadata/:assetId')
  async getFileMinioMetadata(@Param('assetId') assetId: string) {
    return await this.consumerService.getFileMinioMetadata(assetId);
  }

  @Get('download-file/:assetId')
  @Public()
  async download(
    @Param('assetId') assetId: string,
    @Res({ passthrough: true }) res: Response, // Use passthrough: true to return StreamableFile
  ): Promise<StreamableFile> {
    const objectName = await this.consumerService.downlaodFile(assetId);
    const { stream, metaData } = await this.minioService.downloadFile(
      objectName.title,
      this.options.bucketName,
    );
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${objectName.title}.${objectName.ext}"`,
    );

    return new StreamableFile(stream);
  }
}
