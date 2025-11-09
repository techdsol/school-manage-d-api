import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AcademicYear } from '../entities/academic-year.entity';
import { CreateAcademicYearDto } from '../dto/create-academic-year.dto';
import { UpdateAcademicYearDto } from '../dto/update-academic-year.dto';

@Injectable()
export class AcademicYearsService {
  constructor(
    @InjectModel(AcademicYear)
    private academicYearRepository: typeof AcademicYear,
  ) { }

  async create(createAcademicYearDto: CreateAcademicYearDto): Promise<AcademicYear> {
    return this.academicYearRepository.create(createAcademicYearDto);
  }

  async findAll(): Promise<AcademicYear[]> {
    return this.academicYearRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<AcademicYear> {
    const academicYear = await this.academicYearRepository.findByPk(code);
    if (!academicYear) {
      throw new NotFoundException(`Academic year with code ${code} not found`);
    }
    return academicYear;
  }

  async update(code: string, updateAcademicYearDto: UpdateAcademicYearDto): Promise<AcademicYear> {
    const academicYear = await this.findOne(code);
    return academicYear.update(updateAcademicYearDto);
  }

  async remove(code: string): Promise<void> {
    const academicYear = await this.findOne(code);
    await academicYear.destroy();
  }

  async count(): Promise<number> {
    return this.academicYearRepository.count();
  }
}
