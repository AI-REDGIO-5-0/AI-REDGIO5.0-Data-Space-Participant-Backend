import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUserInfoPipe implements PipeTransform {
    async transform(value: any) {
        return {
            id: value.sub,
            organizationId: value.organizationId[0].split('/')[1] || null,
            country: value.country,
            size: value.size,
            domain: value.domain,
            category: value.orgCategory,
        };
    }
}
