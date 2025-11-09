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
import { AcademicYearsService } from '../services/academic-years.service';
import { CreateAcademicYearDto } from '../dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from '../dto/update-academic-year.dto';
import { AcademicYear } from '../entities/academic-year.entity';

@ApiTags('Academic Years')
@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new academic year' })
  @ApiBody({ type: CreateAcademicYearDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Academic year created successfully',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  create(@Body(ValidationPipe) createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    return this.academicYearsService.create(createAcademicYearDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all academic years' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all academic years',
    type: [AcademicYear],
  })
  findAll(): Promise<AcademicYear[]> {
    return this.academicYearsService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get an academic year by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Academic year code',
    example: 'AY2024',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year found',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  findOne(@Param('code') code: string): Promise<AcademicYear> {
    return this.academicYearsService.findOne(code);
  }

  @Patch(':code')
  @ApiOperation({ summary: 'Update an academic year by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Academic year code',
    example: 'AY2024',
  })
  @ApiBody({ type: UpdateAcademicYearDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Academic year updated successfully',
    type: AcademicYear,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  update(
    @Param('code') code: string,
    @Body(ValidationPipe) updateAcademicYearDto: UpdateAcademicYearDto,
  ): Promise<AcademicYear> {
    return this.academicYearsService.update(code, updateAcademicYearDto);
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete an academic year by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Academic year code',
    example: 'AY2024',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Academic year deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Academic year not found',
  })
  async remove(@Param('code') code: string): Promise<void> {
    await this.academicYearsService.remove(code);
  }

  @Get('stats/count')
  @ApiOperation({ summary: 'Get total number of academic years' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total count of academic years',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 5,
        },
      },
    },
  })
  async getCount(): Promise<{ count: number }> {
    const count = await this.academicYearsService.count();
    return { count };
  }
}
