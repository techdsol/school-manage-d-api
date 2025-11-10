import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkSubjectItemDto {
  @ApiProperty({ description: 'Subject code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  subjectCode: string;
}

export class BulkCreateClassSubjectDto {
  @ApiProperty({ description: 'Class section code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  classSectionCode: string;

  @ApiProperty({ type: [BulkSubjectItemDto], description: 'Array of subjects to assign' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkSubjectItemDto)
  subjects: BulkSubjectItemDto[];
}
