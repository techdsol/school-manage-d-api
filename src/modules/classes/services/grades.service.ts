import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Grade } from '../entities/grade.entity';
import { CreateGradeDto } from '../dto/create-grade.dto';
import { UpdateGradeDto } from '../dto/update-grade.dto';

@Injectable()
export class GradesService {
  constructor(
    @InjectModel(Grade)
    private gradeRepository: typeof Grade,
  ) { }

  async create(createGradeDto: CreateGradeDto): Promise<Grade> {
    return this.gradeRepository.create(createGradeDto);
  }

  async findAll(): Promise<Grade[]> {
    return this.gradeRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<Grade> {
    const grade = await this.gradeRepository.findByPk(code);
    if (!grade) {
      throw new NotFoundException(`Grade with code ${code} not found`);
    }
    return grade;
  }

  async update(code: string, updateGradeDto: UpdateGradeDto): Promise<Grade> {
    const grade = await this.findOne(code);
    return grade.update(updateGradeDto);
  }

  async remove(code: string): Promise<void> {
    const grade = await this.findOne(code);
    await grade.destroy();
  }

  async count(): Promise<number> {
    return this.gradeRepository.count();
  }
}
