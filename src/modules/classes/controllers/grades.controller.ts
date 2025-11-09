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
import { GradesService } from '../services/grades.service';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';
import { Grade } from '../entities/grade.entity';

@ApiTags('Grades')
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new grade' })
  @ApiBody({ type: CreateGradeDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Grade created successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradesService.create(createGradeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all grades' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all grades',
    type: [Grade],
  })
  findAll(): Promise<Grade[]> {
    return this.gradesService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get a grade by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Grade Code',
    example: 'GRADE-1',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade found',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  findOne(@Param('code') code: string): Promise<Grade> {
    return this.gradesService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update a grade by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Grade Code',
    example: 'GRADE-1',
  })
  @ApiBody({ type: UpdateGradeDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Grade updated successfully',
    type: Grade,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('code') code: string,
    @Body(ValidationPipe) updateGradeDto: UpdateGradeDto,
  ): Promise<Grade> {
    return this.gradesService.update(code, updateGradeDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a grade by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Grade Code',
    example: 'GRADE-1',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Grade deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Grade not found',
  })
  async remove(@Param('code') code: string): Promise<void> {
    await this.gradesService.remove(code);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of grades' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of grades',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 12,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.gradesService.count();
    return { count };
  }
}
