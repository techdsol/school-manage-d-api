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
import { StudentEnrollmentService } from '../services/student-enrollment.service';
import { CreateStudentEnrollmentDto } from '../dto/create-student-enrollment.dto';
import { UpdateStudentEnrollmentDto } from '../dto/update-student-enrollment.dto';
import { StudentEnrollment } from '../entities/student-enrollment.entity';

@ApiTags('student-enrollments')
@Controller('student-enrollments')
export class StudentEnrollmentController {
  constructor(private readonly studentEnrollmentService: StudentEnrollmentService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enroll a student in a class section' })
  @ApiResponse({
    status: 201,
    description: 'Student enrollment created successfully',
    type: StudentEnrollment,
  })
  @ApiResponse({
    status: 409,
    description: 'Student already enrolled or roll number taken',
  })
  create(@Body() createStudentEnrollmentDto: CreateStudentEnrollmentDto): Promise<StudentEnrollment> {
    return this.studentEnrollmentService.create(createStudentEnrollmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student enrollments' })
  @ApiQuery({ name: 'status', required: false, description: 'Filter by enrollment status' })
  @ApiResponse({
    status: 200,
    description: 'List of student enrollments',
    type: [StudentEnrollment],
  })
  async findAll(@Query('status') status?: string): Promise<StudentEnrollment[]> {
    if (status === 'active') {
      return this.studentEnrollmentService.findActiveEnrollments();
    }
    return this.studentEnrollmentService.findAll();
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get all enrollments for a specific student' })
  @ApiParam({ name: 'studentId', description: 'Student ID' })
  @ApiResponse({
    status: 200,
    description: 'Student enrollments found',
    type: [StudentEnrollment],
  })
  findByStudent(@Param('studentId') studentId: string): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentService.findByStudent(studentId);
  }

  @Get('class-section/:classSectionCode')
  @ApiOperation({ summary: 'Get all enrollments for a specific class section' })
  @ApiParam({ name: 'classSectionCode', description: 'Class section code' })
  @ApiResponse({
    status: 200,
    description: 'Class section enrollments found',
    type: [StudentEnrollment],
  })
  findByClassSection(@Param('classSectionCode') classSectionCode: string): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentService.findByClassSection(classSectionCode);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total enrollment count' })
  @ApiResponse({
    status: 200,
    description: 'Total enrollment count',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        active: { type: 'number' },
      },
    },
  })
  async getCount(): Promise<{ total: number; active: number }> {
    const [total, active] = await Promise.all([
      this.studentEnrollmentService.getEnrollmentCount(),
      this.studentEnrollmentService.getActiveEnrollmentCount(),
    ]);
    return { total, active };
  }

  @Get('class-section/:classSectionCode/count')
  @ApiOperation({ summary: 'Get enrollment count for a specific class section' })
  @ApiParam({ name: 'classSectionCode', description: 'Class section code' })
  @ApiResponse({
    status: 200,
    description: 'Class section enrollment count',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
      },
    },
  })
  async getClassSectionCount(@Param('classSectionCode') classSectionCode: string): Promise<{ count: number }> {
    const count = await this.studentEnrollmentService.getEnrollmentCountByClassSection(classSectionCode);
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a student enrollment by ID' })
  @ApiParam({ name: 'id', description: 'Student enrollment ID' })
  @ApiResponse({
    status: 200,
    description: 'Student enrollment found',
    type: StudentEnrollment,
  })
  @ApiResponse({
    status: 404,
    description: 'Student enrollment not found',
  })
  findOne(@Param('id') id: string): Promise<StudentEnrollment> {
    return this.studentEnrollmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a student enrollment' })
  @ApiParam({ name: 'id', description: 'Student enrollment ID' })
  @ApiResponse({
    status: 200,
    description: 'Student enrollment updated successfully',
    type: StudentEnrollment,
  })
  @ApiResponse({
    status: 404,
    description: 'Student enrollment not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Roll number already taken',
  })
  update(
    @Param('id') id: string,
    @Body() updateStudentEnrollmentDto: UpdateStudentEnrollmentDto,
  ): Promise<StudentEnrollment> {
    return this.studentEnrollmentService.update(id, updateStudentEnrollmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a student enrollment' })
  @ApiParam({ name: 'id', description: 'Student enrollment ID' })
  @ApiResponse({
    status: 204,
    description: 'Student enrollment deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Student enrollment not found',
  })
  remove(@Param('id') id: string): Promise<void> {
    return this.studentEnrollmentService.remove(id);
  }
}
