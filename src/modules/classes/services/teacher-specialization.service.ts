import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { TeacherSpecialization } from '../entities/teacher-specialization.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { Class } from '../entities/class.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { CreateTeacherSpecializationDto } from '../dto/create-teacher-specialization.dto';
import { UpdateTeacherSpecializationDto } from '../dto/update-teacher-specialization.dto';

@Injectable()
export class TeacherSpecializationService {
  constructor(
    @InjectModel(TeacherSpecialization)
    private teacherClassSubjectModel: typeof TeacherSpecialization,
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
    @InjectModel(Class)
    private classModel: typeof Class,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
  ) { }

  async create(createTeacherSpecializationDto: CreateTeacherSpecializationDto): Promise<TeacherSpecialization> {
    // Validate that teacher, class, and subject exist
    await this.validateEntities(
      createTeacherSpecializationDto.teacherId,
      createTeacherSpecializationDto.classCode,
      createTeacherSpecializationDto.subjectCode
    );

    // Check if assignment already exists
    const existingAssignment = await this.teacherClassSubjectModel.findOne({
      where: {
        teacherId: createTeacherSpecializationDto.teacherId,
        classCode: createTeacherSpecializationDto.classCode,
        subjectCode: createTeacherSpecializationDto.subjectCode,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('This teacher specialization already exists for this subject and class');
    }

    return this.teacherClassSubjectModel.create(createTeacherSpecializationDto);
  }

  async findAll(): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectModel.findAll({
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });
  }

  async findOne(id: string): Promise<TeacherSpecialization> {
    const assignment = await this.teacherClassSubjectModel.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(`Teacher specialization with ID ${id} not found`);
    }

    return assignment;
  }

  async findByTeacher(teacherId: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectModel.findAll({
      where: { teacherId },
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });
  }

  async findByClass(classCode: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectModel.findAll({
      where: { classCode },
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });
  }

  async findBySubject(subjectCode: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectModel.findAll({
      where: { subjectCode },
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });
  }

  async findByClassAndSubject(classCode: string, subjectCode: string): Promise<TeacherSpecialization[]> {
    return this.teacherClassSubjectModel.findAll({
      where: {
        classCode,
        subjectCode
      },
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
        {
          model: Class,
          as: 'class',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
    });
  }

  async findTeachersByClassAndSubject(classCode: string, subjectCode: string): Promise<Teacher[]> {
    const specializations = await this.teacherClassSubjectModel.findAll({
      where: {
        classCode,
        subjectCode
      },
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
      ],
    });

    // Extract only the teacher objects
    return specializations.map(specialization => specialization.teacher);
  }

  async update(id: string, updateTeacherSpecializationDto: UpdateTeacherSpecializationDto): Promise<TeacherSpecialization> {
    const assignment = await this.findOne(id);

    // If updating references, validate entities exist
    if (updateTeacherSpecializationDto.teacherId || updateTeacherSpecializationDto.classCode || updateTeacherSpecializationDto.subjectCode) {
      await this.validateEntities(
        updateTeacherSpecializationDto.teacherId || assignment.teacherId,
        updateTeacherSpecializationDto.classCode || assignment.classCode,
        updateTeacherSpecializationDto.subjectCode || assignment.subjectCode
      );

      // Check for duplicate assignment if changing references
      if (updateTeacherSpecializationDto.teacherId || updateTeacherSpecializationDto.classCode || updateTeacherSpecializationDto.subjectCode) {
        const existingAssignment = await this.teacherClassSubjectModel.findOne({
          where: {
            teacherId: updateTeacherSpecializationDto.teacherId || assignment.teacherId,
            classCode: updateTeacherSpecializationDto.classCode || assignment.classCode,
            subjectCode: updateTeacherSpecializationDto.subjectCode || assignment.subjectCode,
            id: { [Op.ne]: id }, // Exclude current record
          },
        });

        if (existingAssignment) {
          throw new BadRequestException('This teacher specialization already exists for this subject and class');
        }
      }
    }

    await assignment.update(updateTeacherSpecializationDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
  }

  private async validateEntities(teacherId: string, classCode: string, subjectCode: string): Promise<void> {
    // Check if teacher exists
    const teacher = await this.teacherModel.findByPk(teacherId);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
    }

    // Check if class exists
    const classEntity = await this.classModel.findByPk(classCode);
    if (!classEntity) {
      throw new NotFoundException(`Class with code ${classCode} not found`);
    }

    // Check if subject exists
    const subject = await this.subjectModel.findByPk(subjectCode);
    if (!subject) {
      throw new NotFoundException(`Subject with code ${subjectCode} not found`);
    }
  }
}
