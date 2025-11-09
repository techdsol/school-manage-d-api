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
import { AttendanceService } from '../services/attendance.service';
import { CreateAttendanceDto } from '../dto/attendance/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/attendance/update-attendance.dto';
import { BulkCreateAttendanceDto } from '../dto/attendance/bulk-create-attendance.dto';
import { QueryAttendanceDto } from '../dto/attendance/query-attendance.dto';
import { Attendance } from '../entities/attendance.entity';

@ApiTags('Attendance')
@Controller('students/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  @ApiOperation({ summary: 'Mark attendance for a student' })
  @ApiResponse({
    status: 201,
    description: 'Attendance marked successfully',
    type: Attendance,
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'Student assignment not found' })
  @ApiResponse({ status: 409, description: 'Attendance already marked for this date' })
  create(@Body() createAttendanceDto: CreateAttendanceDto) {
    return this.attendanceService.create(createAttendanceDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk mark attendance for multiple students' })
  @ApiResponse({
    status: 201,
    description: 'Bulk attendance marked successfully',
    type: [Attendance],
  })
  @ApiResponse({ status: 400, description: 'Bad request - validation error' })
  @ApiResponse({ status: 404, description: 'One or more student assignments not found' })
  @ApiResponse({ status: 409, description: 'Attendance already exists for some students' })
  bulkCreate(@Body() bulkCreateAttendanceDto: BulkCreateAttendanceDto) {
    return this.attendanceService.bulkCreate(bulkCreateAttendanceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all attendance records with filters' })
  @ApiResponse({
    status: 200,
    description: 'Attendance records retrieved successfully',
  })
  findAll(@Query() query: QueryAttendanceDto) {
    return this.attendanceService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get attendance statistics' })
  @ApiQuery({ name: 'classSectionCode', required: false })
  @ApiQuery({ name: 'studentAssignmentId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiResponse({
    status: 200,
    description: 'Attendance statistics retrieved successfully',
  })
  getStats(
    @Query('classSectionCode') classSectionCode?: string,
    @Query('studentAssignmentId') studentAssignmentId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendanceStats({
      classSectionCode,
      studentAssignmentId,
      startDate,
      endDate,
    });
  }

  @Get('monthly')
  @ApiOperation({ summary: 'Get monthly attendance summary for a student' })
  @ApiQuery({ name: 'studentAssignmentId', required: true })
  @ApiQuery({ name: 'month', required: true })
  @ApiQuery({ name: 'year', required: true })
  @ApiResponse({
    status: 200,
    description: 'Monthly attendance summary retrieved successfully',
  })
  getMonthly(
    @Query('studentAssignmentId') studentAssignmentId: string,
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getMonthlyAttendance({
      studentAssignmentId,
      month: parseInt(month, 10),
      year: parseInt(year, 10),
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get attendance record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record retrieved successfully',
    type: Attendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update attendance record' })
  @ApiResponse({
    status: 200,
    description: 'Attendance record updated successfully',
    type: Attendance,
  })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  update(@Param('id') id: string, @Body() updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete attendance record' })
  @ApiResponse({ status: 204, description: 'Attendance record deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attendance record not found' })
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}
