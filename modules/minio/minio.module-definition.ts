import { ConfigurableModuleBuilder } from '@nestjs/common';

import { MinioModuleOptions } from './minio-module-options.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<MinioModuleOptions>().build();