import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, Logger } from '@nestjs/common';
import { Metadata } from './metadata.entity';
import { AccessPolicy } from './access-policy.entity';
import { truncateSync } from 'fs';

@Injectable()
export class MetadataService {
    private readonly logger = new Logger(MetadataService.name);

    constructor(@InjectRepository(Metadata) private readonly repo: EntityRepository<Metadata>,
    @InjectRepository(AccessPolicy) private readonly policiesRepo: EntityRepository<AccessPolicy>) { }

    async createMetadata(data: any) {
        const metadata = {
            assetId: data.assetId,
            dataType: data.dataType,
            version: data.version,
            title: data.title,
            description: data.description,
            keywords: data.keywords.length > 0 ? data.keywords :data.keywords.split(',').map((kw: any) => kw.trim().toLowerCase()),
            language: data.language,
            publisher: data.publisher,
            published: data.published,
            user: data.user,
            filesize: data.filesize,
            domain: data.domain,
            acquiredOn: data.acquiredOn,
            contractTerms: data.contractTerms,
            license: data.license || null,
            // price: data.price || null,
            fileExt: data.fileExt
        }
        await this.repo.create(metadata)
        return await this.repo.getEntityManager().flush()
    }

    async findMetadata(assetId: string) {
        const meta = await this.repo.findOneOrFail({ id: assetId });
        return meta;
    }

    async findByAssetId(id: string) {
        const meta = await this.repo.findOneOrFail({assetId: id});
        return meta;
    }

    async retrieve() {
        return await this.repo.find({acquiredOn: null});
    }

    async retrieveAcquired() {
        return await this.repo.find({acquiredOn: { $ne: null }});
    }

    async updateMetadata(data: any) {
        const metadata = await this.repo.findOneOrFail({id: data.id})
        this.repo.assign(metadata, data);
        return await this.repo.getEntityManager().flush();
    }

    async deleteMetadata(id: string){
        const metadata = await this.repo.findOneOrFail({id: id})
        return await this.repo.getEntityManager().removeAndFlush(metadata);
    }

    async retrievePolicies() {
        return await this.policiesRepo.findAll();
    }

    async retrievePolicy(id: string) {
        return await this.policiesRepo.findOneOrFail(id);
    }

    async createPolicy(data: any) {
        const policy = {
            title: data.title,
            description: data.description,
            default: data.default,
            scopes: data.scopes,
            groups: data.groups,
            countries: data.countries,
            sizes: data.sizes,
            domains: data.domains,
            trustLevel: data.trustLevel,
            categories: data.catagory
        }
        await this.policiesRepo.create(policy)
        return await this.policiesRepo.getEntityManager().flush()
    }

    async deletePolicy(id: string) {
        const policy = await this.policiesRepo.findOneOrFail({id: id})
        return await this.repo.getEntityManager().removeAndFlush(policy);
    }
}
