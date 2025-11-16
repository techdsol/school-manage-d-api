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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeeTypeService } from '../services/fee-type.service';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from '../dto';

@ApiTags('Student Fee Payments')
@Controller('fee-types')
export class FeeTypeController {
  constructor(private readonly feeTypeService: FeeTypeService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createFeeTypeDto: CreateFeeTypeDto) {
    return this.feeTypeService.create(createFeeTypeDto);
  }

  @Get()
  findAll() {
    return this.feeTypeService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.feeTypeService.findOne(code);
  }

  @Patch(':code')
  update(@Param('code') code: string, @Body() updateFeeTypeDto: UpdateFeeTypeDto) {
    return this.feeTypeService.update(code, updateFeeTypeDto);
  }

  @Delete(':code')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('code') code: string) {
    await this.feeTypeService.remove(code);
  }
}
