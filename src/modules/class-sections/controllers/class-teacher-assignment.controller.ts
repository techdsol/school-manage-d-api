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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClassTeacherAssignmentService } from '../services/class-teacher-assignment.service';
import { CreateClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/create-class-teacher-assignment.dto';
import { UpdateClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/update-class-teacher-assignment.dto';
import { QueryClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/query-class-teacher-assignment.dto';

@ApiTags('Class Teacher Assignments')
@Controller('class-sections/teacher-assignments')
export class ClassTeacherAssignmentController {
  constructor(
    private readonly classTeacherAssignmentService: ClassTeacherAssignmentService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Assign a teacher to a class section' })
  @ApiResponse({
    status: 201,
    description: 'Class teacher assignment created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Teacher or class section not found' })
  create(@Body() createDto: CreateClassTeacherAssignmentDto) {
    return this.classTeacherAssignmentService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class teacher assignments with filters' })
  @ApiResponse({
    status: 200,
    description: 'List of class teacher assignments retrieved successfully',
  })
  findAll(@Query() queryDto: QueryClassTeacherAssignmentDto) {
    return this.classTeacherAssignmentService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific class teacher assignment by ID' })
  @ApiParam({
    name: 'id',
    description: 'Class teacher assignment ID',
    example: '770e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Class teacher assignment retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Class teacher assignment not found' })
  findOne(@Param('id') id: string) {
    return this.classTeacherAssignmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a class teacher assignment' })
  @ApiParam({
    name: 'id',
    description: 'Class teacher assignment ID',
    example: '770e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 200,
    description: 'Class teacher assignment updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Class teacher assignment not found' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClassTeacherAssignmentDto,
  ) {
    return this.classTeacherAssignmentService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a class teacher assignment' })
  @ApiParam({
    name: 'id',
    description: 'Class teacher assignment ID',
    example: '770e8400-e29b-41d4-a716-446655440001',
  })
  @ApiResponse({
    status: 204,
    description: 'Class teacher assignment deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Class teacher assignment not found' })
  remove(@Param('id') id: string) {
    return this.classTeacherAssignmentService.remove(id);
  }
}
