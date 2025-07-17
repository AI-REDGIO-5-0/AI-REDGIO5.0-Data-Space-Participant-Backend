import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { FormDataRequest } from 'nestjs-form-data';
import { ProviderService } from './provider.service';
import { UpdateFileDto } from './dto/update-file.dto';
import { UploadFileDto } from './dto/upload-file.dto';
import { AuthToken, ParseUserInfoPipe } from "@ai-redgio/shared"
import { AuthenticatedUser } from 'nest-keycloak-connect';
@Controller('provider')
@ApiTags('provider')
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
export class ProviderController {
    constructor(private readonly providerService: ProviderService) { }

    @Post('/policy')
    async createPolicy(@Body() data: any){
        return await this.providerService.createPolicy(data)
    }

    @Post()
    @FormDataRequest()
    async uploadDataset(
        @Body() data: any,
    ){
        return await this.providerService.uploadDataset(data);
    }

    @Put(":id")
    @FormDataRequest()
    async updateDataset(
        @Param('id') id: string,
        @Body() data: any,
        @AuthToken() token: string,
    ){
        return await this.providerService.updateDataset(id, data, token);
    }

    @Get('/data')
    async retrieveDatasets(@AuthenticatedUser(new ParseUserInfoPipe()) user: any){
        console.log('user', user);
        return await this.providerService.retrieve();
    }

    @Get('/acquired')
    async retrieveAcquiredDatasets(){
        return await this.providerService.retrieveAcquired();
    }

    @Get('/policies')
    async retrievePolicies() {
        return await this.providerService.retrievePolicies()
    }

    @Get(':id')
    async retrieveDataset(
        @Param('id') id: string
    ){
        return await this.providerService.retrieveDataset(id);
    }

    @Post('/publish/:id')
    async publishDataset(
        @Param('id') id: string,
        @Body() data: any,
        @AuthToken() token: string,
    ){
        return await this.providerService.publish(id, data, token);
    }

    @Delete(':id')
    async deleteDataset(
        @Param('id') id: string
    ){
        return await this.providerService.deleteDataset(id);
    }

    @Delete('/policy/:id')
    async deletePolicy(
        @Param('id') id: string
    ){
        console.log('Hrtha edw')
        return await this.providerService.deletePolicy(id);
    }

    @Get('/policy/:id')
    async retrievePolicy(@Param('id') id: string) {
        return await this.providerService.retrievePolicy(id)
    }

}
