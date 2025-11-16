import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateClassSectionDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(8, { message: 'Code must not exceed 8 characters' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Class code is required' })
  @IsString({ message: 'Class code must be a string' })
  @MaxLength(8, { message: 'Class code must not exceed 8 characters' })
  classCode: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString({ message: 'Section must be a string' })
  @MaxLength(10, { message: 'Section must not exceed 10 characters' })
  section?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Academic year code is required' })
  @IsString({ message: 'Academic year code must be a string' })
  @MaxLength(8, { message: 'Academic year code must not exceed 8 characters' })
  academicYearCode: string;
}
