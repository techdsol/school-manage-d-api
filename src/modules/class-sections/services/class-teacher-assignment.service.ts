import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassTeacherAssignment } from '../entities/class-teacher-assignment.entity';
import { CreateClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/create-class-teacher-assignment.dto';
import { UpdateClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/update-class-teacher-assignment.dto';
import { QueryClassTeacherAssignmentDto } from '../dto/class-teacher-assignment/query-class-teacher-assignment.dto';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

@Injectable()
export class ClassTeacherAssignmentService {
  constructor(
    @InjectModel(ClassTeacherAssignment)
    private classTeacherAssignmentModel: typeof ClassTeacherAssignment,
    @InjectModel(ClassSection)
    private classSectionModel: typeof ClassSection,
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
  ) { }

  async create(
    createDto: CreateClassTeacherAssignmentDto,
  ): Promise<ClassTeacherAssignment> {
    // Validate class section exists
    const classSection = await this.classSectionModel.findByPk(
      createDto.classSectionCode,
    );
    if (!classSection) {
      throw new NotFoundException(
        `Class section with code ${createDto.classSectionCode} not found`,
      );
    }

    // Validate teacher exists
    const teacher = await this.teacherModel.findByPk(createDto.teacherId);
    if (!teacher) {
      throw new NotFoundException(
        `Teacher with id ${createDto.teacherId} not found`,
      );
    }

    // Validate assignment dates
    if (createDto.assignmentEndDate) {
      const startDate = new Date(createDto.assignmentStartDate);
      const endDate = new Date(createDto.assignmentEndDate);

      if (endDate <= startDate) {
        throw new BadRequestException(
          'Assignment end date must be after start date',
        );
      }
    }

    const assignmentData: any = {
      teacherId: createDto.teacherId,
      classSectionCode: createDto.classSectionCode,
      role: createDto.role,
      status: createDto.status,
      assignmentStartDate: createDto.assignmentStartDate,
      assignmentEndDate: createDto.assignmentEndDate,
      notes: createDto.notes,
    };

    return this.classTeacherAssignmentModel.create(assignmentData);
  }

  async findAll(
    queryDto: QueryClassTeacherAssignmentDto,
  ): Promise<{ data: ClassTeacherAssignment[]; total: number; page: number; limit: number }> {
    const { teacherId, classSectionCode, role, status, page = 1, limit = 10 } = queryDto;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (teacherId) {
      where.teacherId = teacherId;
    }

    if (classSectionCode) {
      where.classSectionCode = classSectionCode;
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const { rows, count } = await this.classTeacherAssignmentModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Teacher,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section', 'classCode', 'academicYearCode'],
        },
      ],
      order: [['assignmentStartDate', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ClassTeacherAssignment> {
    const assignment = await this.classTeacherAssignmentModel.findByPk(id, {
      include: [
        {
          model: Teacher,
          attributes: ['id', 'name', 'phone'],
        },
        {
          model: ClassSection,
          attributes: ['code', 'name', 'section', 'classCode', 'academicYearCode'],
        },
      ],
    });

    if (!assignment) {
      throw new NotFoundException(
        `Class teacher assignment with id ${id} not found`,
      );
    }

    return assignment;
  }

  async update(
    id: string,
    updateDto: UpdateClassTeacherAssignmentDto,
  ): Promise<ClassTeacherAssignment> {
    const assignment = await this.findOne(id);

    // Validate class section if being updated
    if (updateDto.classSectionCode) {
      const classSection = await this.classSectionModel.findByPk(
        updateDto.classSectionCode,
      );
      if (!classSection) {
        throw new NotFoundException(
          `Class section with code ${updateDto.classSectionCode} not found`,
        );
      }
    }

    // Validate teacher if being updated
    if (updateDto.teacherId) {
      const teacher = await this.teacherModel.findByPk(updateDto.teacherId);
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with id ${updateDto.teacherId} not found`,
        );
      }
    }

    // Validate assignment dates
    if (updateDto.assignmentStartDate || updateDto.assignmentEndDate) {
      const startDate = new Date(
        updateDto.assignmentStartDate || assignment.assignmentStartDate,
      );
      const endDate = updateDto.assignmentEndDate
        ? new Date(updateDto.assignmentEndDate)
        : assignment.assignmentEndDate
          ? new Date(assignment.assignmentEndDate)
          : null;

      if (endDate && endDate <= startDate) {
        throw new BadRequestException(
          'Assignment end date must be after start date',
        );
      }
    }

    await assignment.update(updateDto as any);
    return assignment;
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await assignment.destroy();
  }
}
