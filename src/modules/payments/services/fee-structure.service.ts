import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FeeStructure } from '../entities/fee-structure.entity';
import { FeeType } from '../entities/fee-type.entity';
import { Class } from '../../classes/entities/class.entity';
import { CreateFeeStructureDto, UpdateFeeStructureDto } from '../dto';

@Injectable()
export class FeeStructureService {
  constructor(
    @InjectModel(FeeStructure)
    private feeStructureModel: typeof FeeStructure,
    @InjectModel(FeeType)
    private feeTypeModel: typeof FeeType,
    @InjectModel(Class)
    private classModel: typeof Class,
  ) { }

  async create(createFeeStructureDto: CreateFeeStructureDto): Promise<FeeStructure> {
    const existing = await this.feeStructureModel.findByPk(createFeeStructureDto.code);
    if (existing) {
      throw new ConflictException(`Fee structure with code '${createFeeStructureDto.code}' already exists`);
    }

    // Validate fee type exists
    const feeType = await this.feeTypeModel.findByPk(createFeeStructureDto.feeTypeCode);
    if (!feeType) {
      throw new NotFoundException(`Fee type '${createFeeStructureDto.feeTypeCode}' not found`);
    }

    // Validate class exists
    const classEntity = await this.classModel.findByPk(createFeeStructureDto.classCode);
    if (!classEntity) {
      throw new NotFoundException(`Class '${createFeeStructureDto.classCode}' not found`);
    }

    return this.feeStructureModel.create(createFeeStructureDto as any);
  }

  async findAll(filters?: { classCode?: string; academicYear?: string; isActive?: boolean }): Promise<FeeStructure[]> {
    const where: any = {};

    if (filters?.classCode) {
      where.classCode = filters.classCode;
    }
    if (filters?.academicYear) {
      where.academicYear = filters.academicYear;
    }
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    return this.feeStructureModel.findAll({
      where,
      include: [
        {
          model: FeeType,
          as: 'feeType',
        },
        {
          model: Class,
          as: 'class',
        },
      ],
      order: [['code', 'ASC']],
    });
  }

  async findOne(code: string): Promise<FeeStructure> {
    const feeStructure = await this.feeStructureModel.findByPk(code, {
      include: [
        {
          model: FeeType,
          as: 'feeType',
        },
        {
          model: Class,
          as: 'class',
        },
      ],
    });

    if (!feeStructure) {
      throw new NotFoundException(`Fee structure with code '${code}' not found`);
    }
    return feeStructure;
  }

  async findByClassCode(classCode: string, academicYear: string): Promise<FeeStructure[]> {
    return this.feeStructureModel.findAll({
      where: {
        classCode,
        academicYear,
        isActive: true,
      },
      include: [
        {
          model: FeeType,
          as: 'feeType',
        },
      ],
    });
  }

  async update(code: string, updateFeeStructureDto: UpdateFeeStructureDto): Promise<FeeStructure> {
    const feeStructure = await this.findOne(code);
    await feeStructure.update(updateFeeStructureDto);
    return feeStructure;
  }

  async remove(code: string): Promise<void> {
    const feeStructure = await this.findOne(code);
    await feeStructure.destroy();
  }
}
