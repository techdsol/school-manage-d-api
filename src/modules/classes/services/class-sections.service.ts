import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassSection } from '../entities/class-section.entity';
import { Class } from '../entities/class.entity';
import { AcademicYear } from '../../academic-years/entities/academic-year.entity';
import { CreateClassSectionDto } from '../dto/create-class-section.dto';
import { UpdateClassSectionDto } from '../dto/update-class-section.dto';

@Injectable()
export class ClassSectionsService {
  constructor(
    @InjectModel(ClassSection)
    private classSectionRepository: typeof ClassSection,
  ) { }

  async create(createClassSectionDto: CreateClassSectionDto): Promise<ClassSection> {
    return this.classSectionRepository.create(createClassSectionDto);
  }

  async findAll(): Promise<ClassSection[]> {
    return this.classSectionRepository.findAll({
      include: [
        {
          model: Class,
          as: 'classDetails',
        },
        {
          model: AcademicYear,
          as: 'academicYearDetails',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<ClassSection> {
    const classSection = await this.classSectionRepository.findByPk(code, {
      include: [
        {
          model: Class,
          as: 'classDetails',
        },
        {
          model: AcademicYear,
          as: 'academicYearDetails',
        },
      ],
    });
    if (!classSection) {
      throw new NotFoundException(`Class section with code ${code} not found`);
    }
    return classSection;
  }

  async update(code: string, updateClassSectionDto: UpdateClassSectionDto): Promise<ClassSection> {
    const classSection = await this.findOne(code);
    return classSection.update(updateClassSectionDto);
  }

  async remove(code: string): Promise<void> {
    const classSection = await this.findOne(code);
    await classSection.destroy();
  }

  async count(): Promise<number> {
    return this.classSectionRepository.count();
  }

  async findByClass(classCode: string): Promise<ClassSection[]> {
    return this.classSectionRepository.findAll({
      where: { classCode },
      include: [
        {
          model: Class,
          as: 'classDetails',
        },
        {
          model: AcademicYear,
          as: 'academicYearDetails',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByAcademicYear(academicYearCode: string): Promise<ClassSection[]> {
    return this.classSectionRepository.findAll({
      where: { academicYearCode },
      include: [
        {
          model: Class,
          as: 'classDetails',
        },
        {
          model: AcademicYear,
          as: 'academicYearDetails',
        },
      ],
      order: [['createdAt', 'DESC']],
    });
  }
}
