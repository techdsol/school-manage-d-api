import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { ClassTypesService } from '../services/class-types.service';
import { CreateClassTypeDto } from '../dto/create-class-type.dto';
import { UpdateClassTypeDto } from '../dto/update-class-type.dto';
import { ClassType } from '../entities/class-type.entity';

@ApiTags('Class Types')
@Controller('class-types')
export class ClassTypesController {
  constructor(private readonly classTypesService: ClassTypesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new class type' })
  @ApiBody({ type: CreateClassTypeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Class type created successfully',
    type: ClassType,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createClassTypeDto: CreateClassTypeDto): Promise<ClassType> {
    return this.classTypesService.create(createClassTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all class types',
    type: [ClassType],
  })
  findAll(): Promise<ClassType[]> {
    return this.classTypesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a class type by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class Type Code',
    example: 'PRI',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class type found',
    type: ClassType,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class type not found',
  })
  findOne(@Param('code') code: string): Promise<ClassType> {
    return this.classTypesService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update a class type by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class Type Code',
    example: 'PRI',
  })
  @ApiBody({ type: UpdateClassTypeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class type updated successfully',
    type: ClassType,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class type not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('code') code: string,
    @Body(ValidationPipe) updateClassTypeDto: UpdateClassTypeDto,
  ): Promise<ClassType> {
    return this.classTypesService.update(code, updateClassTypeDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a class type by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class Type Code',
    example: 'PRI',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Class type deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class type not found',
  })
  async remove(@Param('code') code: string): Promise<void> {
    await this.classTypesService.remove(code);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of class types' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of class types',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 5,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.classTypesService.count();
    return { count };
  }
}
