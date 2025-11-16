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
import { SubjectsService } from '../services/subjects.service';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';
import { Subject } from '../entities/subject.entity';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new subject' })
  @ApiBody({ type: CreateSubjectDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Subject created successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all subjects',
    type: [Subject],
  })
  findAll(): Promise<Subject[]> {
    return this.subjectsService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a subject by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Subject Code',
    example: 'MATH001',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject found',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  findOne(@Param('code') code: string): Promise<Subject> {
    return this.subjectsService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update a subject by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Subject Code',
    example: 'MATH001',
  })
  @ApiBody({ type: UpdateSubjectDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Subject updated successfully',
    type: Subject,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('code') code: string,
    @Body(ValidationPipe) updateSubjectDto: UpdateSubjectDto,
  ): Promise<Subject> {
    return this.subjectsService.update(code, updateSubjectDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a subject by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Subject Code',
    example: 'MATH001',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Subject deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Subject not found',
  })
  async remove(@Param('code') code: string): Promise<void> {
    await this.subjectsService.remove(code);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of subjects' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of subjects',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 10,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.subjectsService.count();
    return { count };
  }
}
