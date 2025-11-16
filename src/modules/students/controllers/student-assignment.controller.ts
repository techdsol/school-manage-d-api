import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { StudentAssignmentService } from '../services/student-assignment.service';
import { CreateStudentAssignmentDto } from '../dto/create-student-assignment.dto';
import { UpdateStudentAssignmentDto } from '../dto/update-student-assignment.dto';
import { StudentAssignment } from '../entities/student-assignment.entity';

@ApiTags('student-assignments')
@Controller('student-assignments')
export class StudentAssignmentController {
  constructor(private readonly studentAssignmentService: StudentAssignmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student assignment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Student assignment has been successfully created.',
    type: StudentAssignment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or student already assigned to class section.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student or class section not found.',
  })
  create(@Body() createStudentAssignmentDto: CreateStudentAssignmentDto): Promise<StudentAssignment> {
    return this.studentAssignmentService.create(createStudentAssignmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student assignments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all student assignments.',
    type: [StudentAssignment],
  })
  findAll(): Promise<StudentAssignment[]> {
    return this.studentAssignmentService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active student assignments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of active student assignments.',
    type: [StudentAssignment],
  })
  findActiveAssignments(): Promise<StudentAssignment[]> {
    return this.studentAssignmentService.findActiveAssignments();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get student assignment statistics' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student assignment statistics.',
  })
  getStats(): Promise<any> {
    return this.studentAssignmentService.getAssignmentStats();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get assignments by student ID' })
  @ApiParam({
    name: 'studentId',
    type: 'string',
    description: 'Student UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of assignments for the student.',
    type: [StudentAssignment],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student not found.',
  })
  findByStudent(@Param('studentId', ParseUUIDPipe) studentId: string): Promise<StudentAssignment[]> {
    return this.studentAssignmentService.findByStudent(studentId);
  }

  @Get('class-section/:classSectionCode')
  @ApiOperation({ summary: 'Get assignments by class section code' })
  @ApiParam({
    name: 'classSectionCode',
    type: 'string',
    description: 'Class section code',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of assignments for the class section.',
    type: [StudentAssignment],
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Class section not found.',
  })
  findByClassSection(@Param('classSectionCode') classSectionCode: string): Promise<StudentAssignment[]> {
    return this.studentAssignmentService.findByClassSection(classSectionCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student assignment by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Student assignment UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student assignment details.',
    type: StudentAssignment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student assignment not found.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<StudentAssignment> {
    return this.studentAssignmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student assignment' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Student assignment UUID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Student assignment has been successfully updated.',
    type: StudentAssignment,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data or roll number already taken.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student assignment not found.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStudentAssignmentDto: UpdateStudentAssignmentDto,
  ): Promise<StudentAssignment> {
    return this.studentAssignmentService.update(id, updateStudentAssignmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student assignment' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Student assignment UUID',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Student assignment has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Student assignment not found.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.studentAssignmentService.remove(id);
  }
}
