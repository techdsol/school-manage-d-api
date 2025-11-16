import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassSubjectService } from '../services/class-subject.service';
import { CreateClassSubjectDto } from '../dto/class-subject/create-class-subject.dto';
import { UpdateClassSubjectDto } from '../dto/class-subject/update-class-subject.dto';
import { BulkCreateClassSubjectDto } from '../dto/class-subject/bulk-create-class-subject.dto';
import { QueryClassSubjectDto } from '../dto/class-subject/query-class-subject.dto';
import { ClassSubject } from '../entities/class-subject.entity';

@ApiTags('Class Subjects')
@Controller('class-subjects')
export class ClassSubjectController {
  constructor(private readonly classSubjectService: ClassSubjectService) { }

  @Post()
  @ApiOperation({ summary: 'Assign a subject to a class section' })
  @ApiResponse({
    status: 201,
    description: 'Subject assigned to class section successfully',
    type: ClassSubject,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Class section or subject not found' })
  @ApiResponse({ status: 409, description: 'Subject already assigned to this class section' })
  create(@Body() createClassSubjectDto: CreateClassSubjectDto) {
    return this.classSubjectService.create(createClassSubjectDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Assign multiple subjects to a class section' })
  @ApiResponse({
    status: 201,
    description: 'Subjects assigned successfully',
    type: [ClassSubject],
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Class section or one or more subjects not found' })
  @ApiResponse({ status: 409, description: 'Some subjects are already assigned' })
  bulkCreate(@Body() bulkCreateClassSubjectDto: BulkCreateClassSubjectDto) {
    return this.classSubjectService.bulkCreate(bulkCreateClassSubjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class subject assignments with filters' })
  @ApiResponse({
    status: 200,
    description: 'Class subject assignments retrieved successfully',
  })
  findAll(@Query() query: QueryClassSubjectDto) {
    return this.classSubjectService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get class subject statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  getStats() {
    return this.classSubjectService.getStats();
  }

  @Get('class-section/:classSectionCode')
  @ApiOperation({ summary: 'Get all subjects for a class section' })
  @ApiResponse({
    status: 200,
    description: 'Subjects retrieved successfully',
    type: [ClassSubject],
  })
  @ApiResponse({ status: 404, description: 'Class section not found' })
  findByClassSection(@Param('classSectionCode') classSectionCode: string) {
    return this.classSubjectService.findByClassSection(classSectionCode);
  }

  @Get('subject/:subjectCode')
  @ApiOperation({ summary: 'Get all class sections teaching a specific subject' })
  @ApiResponse({
    status: 200,
    description: 'Class sections retrieved successfully',
    type: [ClassSubject],
  })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  findBySubject(@Param('subjectCode') subjectCode: string) {
    return this.classSubjectService.findBySubject(subjectCode);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get all class-subject assignments for a teacher' })
  @ApiResponse({
    status: 200,
    description: 'Teacher assignments retrieved successfully',
    type: [ClassSubject],
  })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  findByTeacher(@Param('teacherId') teacherId: string) {
    return this.classSubjectService.findByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class subject assignment by ID' })
  @ApiResponse({
    status: 200,
    description: 'Class subject assignment retrieved successfully',
    type: ClassSubject,
  })
  @ApiResponse({ status: 404, description: 'Class subject assignment not found' })
  findOne(@Param('id') id: string) {
    return this.classSubjectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class subject assignment' })
  @ApiResponse({
    status: 200,
    description: 'Class subject assignment updated successfully',
    type: ClassSubject,
  })
  @ApiResponse({ status: 404, description: 'Class subject assignment not found' })
  update(@Param('id') id: string, @Body() updateClassSubjectDto: UpdateClassSubjectDto) {
    return this.classSubjectService.update(id, updateClassSubjectDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete class subject assignment' })
  @ApiResponse({ status: 204, description: 'Class subject assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Class subject assignment not found' })
  remove(@Param('id') id: string) {
    return this.classSubjectService.remove(id);
  }
}
