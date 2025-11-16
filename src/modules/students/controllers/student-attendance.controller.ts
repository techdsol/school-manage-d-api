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
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StudentAttendanceService } from '../services/student-attendance.service';
import { CreateStudentAttendanceDto } from '../dto/student-attendance/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from '../dto/student-attendance/update-student-attendance.dto';
import { BulkCreateStudentAttendanceDto } from '../dto/student-attendance/bulk-create-student-attendance.dto';
import { QueryStudentAttendanceDto } from '../dto/student-attendance/query-student-attendance.dto';
import { QueryAttendanceCompletionDto } from '../dto/student-attendance/query-attendance-completion.dto';
import { StudentAttendance } from '../entities/student-attendance.entity';

@ApiTags('Student Attendance')
@Controller('students/attendance')
export class StudentAttendanceController {
  constructor(private readonly studentAttendanceService: StudentAttendanceService) { }

  @Post()
  @ApiOperation({ summary: 'Mark attendance for a student' })
  @ApiResponse({
    status: 201,
    description: 'Attendance marked successfully',
    type: StudentAttendance,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Student assignment not found' })
  @ApiResponse({ status: 409, description: 'Attendance already marked for this date' })
  create(@Body() createStudentAttendanceDto: CreateStudentAttendanceDto) {
    return this.studentAttendanceService.create(createStudentAttendanceDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk mark attendance for multiple students' })
  @ApiResponse({
    status: 201,
    description: 'Bulk attendance marked successfully',
    type: [StudentAttendance],
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'One or more student assignments not found' })
  @ApiResponse({ status: 409, description: 'Attendance already exists for some students' })
  bulkCreate(@Body() bulkCreateStudentAttendanceDto: BulkCreateStudentAttendanceDto) {
    return this.studentAttendanceService.bulkCreate(bulkCreateStudentAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records with filters' })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
  })
  findAll(@Query() query: QueryStudentAttendanceDto) {
    return this.studentAttendanceService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get attendance statistics' })
  @ApiQuery({ name: 'classSectionCode', required: false })
  @ApiQuery({ name: 'studentId', required: false })
  @ApiQuery({ name: 'timetableId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({
    status: 200,
    description: 'Attendance statistics retrieved successfully',
  })
  getStats(
    @Query('classSectionCode') classSectionCode?: string,
    @Query('studentId') studentId?: string,
    @Query('timetableId') timetableId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.studentAttendanceService.getAttendanceStats({
      classSectionCode,
      studentId,
      timetableId,
      startDate,
      endDate,
    });
  }

  @Get('attendance-required-periods')
  @ApiOperation({ summary: 'Get timetable periods that require attendance' })
  @ApiQuery({ name: 'classSectionCode', required: false })
  @ApiQuery({ name: 'dayOfWeek', required: false })
  @ApiQuery({ name: 'academicYear', required: false })
  @ApiResponse({
    status: 200,
    description: 'Attendance-required periods retrieved successfully',
  })
  getAttendanceRequiredPeriods(
    @Query('classSectionCode') classSectionCode?: string,
    @Query('dayOfWeek') dayOfWeek?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.studentAttendanceService.getAttendanceRequiredPeriods({
      classSectionCode,
      dayOfWeek,
      academicYear,
    });
  }

  @Get('timetable/:timetableId/students')
  @ApiOperation({ summary: 'Get students enrolled in class for marking attendance' })
  @ApiQuery({ name: 'date', required: false, description: 'Date to check attendance status (YYYY-MM-DD)' })
  @ApiResponse({
    status: 200,
    description: 'Students list retrieved successfully with attendance status',
  })
  getStudentsForAttendance(
    @Param('timetableId') timetableId: string,
    @Query('date') date?: string,
  ) {
    return this.studentAttendanceService.getStudentsForAttendance(timetableId, date);
  }

  @Get('unmarked')
  @ApiOperation({ summary: 'Get unmarked attendance periods' })
  @ApiQuery({ name: 'date', required: false, description: 'Date to check (YYYY-MM-DD), defaults to today' })
  @ApiQuery({ name: 'classSectionCode', required: false })
  @ApiResponse({
    status: 200,
    description: 'Unmarked attendance periods retrieved successfully',
  })
  getUnmarkedAttendance(
    @Query('date') date?: string,
    @Query('classSectionCode') classSectionCode?: string,
  ) {
    return this.studentAttendanceService.getUnmarkedAttendance({ date, classSectionCode });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record retrieved successfully',
    type: StudentAttendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id') id: string) {
    return this.studentAttendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record updated successfully',
    type: StudentAttendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(@Param('id') id: string, @Body() updateStudentAttendanceDto: UpdateStudentAttendanceDto) {
    return this.studentAttendanceService.update(id, updateStudentAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiResponse({ status: 204, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(@Param('id') id: string) {
    return this.studentAttendanceService.remove(id);
  }

  @Get('completion-report')
  @ApiOperation({
    summary: 'Get attendance completion report for a date range',
    description: 'Shows which timetable periods have missing or incomplete attendance. Helps identify when teachers fail to mark attendance for entire class sections.'
  })
  @ApiResponse({
    status: 200,
    description: 'Attendance completion report generated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - invalid date range' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)', example: '2024-11-01' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)', example: '2024-11-07' })
  @ApiQuery({ name: 'classSectionCode', required: false, description: 'Filter by class section', example: '1A' })
  @ApiQuery({ name: 'academicYear', required: false, description: 'Filter by academic year', example: '2024-2025' })
  @ApiQuery({ name: 'minCompletionPercent', required: false, description: 'Show only sections below this completion %', example: 80 })
  getCompletionReport(@Query() query: QueryAttendanceCompletionDto) {
    return this.studentAttendanceService.getAttendanceCompletionReport(query);
  }
}
