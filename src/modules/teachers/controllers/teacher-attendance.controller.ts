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
import { TeacherAttendanceService } from '../services/teacher-attendance.service';
import { CreateTeacherAttendanceDto } from '../dto/teacher-attendance/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from '../dto/teacher-attendance/update-teacher-attendance.dto';
import { BulkCreateTeacherAttendanceDto } from '../dto/teacher-attendance/bulk-create-teacher-attendance.dto';
import { QueryTeacherAttendanceDto } from '../dto/teacher-attendance/query-teacher-attendance.dto';
import { TeacherAttendance } from '../entities/teacher-attendance.entity';

@ApiTags('Teacher Attendance')
@Controller('teachers/attendance')
export class TeacherAttendanceController {
  constructor(private readonly teacherAttendanceService: TeacherAttendanceService) { }

  @Post()
  @ApiOperation({ summary: 'Mark attendance for a teacher' })
  @ApiResponse({
    status: 201,
    description: 'Attendance marked successfully',
    type: TeacherAttendance,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Teacher not found' })
  @ApiResponse({ status: 409, description: 'Attendance already marked for this date' })
  create(@Body() createTeacherAttendanceDto: CreateTeacherAttendanceDto) {
    return this.teacherAttendanceService.create(createTeacherAttendanceDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk mark attendance for multiple teachers' })
  @ApiResponse({
    status: 201,
    description: 'Bulk attendance marked successfully',
    type: [TeacherAttendance],
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'One or more teachers not found' })
  @ApiResponse({ status: 409, description: 'Attendance already exists for some teachers' })
  bulkCreate(@Body() bulkCreateTeacherAttendanceDto: BulkCreateTeacherAttendanceDto) {
    return this.teacherAttendanceService.bulkCreate(bulkCreateTeacherAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teacher attendance records with filters' })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
  })
  findAll(@Query() query: QueryTeacherAttendanceDto) {
    return this.teacherAttendanceService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get teacher attendance statistics' })
  @ApiQuery({ name: 'teacherId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({
    status: 200,
    description: 'Attendance statistics retrieved successfully',
  })
  getStats(
    @Query('teacherId') teacherId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.teacherAttendanceService.getAttendanceStats({
      teacherId,
      startDate,
      endDate,
    });
  }

  @Get('list-for-marking')
  @ApiOperation({ summary: 'Get all teachers with their attendance status for today' })
  @ApiQuery({ name: 'date', required: false, description: 'Date to check (YYYY-MM-DD), defaults to today' })
  @ApiResponse({
    status: 200,
    description: 'Teachers list with attendance status retrieved successfully',
  })
  getTeachersForAttendance(@Query('date') date?: string) {
    return this.teacherAttendanceService.getTeachersForAttendance(date);
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly attendance summary for a teacher' })
  @ApiQuery({ name: 'teacherId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({
    status: 200,
    description: 'Monthly attendance summary retrieved successfully',
  })
  getMonthly(
    @Query('teacherId') teacherId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.teacherAttendanceService.getMonthlyAttendance({
      teacherId,
      month: parseInt(month, 10),
      year: parseInt(year, 10),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get teacher attendance record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record retrieved successfully',
    type: TeacherAttendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id') id: string) {
    return this.teacherAttendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update teacher attendance record' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record updated successfully',
    type: TeacherAttendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(@Param('id') id: string, @Body() updateTeacherAttendanceDto: UpdateTeacherAttendanceDto) {
    return this.teacherAttendanceService.update(id, updateTeacherAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete teacher attendance record' })
  @ApiResponse({ status: 204, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(@Param('id') id: string) {
    return this.teacherAttendanceService.remove(id);
  }
}
