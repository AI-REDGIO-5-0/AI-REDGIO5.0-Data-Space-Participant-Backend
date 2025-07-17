import { Inject, Injectable, Logger } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Transactions } from './transactions.entity';
import { HttpService } from '@nestjs/axios';
import { ConsumerModuleOptions } from './consumer-module-options.interface';
import { CONSUMER_MODULE_OPTIONS } from './consumer.module-definition';
import { MetadataService } from 'libs/metadata/src/lib/metadata.service';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { v4 as uuidV4 } from 'uuid';
import { MinioService } from 'libs/minio/src/lib/minio.service';

@Injectable()
export class ConsumerService {
    private readonly logger = new Logger(ConsumerService.name);

    constructor(
        private readonly httpService: HttpService,
        @InjectRepository(Transactions) private readonly repo: EntityRepository<Transactions>,
        @Inject(CONSUMER_MODULE_OPTIONS) private options: ConsumerModuleOptions,
        private readonly metadataService: MetadataService,
        private readonly minioService: MinioService
    ) { }

    async retrieveData(assetId: string, user: any, token: string, data: any) {
        const cloudMetadata = await firstValueFrom(
            this.httpService
                .get(`${this.options.cloudCatalogUrl}/api/cloud-catalog/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                })
                .pipe(
                    map(async (res) => {
                        return res.data;
                    }),
                    // Catch any error occurred during update
                    catchError((error) => {
                        this.logger.error('Metadata fetching from cloud error:', error);
                        return of({ error: 'Error fetching metadata' });
                    }),
                ),
        );

        const newMetadata = {
            assetId: uuidV4(),
            dataType: 'acquired',
            version: cloudMetadata.version,
            title: cloudMetadata.title,
            description: cloudMetadata.description,
            keywords: cloudMetadata.keywords,
            language: cloudMetadata.language,
            publisher: cloudMetadata.publisher,
            published: '',
            acquiredOn: new Date(),
            user: cloudMetadata.user,
            filesize: cloudMetadata.filesize,
            domain: cloudMetadata.manufacturingDomain,
            contractTerms: cloudMetadata.contractTerms,
            license: cloudMetadata.license,
            fileExt: cloudMetadata.fileExt,
            // price: cloudMetadata.price
        }
        const minioData = {
            presignedUrl: data.downloadUrl,
            fileName: data.title,
            bucket:'acquired'
        }
        const transaction = {
            version: cloudMetadata.version,
            seller: cloudMetadata.publisher,
            assetTitle: cloudMetadata.title,
            assetId: cloudMetadata.assetId,
            // price: cloudMetadata.price,
            sector: cloudMetadata.manufacturingDomain,
            transactionId: '',
            type: cloudMetadata.publisher === user.id ? 'Inbound' : 'Outbound'
        }
        try{
            await this.minioService.retrieveFile(minioData, cloudMetadata.fileExt)
            await this.metadataService.createMetadata(newMetadata);
            await this.repo.create(transaction)
            await this.repo.getEntityManager().flush();
        } catch(err){
            console.log(err)
            this.logger.error('Metadata creation error:', err);
        }
        
        return transaction;
        // const notification = {
        //     userId: user.id,
        //     organizationId: user.organizationId,
        //     type: 'asset_retrieved',
        //     message: 'Asset retrieval finished',
        // };
        // const tokenData = {
        //     grant_type: 'client_credentials',
        //     client_id: this.options.clientId,
        //     client_secret: this.options.secret
        // }
        // return await firstValueFrom(
        //     this.httpService
        //         .post(`${this.options.authServerUrl}/realms/PISTIS/protocol/openid-connect/token`, tokenData, {
        //             headers: {
        //                 'Content-Type': 'application/x-www-form-urlencoded',
        //             },
        //             data: JSON.stringify(tokenData)
        //         })
        //         .pipe(
        //             map(({ data }) => data.access_token),
        //             map((access_token) =>
        //                 this.httpService
        //                     .post(`${this.options.notificationsUrl}/srv/notifications/api/notifications`, notification, {
        //                         headers: getHeaders(access_token),
        //                     }).subscribe((value) => value)
        //             ),
        //             tap((response) => this.logger.debug(response)),
        //             map(() => of({ message: 'Notification created' })),
        //             // Catch any error occurred during the notification creation
        //             catchError((error) => {
        //                 this.logger.error('Error occurred during notification creation: ', error);
        //                 return of({ error: 'Error occurred during notification creation' });
        //             }),
        //         ),
        // );
    }

    async getTransactions(){
        return await this.repo.findAll();
    }

    async findTransaction( id: string){
        return await this.repo.findOneOrFail({id: id});
    }

    async getFile(fileName: string) {
        const url = await this.minioService.getCorrectUrl("acquired", fileName);
        return url
    }

    async getFileMinioMetadata(fileName: string) {
        const url = await this.minioService.getMetadata("acquired", fileName);
        return url
    }
}
