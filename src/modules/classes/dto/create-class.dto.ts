import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Section is required' })
  @IsString({ message: 'Section must be a string' })
  @MaxLength(10, { message: 'Section must not exceed 10 characters' })
  section: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Class type code is required' })
  @IsString({ message: 'Class type code must be a string' })
  @MaxLength(5, { message: 'Class type code must not exceed 5 characters' })
  classTypeCode: string;
}
