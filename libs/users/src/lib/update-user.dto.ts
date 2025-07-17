import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @ApiProperty()
    name!: string;

    @IsOptional()
    @ApiProperty()
    surname!: string;

    @IsOptional()
    @ApiProperty()
    orgName!: string;

    @IsOptional()
    @ApiProperty()
    orgAddress!: string;

    @IsOptional()
    @ApiProperty()
    orgCountry!: string;

    @IsOptional()
    @ApiProperty()
    manufacturingSector!: [string];

    @IsOptional()
    @ApiProperty()
    orgSize!: string;

    @IsOptional()
    @ApiProperty()
    profitOperation!: string;

    @IsOptional()
    @ApiProperty()
    ownership!: number;

    @IsOptional()
    @ApiProperty()
    geoScope!: string;

    @IsOptional()
    @ApiProperty()
    participantHash!: string;

    @IsOptional()
    @ApiProperty()
    participantUrl!: string;
}