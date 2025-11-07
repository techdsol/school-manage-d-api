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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ClassesService } from '../services/classes.service';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';
import { Class } from '../entities/class.entity';

@ApiTags('Classes')
@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new class' })
  @ApiBody({ type: CreateClassDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Class created successfully',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createClassDto: CreateClassDto): Promise<Class> {
    return this.classesService.create(createClassDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  @ApiQuery({
    name: 'classTypeCode',
    required: false,
    type: 'string',
    description: 'Filter classes by class type code',
    example: 'PRI',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all classes',
    type: [Class],
  })
  findAll(@Query('classTypeCode') classTypeCode?: string): Promise<Class[]> {
    if (classTypeCode) {
      return this.classesService.findByType(classTypeCode);
    }
    return this.classesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a class by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Class UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class found',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  findOne(@Param('id') id: string): Promise<Class> {
    return this.classesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Class UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateClassDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class updated successfully',
    type: Class,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateClassDto: UpdateClassDto,
  ): Promise<Class> {
    return this.classesService.update(id, updateClassDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a class by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Class UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Class deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.classesService.remove(id);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of classes' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of classes',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 15,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.classesService.count();
    return { count };
  }
}
