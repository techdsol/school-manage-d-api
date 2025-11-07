import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateClassTypeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(5, { message: 'Code must not exceed 5 characters' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Type is required' })
  @IsString({ message: 'Type must be a string' })
  @MaxLength(50, { message: 'Type must not exceed 50 characters' })
  type: string;
}
