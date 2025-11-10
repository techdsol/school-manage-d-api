import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentAssignment } from '../entities/student-assignment.entity';
import { CreateStudentAssignmentDto } from '../dto/create-student-assignment.dto';
import { UpdateStudentAssignmentDto } from '../dto/update-student-assignment.dto';
import { Student } from '../entities/student.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';

@Injectable()
export class StudentAssignmentService {
  constructor(
    @InjectModel(StudentAssignment)
    private studentAssignmentModel: typeof StudentAssignment,
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(ClassSection)
    private classSectionModel: typeof ClassSection,
  ) {}

  async create(createStudentAssignmentDto: CreateStudentAssignmentDto): Promise<StudentAssignment> {
    // Validate student exists
    const student = await this.studentModel.findByPk(createStudentAssignmentDto.studentId);
    if (!student) {
      throw new BadRequestException('Student not found');
    }

    // Validate class section exists
    const classSection = await this.classSectionModel.findByPk(createStudentAssignmentDto.classSectionCode);
    if (!classSection) {
      throw new BadRequestException('Class section not found');
    }

    // Check if student is already assigned to this class section
    const existingAssignment = await this.studentAssignmentModel.findOne({
      where: {
        studentId: createStudentAssignmentDto.studentId,
        classSectionCode: createStudentAssignmentDto.classSectionCode,
        status: 'ACTIVE',
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('Student is already assigned to this class section');
    }

    return this.studentAssignmentModel.create({
      studentId: createStudentAssignmentDto.studentId,
      classSectionCode: createStudentAssignmentDto.classSectionCode,
      status: createStudentAssignmentDto.status || 'ACTIVE',
      notes: createStudentAssignmentDto.notes,
    });
  }

  async findAll(): Promise<StudentAssignment[]> {
    return this.studentAssignmentModel.findAll({
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });
  }

  async findActiveAssignments(): Promise<StudentAssignment[]> {
    return this.studentAssignmentModel.findAll({
      where: { status: 'ACTIVE' },
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });
  }

  async findOne(id: string): Promise<StudentAssignment> {
    const assignment = await this.studentAssignmentModel.findByPk(id, {
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(`Student assignment with ID ${id} not found`);
    }

    return assignment;
  }

  async findByStudent(studentId: string): Promise<StudentAssignment[]> {
    const student = await this.studentModel.findByPk(studentId);
    if (!student) {
      throw new NotFoundException(`Student with ID ${studentId} not found`);
    }

    return this.studentAssignmentModel.findAll({
      where: { studentId },
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });
  }

  async findByClassSection(classSectionCode: string): Promise<StudentAssignment[]> {
    const classSection = await this.classSectionModel.findByPk(classSectionCode);
    if (!classSection) {
      throw new NotFoundException(`Class section with code ${classSectionCode} not found`);
    }

    return this.studentAssignmentModel.findAll({
      where: { classSectionCode },
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });
  }

  async findActiveStudentsByClassSection(classSectionCode: string): Promise<any> {
    const classSection = await this.classSectionModel.findByPk(classSectionCode);
    if (!classSection) {
      throw new NotFoundException(`Class section with code ${classSectionCode} not found`);
    }

    const assignments = await this.studentAssignmentModel.findAll({
      where: { 
        classSectionCode,
        status: 'ACTIVE',
      },
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
        },
      ],
      order: [
        [{ model: Student, as: 'student' }, 'name', 'ASC'],
      ],
    });

    return {
      classSection,
      totalStudents: assignments.length,
      students: assignments.map(a => ({
        id: a.student.id,
        name: a.student.name,
        phone: a.student.phone,
        assignmentId: a.id,
        assignmentStatus: a.status,
        notes: a.notes,
      })),
    };
  }

  async update(id: string, updateStudentAssignmentDto: UpdateStudentAssignmentDto): Promise<StudentAssignment> {
    const assignment = await this.findOne(id);

    await assignment.update({
      status: updateStudentAssignmentDto.status,
      notes: updateStudentAssignmentDto.notes,
    });
    return assignment.reload({
      include: [
        {
          model: Student,
          attributes: ['id', 'name', 'email'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section'],
        },
      ],
    });
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
  }

  async getAssignmentStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const [total, active, inactive] = await Promise.all([
      this.studentAssignmentModel.count(),
      this.studentAssignmentModel.count({ where: { status: 'ACTIVE' } }),
      this.studentAssignmentModel.count({ where: { status: 'INACTIVE' } }),
    ]);

    return {
      total,
      active,
      inactive,
    };
  }
}
