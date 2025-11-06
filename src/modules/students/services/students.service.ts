import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Student } from '../entities/student.entity';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student)
    private studentRepository: typeof Student,
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    return this.studentRepository.create(createStudentDto);
  }

  async findAll(): Promise<Student[]> {
    return this.studentRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findByPk(id);
    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    return student.update(updateStudentDto);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await student.destroy();
  }

  async count(): Promise<number> {
    return this.studentRepository.count();
  }
}
