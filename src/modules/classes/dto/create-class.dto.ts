import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClassDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(8, { message: 'Code must not exceed 8 characters' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Class type code is required' })
  @IsString({ message: 'Class type code must be a string' })
  @MaxLength(5, { message: 'Class type code must not exceed 5 characters' })
  classTypeCode: string;
}
