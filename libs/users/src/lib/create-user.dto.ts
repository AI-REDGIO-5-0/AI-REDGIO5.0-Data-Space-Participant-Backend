import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';


export class CreateUserDto {
    @IsString()
    @ApiProperty()
    name!: string;

    @IsString()
    @ApiProperty()
    surname!: string;

    @IsString()
    @ApiProperty()
    orgName!: string;

    @IsString()
    @ApiProperty()
    orgAddress!: string;

    @IsString()
    @ApiProperty()
    orgCountry!: string;

    @IsArray()
    @ApiProperty()
    manufacturingSector!: [string];

    @IsString()
    @ApiProperty()
    orgSize!: string;

    @IsString()
    @ApiProperty()
    profitOperation!: string;

    @IsString()
    @ApiProperty()
    ownership!: number;

    @IsString()
    @ApiProperty()
    geoScope!: string;

    @IsString()
    @ApiProperty()
    participantHash!: string;

    @IsString()
    @ApiProperty()
    participantUrl!: string;
}