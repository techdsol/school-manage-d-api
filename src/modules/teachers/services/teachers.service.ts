import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Teacher } from '../entities/teacher.entity';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher)
    private teacherRepository: typeof Teacher,
  ) { }

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    return this.teacherRepository.create(createTeacherDto);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findByPk(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    return teacher.update(updateTeacherDto);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await teacher.destroy();
  }

  async count(): Promise<number> {
    return this.teacherRepository.count();
  }
}
