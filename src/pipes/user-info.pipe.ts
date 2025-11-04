import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseUserInfoPipe implements PipeTransform {
  async transform(value: any) {
    return {
      id: value.sub,
      organizationId: value.organizationId,
      country: value.country,
      size: value.size,
      domain: value.domain,
      category: value.orgCategory,
    };
  }
}
