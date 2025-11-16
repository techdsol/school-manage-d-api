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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { TimetableService } from '../services/timetable.service';
import { CreateTimetableDto } from '../dto/create-timetable.dto';
import { UpdateTimetableDto } from '../dto/update-timetable.dto';
import { BulkCreateMultiDayDto } from '../dto/bulk-create-multi-day.dto';
import { QueryTimetableDto } from '../dto/query-timetable.dto';
import { ValidateTimeSlotDto } from '../dto/validate-time-slot.dto';
import { DayOfWeek, TimetableStatus } from '../entities/timetable.entity';

@ApiTags('Timetable')
@Controller('timetable')
export class TimetableController {
  constructor(private readonly timetableService: TimetableService) { }

  @Post()
  @ApiOperation({ summary: 'Create a single timetable period' })
  @ApiResponse({ status: 201, description: 'Timetable period created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or time conflict' })
  @ApiResponse({ status: 404, description: 'Class section, subject, or teacher not found' })
  @ApiResponse({ status: 409, description: 'Time conflict detected' })
  create(@Body() createTimetableDto: CreateTimetableDto) {
    return this.timetableService.create(createTimetableDto);
  }

  @Post('bulk-multi-day')
  @ApiOperation({
    summary: 'Create multiple periods for same subject across different days/times',
    description: 'Creates multiple timetable periods for the same subject on different days with different time slots'
  })
  @ApiResponse({ status: 201, description: 'Periods created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or conflicts detected' })
  bulkCreateMultiDay(@Body() bulkCreateMultiDayDto: BulkCreateMultiDayDto) {
    return this.timetableService.bulkCreateMultiDay(bulkCreateMultiDayDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all timetable periods with filters' })
  @ApiResponse({ status: 200, description: 'Timetable periods retrieved successfully' })
  findAll(@Query() query: QueryTimetableDto) {
    return this.timetableService.findAll(query);
  }

  @Get('today')
  @ApiOperation({ summary: "Get today's timetable periods requiring attendance" })
  @ApiQuery({ name: 'classSectionCode', required: false, description: 'Filter by class section' })
  @ApiQuery({ name: 'academicYear', required: false, description: 'Academic year' })
  @ApiResponse({ status: 200, description: "Today's timetable retrieved successfully" })
  getTodaySchedule(
    @Query('classSectionCode') classSectionCode?: string,
    @Query('academicYear') academicYear?: string,
  ) {
    return this.timetableService.getTodaySchedule({ classSectionCode, academicYear });
  }

  @Get('class/:code/weekly')
  @ApiOperation({ summary: 'Get weekly schedule for a class section' })
  @ApiParam({ name: 'code', description: 'Class section code' })
  @ApiQuery({ name: 'academicYear', description: 'Academic year', example: '2024-2025' })
  @ApiQuery({
    name: 'status',
    description: 'Filter by status',
    enum: TimetableStatus,
    required: false
  })
  @ApiResponse({ status: 200, description: 'Weekly schedule retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Class section not found' })
  getWeeklySchedule(
    @Param('code') code: string,
    @Query('academicYear') academicYear: string,
    @Query('status') status?: TimetableStatus,
  ) {
    return this.timetableService.getWeeklySchedule(code, academicYear, status);
  }

  @Get('class/:code/daily')
  @ApiOperation({ summary: 'Get daily schedule for a class section' })
  @ApiParam({ name: 'code', description: 'Class section code' })
  @ApiQuery({ name: 'dayOfWeek', description: 'Day of the week', enum: DayOfWeek })
  @ApiQuery({ name: 'academicYear', description: 'Academic year', example: '2024-2025' })
  @ApiQuery({
    name: 'status',
    description: 'Filter by status',
    enum: TimetableStatus,
    required: false
  })
  @ApiResponse({ status: 200, description: 'Daily schedule retrieved successfully' })
  getDailySchedule(
    @Param('code') code: string,
    @Query('dayOfWeek') dayOfWeek: DayOfWeek,
    @Query('academicYear') academicYear: string,
    @Query('status') status?: TimetableStatus,
  ) {
    return this.timetableService.getDailySchedule(code, dayOfWeek, academicYear, status);
  }

  @Get('teacher/:id/weekly')
  @ApiOperation({ summary: "Get weekly schedule for a teacher" })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiQuery({ name: 'academicYear', description: 'Academic year', example: '2024-2025' })
  @ApiQuery({
    name: 'status',
    description: 'Filter by status',
    enum: TimetableStatus,
    required: false
  })
  @ApiResponse({ status: 200, description: "Teacher's weekly schedule retrieved successfully" })
  getTeacherWeeklySchedule(
    @Param('id') id: string,
    @Query('academicYear') academicYear: string,
    @Query('status') status?: TimetableStatus,
  ) {
    return this.timetableService.getTeacherWeeklySchedule(id, academicYear, status);
  }

  @Get('teacher/:id/daily')
  @ApiOperation({ summary: "Get daily schedule for a teacher" })
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiQuery({ name: 'dayOfWeek', description: 'Day of the week', enum: DayOfWeek })
  @ApiQuery({ name: 'academicYear', description: 'Academic year', example: '2024-2025' })
  @ApiQuery({
    name: 'status',
    description: 'Filter by status',
    enum: TimetableStatus,
    required: false
  })
  @ApiResponse({ status: 200, description: "Teacher's daily schedule retrieved successfully" })
  getTeacherDailySchedule(
    @Param('id') id: string,
    @Query('dayOfWeek') dayOfWeek: DayOfWeek,
    @Query('academicYear') academicYear: string,
    @Query('status') status?: TimetableStatus,
  ) {
    return this.timetableService.getTeacherDailySchedule(id, dayOfWeek, academicYear, status);
  }

  @Post('validate-time')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Validate time slot for conflicts',
    description: 'Check if a time slot is available without creating it. Useful for frontend validation.'
  })
  @ApiResponse({ status: 200, description: 'Validation result returned' })
  validateTimeSlot(@Body() validateTimeSlotDto: ValidateTimeSlotDto) {
    return this.timetableService.validateTimeSlot(validateTimeSlotDto);
  }

