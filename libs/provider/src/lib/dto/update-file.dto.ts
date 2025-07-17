import { OmitType, PartialType } from "@nestjs/swagger";
import { UploadFileDto } from "./upload-file.dto";

export class UpdateFileDto extends OmitType(UploadFileDto, [
] as const) {}
