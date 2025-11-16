import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TeacherClassSubjectService } from '../services/teacher-class-subject.service';
import { CreateTeacherSpecializationDto } from '../dto/create-teacher-specialization.dto';
import { UpdateTeacherSpecializationDto } from '../dto/update-teacher-specialization.dto';
import { TeacherSpecialization } from '../entities/teacher-specialization.entity';

@ApiTags('Teacher Specializations')
@Controller('teacher-specializations')
export class TeacherClassSubjectController {
  constructor(private readonly teacherClassSubjectService: TeacherClassSubjectService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new teacher specialization' })
  @ApiResponse({
    status: 201,
    description: 'The teacher specialization has been successfully created.',
    type: TeacherSpecialization,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input or duplicate specialization.' })
  @ApiResponse({ status: 404, description: 'Teacher, Class, or Subject not found.' })
  create(@Body() createTeacherSpecializationDto: CreateTeacherSpecializationDto): Promise<TeacherSpecialization> {
    return this.teacherClassSubjectService.create(createTeacherSpecializationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teacher specializations' })
  @ApiResponse({
    status: 200,
    description: 'Return all teacher specializations.',
    type: [TeacherSpecialization],
  })
  findAll(): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectService.findAll();
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get teacher specializations by teacher ID' })
  @ApiParam({ name: 'teacherId', description: 'Teacher UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return specializations for the specified teacher.',
    type: [TeacherSpecialization],
  })
  findByTeacher(@Param('teacherId') teacherId: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectService.findByTeacher(teacherId);
  }

  @Get('class/:classCode')
  @ApiOperation({ summary: 'Get teacher specializations by class code' })
  @ApiParam({ name: 'classCode', description: 'Class code' })
  @ApiResponse({
    status: 200,
    description: 'Return specializations for the specified class.',
    type: [TeacherSpecialization],
  })
  findByClass(@Param('classCode') classCode: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectService.findByClass(classCode);
  }

  @Get('subject/:subjectCode')
  @ApiOperation({ summary: 'Get teacher specializations by subject code' })
  @ApiParam({ name: 'subjectCode', description: 'Subject code' })
  @ApiResponse({
    status: 200,
    description: 'Return specializations for the specified subject.',
    type: [TeacherSpecialization],
  })
  findBySubject(@Param('subjectCode') subjectCode: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectService.findBySubject(subjectCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher specialization by ID' })
  @ApiParam({ name: 'id', description: 'Specialization UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return the teacher specialization.',
    type: TeacherSpecialization,
  })
  @ApiResponse({ status: 404, description: 'Specialization not found.' })
  findOne(@Param('id') id: string): Promise<TeacherSpecialization> {
    return this.teacherClassSubjectService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher specialization' })
  @ApiParam({ name: 'id', description: 'Specialization UUID' })
  @ApiResponse({
    status: 200,
    description: 'The teacher specialization has been successfully updated.',
    type: TeacherSpecialization,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input or duplicate specialization.' })
  @ApiResponse({ status: 404, description: 'Specialization, Teacher, Class, or Subject not found.' })
  update(
    @Param('id') id: string,
    @Body() updateTeacherSpecializationDto: UpdateTeacherSpecializationDto,
  ): Promise<TeacherSpecialization> {
    return this.teacherClassSubjectService.update(id, updateTeacherSpecializationDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a teacher specialization' })
  @ApiParam({ name: 'id', description: 'Specialization UUID' })
  @ApiResponse({ status: 204, description: 'The teacher specialization has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Specialization not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.teacherClassSubjectService.remove(id);
  }
}
