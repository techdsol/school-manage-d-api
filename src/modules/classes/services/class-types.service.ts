import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassType } from '../entities/class-type.entity';
import { CreateClassTypeDto } from '../dto/create-class-type.dto';
import { UpdateClassTypeDto } from '../dto/update-class-type.dto';

@Injectable()
export class ClassTypesService {
  constructor(
    @InjectModel(ClassType)
    private classTypeRepository: typeof ClassType,
  ) { }

  async create(createClassTypeDto: CreateClassTypeDto): Promise<ClassType> {
    return this.classTypeRepository.create(createClassTypeDto);
  }

  async findAll(): Promise<ClassType[]> {
    return this.classTypeRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(code: string): Promise<ClassType> {
    const classType = await this.classTypeRepository.findByPk(code);
    if (!classType) {
      throw new NotFoundException(`ClassType with code ${code} not found`);
    }
    return classType;
  }

  async update(code: string, updateClassTypeDto: UpdateClassTypeDto): Promise<ClassType> {
    const classType = await this.findOne(code);
    return classType.update(updateClassTypeDto);
  }

  async remove(code: string): Promise<void> {
    const classType = await this.findOne(code);
    await classType.destroy();
  }

  async count(): Promise<number> {
    return this.classTypeRepository.count();
  }
}
