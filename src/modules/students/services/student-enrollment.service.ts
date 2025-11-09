import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentEnrollment } from '../entities/student-enrollment.entity';
import { Student } from '../entities/student.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Class } from '../../classes/entities/class.entity';
import { AcademicYear } from '../../academic-years/entities/academic-year.entity';
import { CreateStudentEnrollmentDto } from '../dto/create-student-enrollment.dto';
import { UpdateStudentEnrollmentDto } from '../dto/update-student-enrollment.dto';

@Injectable()
export class StudentEnrollmentService {
  constructor(
    @InjectModel(StudentEnrollment)
    private studentEnrollmentModel: typeof StudentEnrollment,
  ) { }

  async create(createStudentEnrollmentDto: CreateStudentEnrollmentDto): Promise<StudentEnrollment> {
    // Check if student is already enrolled in the same class section
    const existingEnrollment = await this.studentEnrollmentModel.findOne({
      where: {
        studentId: createStudentEnrollmentDto.studentId,
        classSectionCode: createStudentEnrollmentDto.classSectionCode,
        status: 'ACTIVE',
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('Student is already enrolled in this class section');
    }

    // Check if roll number is already taken in the class section
    const existingRollNumber = await this.studentEnrollmentModel.findOne({
      where: {
        classSectionCode: createStudentEnrollmentDto.classSectionCode,
        rollNumber: createStudentEnrollmentDto.rollNumber,
        status: 'ACTIVE',
      },
    });

    if (existingRollNumber) {
      throw new ConflictException('Roll number is already taken in this class section');
    }

    // Convert date strings to Date objects
    const enrollmentData = {
      ...createStudentEnrollmentDto,
      enrollmentDate: new Date(createStudentEnrollmentDto.enrollmentDate),
      withdrawalDate: createStudentEnrollmentDto.withdrawalDate
        ? new Date(createStudentEnrollmentDto.withdrawalDate)
        : undefined,
    };

    return this.studentEnrollmentModel.create(enrollmentData);
  }

  async findAll(): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentModel.findAll({
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
          include: [
            {
              model: Class,
              as: 'classDetails',
            },
            {
              model: AcademicYear,
              as: 'academicYear',
            },
          ],
        },
      ],
    });
  }

  async findOne(id: string): Promise<StudentEnrollment> {
    const enrollment = await this.studentEnrollmentModel.findByPk(id, {
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
          include: [
            {
              model: Class,
              as: 'classDetails',
            },
            {
              model: AcademicYear,
              as: 'academicYear',
            },
          ],
        },
      ],
    });

    if (!enrollment) {
      throw new NotFoundException(`Student enrollment with ID "${id}" not found`);
    }

    return enrollment;
  }

  async findByStudent(studentId: string): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentModel.findAll({
      where: { studentId },
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
          include: [
            {
              model: Class,
              as: 'classDetails',
            },
            {
              model: AcademicYear,
              as: 'academicYear',
            },
          ],
        },
      ],
    });
  }

  async findByClassSection(classSectionCode: string): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentModel.findAll({
      where: { classSectionCode },
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
          include: [
            {
              model: Class,
              as: 'classDetails',
            },
            {
              model: AcademicYear,
              as: 'academicYear',
            },
          ],
        },
      ],
      order: [['rollNumber', 'ASC']],
    });
  }

  async findActiveEnrollments(): Promise<StudentEnrollment[]> {
    return this.studentEnrollmentModel.findAll({
      where: { status: 'ACTIVE' },
      include: [
        {
          model: Student,
          as: 'student',
        },
        {
          model: ClassSection,
          as: 'classSection',
          include: [
            {
              model: Class,
              as: 'classDetails',
            },
            {
              model: AcademicYear,
              as: 'academicYear',
            },
          ],
        },
      ],
    });
  }

  async update(id: string, updateStudentEnrollmentDto: UpdateStudentEnrollmentDto): Promise<StudentEnrollment> {
    const enrollment = await this.findOne(id);

    // If updating roll number, check for conflicts
    if (updateStudentEnrollmentDto.rollNumber && updateStudentEnrollmentDto.rollNumber !== enrollment.rollNumber) {
      const existingRollNumber = await this.studentEnrollmentModel.findOne({
        where: {
          classSectionCode: enrollment.classSectionCode,
          rollNumber: updateStudentEnrollmentDto.rollNumber,
          status: 'ACTIVE',
          id: { [require('sequelize').Op.ne]: id },
        },
      });

      if (existingRollNumber) {
        throw new ConflictException('Roll number is already taken in this class section');
      }
    }

    // Convert date strings to Date objects
    const updateData: any = { ...updateStudentEnrollmentDto };

    if (updateStudentEnrollmentDto.enrollmentDate) {
      updateData.enrollmentDate = new Date(updateStudentEnrollmentDto.enrollmentDate);
    }

    if (updateStudentEnrollmentDto.withdrawalDate) {
      updateData.withdrawalDate = new Date(updateStudentEnrollmentDto.withdrawalDate);
    }

    await enrollment.update(updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const enrollment = await this.findOne(id);
    await enrollment.destroy();
  }

  async getEnrollmentCount(): Promise<number> {
    return this.studentEnrollmentModel.count();
  }

  async getActiveEnrollmentCount(): Promise<number> {
    return this.studentEnrollmentModel.count({
      where: { status: 'ACTIVE' },
    });
  }

  async getEnrollmentCountByClassSection(classSectionCode: string): Promise<number> {
    return this.studentEnrollmentModel.count({
      where: {
        classSectionCode,
        status: 'ACTIVE',
      },
    });
  }
}
