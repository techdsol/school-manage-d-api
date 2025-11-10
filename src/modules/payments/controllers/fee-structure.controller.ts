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
import { ApiTags } from '@nestjs/swagger';
import { FeeStructureService } from '../services/fee-structure.service';
import { CreateFeeStructureDto, UpdateFeeStructureDto } from '../dto';

@ApiTags('Student Fee Payments')
@Controller('fee-structures')
export class FeeStructureController {
  constructor(private readonly feeStructureService: FeeStructureService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFeeStructureDto: CreateFeeStructureDto) {
    return this.feeStructureService.create(createFeeStructureDto);
  }

  @Get()
  findAll(
    @Query('classCode') classCode?: string,
    @Query('academicYear') academicYear?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.feeStructureService.findAll({
      classCode,
      academicYear,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.feeStructureService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateFeeStructureDto: UpdateFeeStructureDto) {
    return this.feeStructureService.update(code, updateFeeStructureDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('code') code: string) {
    await this.feeStructureService.remove(code);
  }
}
