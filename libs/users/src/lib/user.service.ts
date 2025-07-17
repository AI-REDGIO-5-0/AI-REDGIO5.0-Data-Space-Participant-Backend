import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './user.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);

    constructor(
        // private readonly httpService: HttpService,
        @InjectRepository(User) private readonly repo: EntityRepository<User>,
    ) { }

    async register(userData: any){
        const user: CreateUserDto = {
            name: userData.name,
            surname: userData.surname,
            orgName: userData.orgName,
            orgAddress: userData.orgAddress,
            orgCountry: userData.orgCountry,
            manufacturingSector: userData.manufacturingSector,
            orgSize: userData.orgSize,
            profitOperation: userData.profitOperation,
            ownership: userData.ownership,
            geoScope: userData.geoScope,
            participantHash: userData.participantHash,
            participantUrl: userData.participantUrl,
        }
        await this.repo.create(user)
        return await this.repo.getEntityManager().flush()
    }

    async deleteUser(id: string){
        const user = await this.repo.findOneOrFail({id: id});
        return await this.repo.getEntityManager().removeAndFlush(user)
    }

    async retrieveUser(id: string){
        return await this.repo.findOneOrFail({id: id});
    }
}
