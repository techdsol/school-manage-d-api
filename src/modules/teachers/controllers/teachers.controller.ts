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
import { TeachersService } from '../services/teachers.service';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { Teacher } from '../entities/teacher.entity';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new teacher' })
  @ApiBody({ type: CreateTeacherDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Teacher created successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teachersService.create(createTeacherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all teachers',
    type: [Teacher],
  })
  findAll(): Promise<Teacher[]> {
    return this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a teacher by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Teacher UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher found',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  findOne(@Param('id') id: string): Promise<Teacher> {
    return this.teachersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a teacher by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Teacher UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiBody({ type: UpdateTeacherDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Teacher updated successfully',
    type: Teacher,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    return this.teachersService.update(id, updateTeacherDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a teacher by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Teacher UUID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Teacher deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Teacher not found',
  })
  async remove(@Param('id') id: string): Promise<void> {
    await this.teachersService.remove(id);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of teachers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of teachers',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 42,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.teachersService.count();
    return { count };
  }
}
