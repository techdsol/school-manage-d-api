import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ClassSubject } from '../entities/class-subject.entity';
import { ClassSection } from '../entities/class-section.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { CreateClassSubjectDto } from '../dto/class-subject/create-class-subject.dto';
import { UpdateClassSubjectDto } from '../dto/class-subject/update-class-subject.dto';
import { BulkCreateClassSubjectDto } from '../dto/class-subject/bulk-create-class-subject.dto';
import { QueryClassSubjectDto } from '../dto/class-subject/query-class-subject.dto';
import { Op } from 'sequelize';

@Injectable()
export class ClassSubjectService {
  constructor(
    @InjectModel(ClassSubject)
    private classSubjectModel: typeof ClassSubject,
    @InjectModel(ClassSection)
    private classSectionModel: typeof ClassSection,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
  ) { }

  async create(createClassSubjectDto: CreateClassSubjectDto): Promise<ClassSubject> {
    // Validate class section exists
    const classSection = await this.classSectionModel.findByPk(
      createClassSubjectDto.classSectionCode,
    );

    if (!classSection) {
      throw new NotFoundException(
        `Class section with code ${createClassSubjectDto.classSectionCode} not found`,
      );
    }

    // Validate subject exists
    const subject = await this.subjectModel.findByPk(
      createClassSubjectDto.subjectCode,
    );

    if (!subject) {
      throw new NotFoundException(
        `Subject with code ${createClassSubjectDto.subjectCode} not found`,
      );
    }

    // Validate teacher if provided
    if (createClassSubjectDto.teacherId) {
      const teacher = await this.teacherModel.findByPk(
        createClassSubjectDto.teacherId,
      );

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${createClassSubjectDto.teacherId} not found`,
        );
      }
    }

    // Check for duplicate assignment
    const existingAssignment = await this.classSubjectModel.findOne({
      where: {
        classSectionCode: createClassSubjectDto.classSectionCode,
        subjectCode: createClassSubjectDto.subjectCode,
      },
    });

    if (existingAssignment) {
      throw new ConflictException(
        `Subject ${createClassSubjectDto.subjectCode} is already assigned to class section ${createClassSubjectDto.classSectionCode}`,
      );
    }

    // Create class subject assignment
    return this.classSubjectModel.create({
      classSectionCode: createClassSubjectDto.classSectionCode,
      subjectCode: createClassSubjectDto.subjectCode,
      teacherId: createClassSubjectDto.teacherId,
      status: createClassSubjectDto.status,
      notes: createClassSubjectDto.notes,
    } as any);
  }

  async bulkCreate(bulkCreateDto: BulkCreateClassSubjectDto): Promise<ClassSubject[]> {
    // Validate class section exists
    const classSection = await this.classSectionModel.findByPk(
      bulkCreateDto.classSectionCode,
    );

    if (!classSection) {
      throw new NotFoundException(
        `Class section with code ${bulkCreateDto.classSectionCode} not found`,
      );
    }

    // Validate all subjects exist
    const subjectCodes = bulkCreateDto.subjects.map((s) => s.subjectCode);
    const subjects = await this.subjectModel.findAll({
      where: {
        code: subjectCodes,
      },
    });

    if (subjects.length !== subjectCodes.length) {
      throw new NotFoundException('One or more subjects not found');
    }

    // Check for existing assignments
    const existingAssignments = await this.classSubjectModel.findAll({
      where: {
        classSectionCode: bulkCreateDto.classSectionCode,
        subjectCode: subjectCodes,
      },
    });

    if (existingAssignments.length > 0) {
      const existingCodes = existingAssignments.map((a) => a.subjectCode).join(', ');
      throw new ConflictException(
        `The following subjects are already assigned: ${existingCodes}`,
      );
    }

    // Create all assignments
    const assignments = bulkCreateDto.subjects.map((subject) => ({
      classSectionCode: bulkCreateDto.classSectionCode,
      subjectCode: subject.subjectCode,
      status: 'ACTIVE',
    }));

    return this.classSubjectModel.bulkCreate(assignments as any);
  }

  async findAll(queryDto: QueryClassSubjectDto): Promise<{
    data: ClassSubject[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Build query filters
    if (queryDto.classSectionCode) {
      where.classSectionCode = queryDto.classSectionCode;
    }

    if (queryDto.subjectCode) {
      where.subjectCode = queryDto.subjectCode;
    }

    if (queryDto.teacherId) {
      where.teacherId = queryDto.teacherId;
    }

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    const { rows, count } = await this.classSubjectModel.findAndCountAll({
      where,
      include: [
        {
          model: ClassSection,
          as: 'classSection',
        },
        {
          model: Subject,
          as: 'subject',
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false,
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<ClassSubject> {
    const classSubject = await this.classSubjectModel.findByPk(id, {
      include: [
        {
          model: ClassSection,
          as: 'classSection',
        },
        {
          model: Subject,
          as: 'subject',
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false,
        },
      ],
    });

    if (!classSubject) {
      throw new NotFoundException(`Class subject with ID ${id} not found`);
    }

    return classSubject;
  }

  async findByClassSection(classSectionCode: string): Promise<ClassSubject[]> {
    return this.classSubjectModel.findAll({
      where: { classSectionCode },
      include: [
        {
          model: Subject,
          as: 'subject',
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false,
        },
      ],
      order: [['subjectCode', 'ASC']],
    });
  }

  async findBySubject(subjectCode: string): Promise<ClassSubject[]> {
    return this.classSubjectModel.findAll({
      where: { subjectCode },
      include: [
        {
          model: ClassSection,
          as: 'classSection',
        },
        {
          model: Teacher,
          as: 'teacher',
          required: false,
        },
      ],
      order: [['classSectionCode', 'ASC']],
    });
  }

  async findByTeacher(teacherId: string): Promise<ClassSubject[]> {
    return this.classSubjectModel.findAll({
      where: { teacherId },
      include: [
        {
          model: ClassSection,
          as: 'classSection',
        },
        {
          model: Subject,
          as: 'subject',
        },
      ],
      order: [['classSectionCode', 'ASC'], ['subjectCode', 'ASC']],
    });
  }

  async update(id: string, updateClassSubjectDto: UpdateClassSubjectDto): Promise<ClassSubject> {
    const classSubject = await this.findOne(id);

    // Validate teacher if provided
    if (updateClassSubjectDto.teacherId) {
      const teacher = await this.teacherModel.findByPk(
        updateClassSubjectDto.teacherId,
      );

      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${updateClassSubjectDto.teacherId} not found`,
        );
      }
    }

    const updateData = {
      teacherId: updateClassSubjectDto.teacherId,
      status: updateClassSubjectDto.status,
      notes: updateClassSubjectDto.notes,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    await classSubject.update(updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const classSubject = await this.findOne(id);
    await classSubject.destroy();
  }

  async getStats(): Promise<any> {
    const total = await this.classSubjectModel.count();
    const active = await this.classSubjectModel.count({
      where: { status: 'ACTIVE' },
    });
    const inactive = await this.classSubjectModel.count({
      where: { status: 'INACTIVE' },
    });
    const withTeacher = await this.classSubjectModel.count({
      where: {
        teacherId: {
          [Op.not]: null,
        },
      },
    });

    return {
      total,
      active,
      inactive,
      withTeacher,
      withoutTeacher: total - withTeacher,
    };
  }
}
