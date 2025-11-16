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
import { ClassSectionsService } from '../services/class-sections.service';
import { CreateClassSectionDto } from '../dto/create-class-section.dto';
import { UpdateClassSectionDto } from '../dto/update-class-section.dto';
import { ClassSection } from '../entities/class-section.entity';

@ApiTags('Class Sections')
@Controller('class-sections')
export class ClassSectionsController {
  constructor(private readonly classSectionsService: ClassSectionsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new class section' })
  @ApiBody({ type: CreateClassSectionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Class section created successfully',
    type: ClassSection,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createClassSectionDto: CreateClassSectionDto): Promise<ClassSection> {
    return this.classSectionsService.create(createClassSectionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class sections' })
  @ApiQuery({
    name: 'classCode',
    required: false,
    type: 'string',
    description: 'Filter class sections by class code',
    example: 'CLS001',
  })
  @ApiQuery({
    name: 'academicYearCode',
    required: false,
    type: 'string',
    description: 'Filter class sections by academic year code',
    example: 'AY2024',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all class sections',
    type: [ClassSection],
  })
  findAll(
    @Query('classCode') classCode?: string,
    @Query('academicYearCode') academicYearCode?: string,
  ): Promise<ClassSection[]> {
    if (classCode) {
      return this.classSectionsService.findByClass(classCode);
    }
    if (academicYearCode) {
      return this.classSectionsService.findByAcademicYear(academicYearCode);
    }
    return this.classSectionsService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a class section by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class section code',
    example: 'CS001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class section found',
    type: ClassSection,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class section not found',
  })
  findOne(@Param('code') code: string): Promise<ClassSection> {
    return this.classSectionsService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update a class section by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class section code',
    example: 'CS001',
  })
  @ApiBody({ type: UpdateClassSectionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Class section updated successfully',
    type: ClassSection,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class section not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('code') code: string,
    @Body(ValidationPipe) updateClassSectionDto: UpdateClassSectionDto,
  ): Promise<ClassSection> {
    return this.classSectionsService.update(code, updateClassSectionDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a class section by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Class section code',
    example: 'CS001',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Class section deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class section not found',
  })
  async remove(@Param('code') code: string): Promise<void> {
    await this.classSectionsService.remove(code);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of class sections' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of class sections',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 25,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.classSectionsService.count();
    return { count };
  }
}
