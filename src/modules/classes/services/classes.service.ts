import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Class } from '../entities/class.entity';
import { ClassType } from '../entities/class-type.entity';
import { CreateClassDto } from '../dto/create-class.dto';
import { UpdateClassDto } from '../dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel(Class)
    private classRepository: typeof Class,
  ) { }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    return this.classRepository.create(createClassDto);
  }

  async findAll(): Promise<Class[]> {
    return this.classRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<Class> {
    const classEntity = await this.classRepository.findByPk(code);
    if (!classEntity) {
      throw new NotFoundException(`Class with code ${code} not found`);
    }
    return classEntity;
  }

  async update(code: string, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findOne(code);
    return classEntity.update(updateClassDto);
  }

  async remove(code: string): Promise<void> {
    const classEntity = await this.findOne(code);
    await classEntity.destroy();
  }

  async count(): Promise<number> {
    return this.classRepository.count();
  }

  async findByType(classTypeCode: string): Promise<Class[]> {
    return this.classRepository.findAll({
      where: { classTypeCode },
      order: [['createdAt', 'DESC']],
    });
  }
}