  @Post('copy-year')
  @ApiOperation({
    summary: 'Copy timetable from one academic year to another',
    description: 'Duplicates all active timetable periods from old year to new year. Optionally filter by class section.'
  })
  @ApiResponse({ status: 201, description: 'Timetable copied successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  copyToNewYear(
    @Body() dto: { oldYear: string; newYear: string; classSectionCode?: string },
  ) {
    return this.timetableService.copyToNewYear(dto.oldYear, dto.newYear, dto.classSectionCode);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a timetable period by ID' })
  @ApiParam({ name: 'id', description: 'Timetable ID' })
  @ApiResponse({ status: 200, description: 'Timetable period retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Timetable period not found' })
  findOne(@Param('id') id: string) {
    return this.timetableService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a timetable period' })
  @ApiParam({ name: 'id', description: 'Timetable ID' })
  @ApiResponse({ status: 200, description: 'Timetable period updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input or time conflict' })
  @ApiResponse({ status: 404, description: 'Timetable period not found' })
  @ApiResponse({ status: 409, description: 'Time conflict detected' })
  update(@Param('id') id: string, @Body() updateTimetableDto: UpdateTimetableDto) {
    return this.timetableService.update(id, updateTimetableDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a timetable period' })
  @ApiParam({ name: 'id', description: 'Timetable ID' })
  @ApiResponse({ status: 204, description: 'Timetable period deleted successfully' })
  @ApiResponse({ status: 404, description: 'Timetable period not found' })
  remove(@Param('id') id: string) {
    return this.timetableService.remove(id);
  }
}
