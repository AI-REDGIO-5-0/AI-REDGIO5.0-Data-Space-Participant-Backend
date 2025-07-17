import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ConsumerService } from './consumer.service';
import { MinioService } from 'libs/minio/src/lib/minio.service';
import { AuthToken, ParseUserInfoPipe } from "@ai-redgio/shared"
import { AuthenticatedUser } from 'nest-keycloak-connect';

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
    constructor(private readonly consumerService: ConsumerService, private readonly minioService: MinioService) { }

    @Post('/retrieve/:assetId')
    @ApiOkResponse({
        description: 'Consumer response',
        schema: { example: { asset_uuid: 'ae755a90-b7bc-4c28-bfc8-7a4fb247328b', message: 'Table created' } },
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
        return await this.consumerService.getTransactions()
    }

    @Get(':id')
    async findTransaction(
        @Param('id') id: string
    ){
        return await this.consumerService.findTransaction(id)
    }

    @Get('/download/:filename')
    async getFile(
        @Param('filename') filename: string
    ){
      return await this.consumerService.getFile(filename)
    }

    @Get('/metadata/:filename')
    async getFileMinioMetadata(
        @Param('filename') filename: string
    ){
      return await this.consumerService.getFileMinioMetadata(filename)
    }
}

