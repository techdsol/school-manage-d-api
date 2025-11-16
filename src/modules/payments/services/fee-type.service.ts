import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FeeType } from '../entities/fee-type.entity';
import { CreateFeeTypeDto, UpdateFeeTypeDto } from '../dto';

@Injectable()
export class FeeTypeService {
  constructor(
    @InjectModel(FeeType)
    private feeTypeModel: typeof FeeType,
  ) { }

  async create(createFeeTypeDto: CreateFeeTypeDto): Promise<FeeType> {
    const existing = await this.feeTypeModel.findByPk(createFeeTypeDto.code);
    if (existing) {
      throw new ConflictException(`Fee type with code '${createFeeTypeDto.code}' already exists`);
    }

    return this.feeTypeModel.create(createFeeTypeDto as any);
  }

  async findAll(): Promise<FeeType[]> {
    return this.feeTypeModel.findAll({
      order: [['code', 'ASC']],
    });
  }

  async findOne(code: string): Promise<FeeType> {
    const feeType = await this.feeTypeModel.findByPk(code);
    if (!feeType) {
      throw new NotFoundException(`Fee type with code '${code}' not found`);
    }
    return feeType;
  }

  async update(code: string, updateFeeTypeDto: UpdateFeeTypeDto): Promise<FeeType> {
    const feeType = await this.findOne(code);
    await feeType.update(updateFeeTypeDto);
    return feeType;
  }

  async remove(code: string): Promise<void> {
    const feeType = await this.findOne(code);
    await feeType.destroy();
  }
}
