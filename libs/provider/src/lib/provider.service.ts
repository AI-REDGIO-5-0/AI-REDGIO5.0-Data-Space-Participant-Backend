import { Inject, Injectable, Logger } from '@nestjs/common';
import { MetadataService } from 'libs/metadata/src/lib/metadata.service';
import { MinioService } from 'libs/minio/src/lib/minio.service';
import { UploadFileDto } from './dto/upload-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { catchError, firstValueFrom, map, of } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { PROVIDER_MODULE_OPTIONS } from './provider.module-definition';
import { ProviderModuleOptions } from './provider-module-options.interface';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Transactions } from '@ai-redgio/consumer';
import { EntityRepository } from '@mikro-orm/core';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ProviderService {
    private readonly logger = new Logger(ProviderService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly minioService: MinioService,
        private readonly metadataService: MetadataService,
        @Inject(PROVIDER_MODULE_OPTIONS) private options: ProviderModuleOptions,
        @InjectRepository(Transactions) private readonly repo: EntityRepository<Transactions>,
    ) { }


    async uploadDataset(file: any) {
        const fileType = file.type.split('/')[1]
        await this.minioService.uploadFile(file.data.buffer, file.title, 'test1', file.data.busBoyMimeType, fileType, file.assetId)
        const metadata = {
            assetId: file.assetId,
            dataType: 'myData',
            version: "1",
            title: file.title,
            description: file.description,
            keywords: [file.keywords],
            language: file.language,
            publisher: file.publisher,
            published: false,
            filesize: Number((file.data.size / (1024 * 1024)).toFixed(4)),
            domain: file.domain,
            acquiredOn: file.acquiredOn || null,
            fileExt: fileType,
            contractTerms: file.contractTerms,
        }
        await this.metadataService.createMetadata(metadata)
        return `Asset ${file.title} saved successfully`
    }

    async updateDataset(id: string, file: any, token:string) {
        let version;
        let fileType;
        if (file.type) {
            fileType = file.type.split('/')[1]
        }
        const metadata = await this.metadataService.findByAssetId(id)
        if (metadata.published) {
            try {
                await this.updatePublishedMetadata(metadata, file, token)
            } catch (err) {
                this.logger.error('Error while updating published metadata:', err);
                throw new Error('Error while updating published metadata');
            }
            return;
        }
        if (file.data.buffer) {
            await this.minioService.updateFile(file.data.buffer, file.title, 'test1', file.data.busBoyMimeType, fileType)
            version = Number.parseInt(metadata.version) + 1
        } else {
            version = Number.parseFloat(metadata.version) + 0.1
        }

        console.log(version)
        metadata.version = version.toString();
        console.log(metadata.version, 'version')
        metadata.title = file.title
        metadata.acquiredOn = file.acquiredOn
        metadata.contractTerms = file.contractTerms
        metadata.description = file.description
        metadata.keywords = [file.keywords]
        metadata.language = file.language
        metadata.published = file.published === 'true'
        metadata.publisher = file.publisher
        // metadata.price = file.price
        metadata.domain = file.domain
        metadata.license = file.license
        metadata.user = file.user
        metadata.filesize = file.data.size ? Number((file.data.size / (1024 * 1024)).toFixed(4)) : metadata.filesize
        metadata.fileExt = fileType || metadata.fileExt
        metadata.updatedAt = new Date();

        return await this.metadataService.updateMetadata(metadata);

    }

    async deleteDataset(id: any) {
        return await this.metadataService.deleteMetadata(id);
    }

    private async updatePublishedMetadata(metadata: any, data: any, token:string) {
        const datasetURL = await this.minioService.getFileUrl(metadata.title, 'test1');
        try {
            return await firstValueFrom(
                this.httpService
                    .put(
                        `${this.options.cloudCatalogUrl}/api/cloud-catalog/${metadata.assetId}`,
                        {
                            assetId: metadata.assetId,
                            version: metadata.version,
                            title: metadata.title,
                            description: metadata.description,
                            keywords: data.keywords,
                            language: metadata.language,
                            publisher: metadata.publisher,
                            filesize: metadata.filesize,
                            manufacturingDomain: metadata.domain,
                            downloadUrl: datasetURL,
                            contractTerms: { startDate: data.startDate, termDate: data.termDate },
                            accessPolicy: data.accessPolicies,
                            license: data.license,
                            // price: data.price,
                            fileExt: metadata.fileExt
                        },
                        {
                            headers: {
                                Accept: 'application/json',
                                'content-type': 'application/json',
                                Authorization: `Bearer ${token}`
                            }
                        },
                    )
                    .pipe(
                        //If not an error from call admin receive the message below
                        map(async (res) => {
                            return res.data;
                        }),
                        // Catch any error occurred during the contract validation
                        catchError((error) => {
                            this.logger.error('Publish dataset error:', error);
                            return of({ error: 'Error occurred while publishing dataset' });
                        }),
                    ),
            );
        } catch (err) {
            this.logger.error('Error while updating published metadata:', err);
            throw new Error('Error while updating published metadata');
        }

    }

    async publish(id: any, data: any, token:string) {
        const metadata = await this.metadataService.findMetadata(data.originalAssetId);
        const datasetURL = await this.minioService.getFileUrl(metadata.title, 'test1');
        metadata.published = true;
        // metadata.price = data.price.toString()

        metadata.contractTerms = data.contractTerms
        await this.metadataService.updateMetadata(metadata);

        return await firstValueFrom(
            this.httpService
                .post(
                    `${this.options.cloudCatalogUrl}/api/cloud-catalog`,
                    {
                        assetId: metadata.assetId,
                        version: metadata.version,
                        title: data.title,
                        description: metadata.description,
                        keywords: data.keywords,
                        language: metadata.language,
                        publisher: metadata.publisher,
                        filesize: metadata.filesize,
                        manufacturingDomain: metadata.domain,
                        downloadUrl: datasetURL,
                        contractTerms: { startDate: data.startDate, termDate: data.termDate },
                        accessPolicy: data.accessPolicies,
                        license: data.license,
                        // price: data.price,
                        fileExt: metadata.fileExt
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                            'content-type': 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    },
                )
                .pipe(
                    //If not an error from call admin receive the message below
                    map(async (res) => {
                        return res.data;
                    }),
                    // Catch any error occurred during the contract validation
                    catchError((error) => {
                        this.logger.error('Publish dataset error:', error);
                        return of({ error: 'Error occurred while publishing dataset' });
                    }),
                ),
        );
    }

    async retrieve() {
        return await this.metadataService.retrieve()
    }

    async retrieveAcquired() {
        return await this.metadataService.retrieveAcquired()
    }

    async retrieveDataset(id: string) {
        const metadata = await this.metadataService.findMetadata(id)
        return await this.metadataService.findMetadata(id)
    }

    async retrievePolicy(id: string) {
        return await this.metadataService.retrievePolicy(id)
    }

    async retrievePolicies() {
        return await this.metadataService.retrievePolicies()
    }

    async createPolicy(data: any) {
        return await this.metadataService.createPolicy(data)
    }

    async deletePolicy(id: string) {
        return await this.metadataService.deletePolicy(id)
    }

    // @Cron('* * * * *')
    async findTransactions() {
        this.logger.log('Fetching transactions...');

        // Fork the EntityManager from the repository
        const transactionRepo = this.repo.getEntityManager().fork();
      
        const transactions = await firstValueFrom(
          this.httpService
            .get(`${this.options.cloudCatalogUrl}/api/cloud-catalog/transaction/${this.options.userId}`, {
              headers: {
                Accept: 'application/json',
                'content-type': 'application/json',
              }
            })
            .pipe(
              map(res => res.data),
              catchError((error) => {
                this.logger.error('Transaction retrieval error:', error);
                return of([]); // Return empty array if error occurs
              }),
            )
        );
      
        for (let i =0; i < transactions.length; i++) {
          if (transactions[i].buyer !== this.options.userId) {
            const existing = await transactionRepo.findOne(Transactions, { transactionId: transactions[i].id });
            if (!existing) {
              const transaction = transactionRepo.create(Transactions, {
                version: transactions[i].version,
                seller: transactions[i].seller,
                assetTitle: transactions[i].assetTitle,
                assetId: transactions[i].assetId,
                price: null as any,
                sector: transactions[i].sector,
                transactionId: transactions[i].id,
                type: 'Inbound'
              });
      
              await transactionRepo.persistAndFlush(transaction);
            }
          }
        }
    }
}
