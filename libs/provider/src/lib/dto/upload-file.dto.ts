import { ApiProperty } from '@nestjs/swagger';
// import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsDateString,
    IsNotEmpty,
    // IsInt,
    IsNumber,
    IsString,
    // ValidateNested,
} from 'class-validator';

export class UploadFileDto {

    @IsString()
    @ApiProperty()
    assetId!: string;

    @IsString()
    @ApiProperty()
    version!: string;

    @IsString()
    @ApiProperty()
    title!: string;

    @IsString()
    @ApiProperty()
    description!: string;

    @IsString()
    @ApiProperty()
    keywords!: string;

    @IsString()
    @ApiProperty()
    language!: string;

    @IsString()
    @ApiProperty()
    publisher!: string;

    // @IsString()
    // @ApiProperty()
    // filesize!: number;

    @IsString()
    @ApiProperty()
    domain!: string;

    @IsNotEmpty()
    @ApiProperty()
    data!: Buffer;

    @IsBoolean()
    @ApiProperty()
    published!: boolean;

    @IsString()
    @ApiProperty()
    user!: string;
}