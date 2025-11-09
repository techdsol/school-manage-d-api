import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateGradeDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Code is required' })
  @IsString({ message: 'Code must be a string' })
  @MaxLength(10, { message: 'Code must not exceed 10 characters' })
  code: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name must not exceed 50 characters' })
  name: string;
}
