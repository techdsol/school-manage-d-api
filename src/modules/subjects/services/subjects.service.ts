import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subject } from '../entities/subject.entity';
import { CreateSubjectDto } from '../dto/create-subject.dto';
import { UpdateSubjectDto } from '../dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject)
    private subjectRepository: typeof Subject,
  ) { }

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return this.subjectRepository.create(createSubjectDto);
  }

  async findAll(): Promise<Subject[]> {
    return this.subjectRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<Subject> {
    const subject = await this.subjectRepository.findByPk(code);
    if (!subject) {
      throw new NotFoundException(`Subject with code ${code} not found`);
    }
    return subject;
  }

  async update(code: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findOne(code);
    return subject.update(updateSubjectDto);
  }

  async remove(code: string): Promise<void> {
    const subject = await this.findOne(code);
    await subject.destroy();
  }

  async count(): Promise<number> {
    return this.subjectRepository.count();
  }
}
