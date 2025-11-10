import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentAttendance } from '../entities/student-attendance.entity';
import { Student } from '../entities/student.entity';
import { Timetable } from '../../classes/entities/timetable.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Class } from '../../classes/entities/class.entity';
import { ClassType } from '../../classes/entities/class-type.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { CreateStudentAttendanceDto } from '../dto/student-attendance/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from '../dto/student-attendance/update-student-attendance.dto';
import { BulkCreateStudentAttendanceDto } from '../dto/student-attendance/bulk-create-student-attendance.dto';
import { QueryStudentAttendanceDto } from '../dto/student-attendance/query-student-attendance.dto';
import { Op } from 'sequelize';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectModel(StudentAttendance)
    private studentAttendanceModel: typeof StudentAttendance,
    @InjectModel(Timetable)
    private timetableModel: typeof Timetable,
    @InjectModel(Student)
    private studentModel: typeof Student,
  ) { }

  async create(createStudentAttendanceDto: CreateStudentAttendanceDto): Promise<StudentAttendance> {
    // Validate timetable entry exists and requires attendance
    const timetable = await this.timetableModel.findByPk(
      createStudentAttendanceDto.timetableId,
      {
        include: [
          {
            model: ClassSection,
            include: [
              {
                model: Class,
                include: [ClassType],
              },
            ],
          },
        ],
      },
    );

    if (!timetable) {
      throw new NotFoundException(
        `Timetable entry with ID ${createStudentAttendanceDto.timetableId} not found`,
      );
    }

    if (!timetable.requiresAttendance) {
      throw new BadRequestException(
        'This timetable entry does not require attendance tracking',
      );
    }

    // Validate student exists
    const student = await this.studentModel.findByPk(createStudentAttendanceDto.studentId);
    if (!student) {
      throw new NotFoundException(
        `Student with ID ${createStudentAttendanceDto.studentId} not found`,
      );
    }

    // Validate date is not in the future
    const attendanceDate = new Date(createStudentAttendanceDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Get class type to determine validation rules
    const classType = timetable.classSection?.classDetails?.classTypeDetails?.code;

    // Check for duplicate attendance based on class type
    if (classType === 'CURR') {
      // For curricular: check if attendance already exists on this date for this student in this section
      const existingAttendance = await this.studentAttendanceModel.findOne({
        where: {
          studentId: createStudentAttendanceDto.studentId,
          attendanceDate: createStudentAttendanceDto.attendanceDate,
        },
        include: [
          {
            model: Timetable,
            where: {
              classSectionCode: timetable.classSectionCode,
            },
          },
        ],
      });

      if (existingAttendance) {
        throw new ConflictException(
          'Attendance already marked for this student on this date (curricular classes allow only one attendance per day)',
        );
      }
    } else if (classType === 'EXTR') {
      // For extra-curricular: check unique constraint on (timetableId + studentId)
      const existingAttendance = await this.studentAttendanceModel.findOne({
        where: {
          timetableId: createStudentAttendanceDto.timetableId,
          studentId: createStudentAttendanceDto.studentId,
        },
      });

      if (existingAttendance) {
        throw new ConflictException(
          'Attendance already marked for this student in this timetable entry',
        );
      }
    }

    // Create attendance record
    const attendanceData: any = {
      timetableId: createStudentAttendanceDto.timetableId,
      studentId: createStudentAttendanceDto.studentId,
      attendanceDate: createStudentAttendanceDto.attendanceDate,
      status: createStudentAttendanceDto.status,
      checkInTime: createStudentAttendanceDto.checkInTime,
      checkOutTime: createStudentAttendanceDto.checkOutTime,
      notes: createStudentAttendanceDto.notes,
      markedBy: createStudentAttendanceDto.markedBy,
    };

    return this.studentAttendanceModel.create(attendanceData);
  }

  async bulkCreate(bulkCreateDto: BulkCreateStudentAttendanceDto): Promise<StudentAttendance[]> {
    // Validate timetable entry exists and requires attendance
    const timetable = await this.timetableModel.findByPk(
      bulkCreateDto.timetableId,
      {
        include: [
          {
            model: ClassSection,
            include: [
              {
                model: Class,
                include: [ClassType],
              },
            ],
          },
        ],
      },
    );

    if (!timetable) {
      throw new NotFoundException(
        `Timetable entry with ID ${bulkCreateDto.timetableId} not found`,
      );
    }

    if (!timetable.requiresAttendance) {
      throw new BadRequestException(
        'This timetable entry does not require attendance tracking',
      );
    }

    // Validate date is not in the future
    const attendanceDate = new Date(bulkCreateDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Validate all students exist
    const studentIds = bulkCreateDto.attendances.map((a) => a.studentId);
    const students = await this.studentModel.findAll({
      where: {
        id: studentIds,
      },
    });

    if (students.length !== studentIds.length) {
      throw new NotFoundException('One or more students not found');
    }

    // Get class type to determine validation rules
    const classType = timetable.classSection?.classDetails?.classTypeDetails?.code;

    // Check for existing attendance based on class type
    if (classType === 'CURR') {
      // For curricular: check if any student already has attendance on this date in this section
      const existingAttendance = await this.studentAttendanceModel.findAll({
        where: {
          studentId: studentIds,
          attendanceDate: bulkCreateDto.attendanceDate,
        },
        include: [
          {
            model: Timetable,
            where: {
              classSectionCode: timetable.classSectionCode,
            },
          },
        ],
      });

      if (existingAttendance.length > 0) {
        throw new ConflictException(
          `Attendance already exists for ${existingAttendance.length} student(s) on this date`,
        );
      }
    } else if (classType === 'EXTR') {
      // For extra-curricular: check unique constraint on (timetableId + studentId)
      const existingAttendance = await this.studentAttendanceModel.findAll({
        where: {
          timetableId: bulkCreateDto.timetableId,
          studentId: studentIds,
        },
      });

      if (existingAttendance.length > 0) {
        throw new ConflictException(
          `Attendance already marked for ${existingAttendance.length} student(s) in this timetable entry`,
        );
      }
    }

    // Create all attendance records
    const attendanceRecords: any[] = bulkCreateDto.attendances.map((attendance) => ({
      timetableId: bulkCreateDto.timetableId,
      studentId: attendance.studentId,
      attendanceDate: bulkCreateDto.attendanceDate,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      notes: attendance.notes,
      markedBy: bulkCreateDto.markedBy,
    }));

    return this.studentAttendanceModel.bulkCreate(attendanceRecords);
  }

  async findAll(queryDto: QueryStudentAttendanceDto): Promise<{
    data: StudentAttendance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Build query filters
    if (queryDto.timetableId) {
      where.timetableId = queryDto.timetableId;
    }

    if (queryDto.studentId) {
      where.studentId = queryDto.studentId;
    }

    if (queryDto.attendanceDate) {
      where.attendanceDate = queryDto.attendanceDate;
    }

    if (queryDto.startDate && queryDto.endDate) {
      where.attendanceDate = {
        [Op.between]: [queryDto.startDate, queryDto.endDate],
      };
    } else if (queryDto.startDate) {
      where.attendanceDate = {
        [Op.gte]: queryDto.startDate,
      };
    } else if (queryDto.endDate) {
      where.attendanceDate = {
        [Op.lte]: queryDto.endDate,
      };
    }

    if (queryDto.status) {
      where.status = queryDto.status;
    }

    // Build include filters
    const include: any = [
      {
        model: Timetable,
        include: [
          {
            model: ClassSection,
            include: [
              {
                model: Class,
                include: [ClassType],
              },
            ],
          },
          {
            model: Subject,
          },
          {
            model: Teacher,
          },
        ],
      },
      {
        model: Student,
      },
      {
        model: Teacher,
        as: 'teacher',
      },
    ];

    // Add filter for class section code if provided
    if (queryDto.classSectionCode) {
      include[0].where = { classSectionCode: queryDto.classSectionCode };
    }

    const { rows, count } = await this.studentAttendanceModel.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['attendanceDate', 'DESC'], ['createdAt', 'DESC']],
    });

    return {
      data: rows,
      total: count,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<StudentAttendance> {
    const attendance = await this.studentAttendanceModel.findByPk(id, {
      include: [
        {
          model: Timetable,
          include: [
            {
              model: ClassSection,
              include: [
                {
                  model: Class,
                  include: [ClassType],
                },
              ],
            },
            {
              model: Subject,
            },
            {
              model: Teacher,
            },
          ],
        },
        {
          model: Student,
        },
        {
          model: Teacher,
          as: 'teacher',
        },
      ],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async update(id: string, updateStudentAttendanceDto: UpdateStudentAttendanceDto): Promise<StudentAttendance> {
    const attendance = await this.findOne(id);

    const updateData = {
      status: updateStudentAttendanceDto.status,
      checkInTime: updateStudentAttendanceDto.checkInTime,
      checkOutTime: updateStudentAttendanceDto.checkOutTime,
      notes: updateStudentAttendanceDto.notes,
      markedBy: updateStudentAttendanceDto.markedBy,
    };

    // Remove undefined fields
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    await attendance.update(updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const attendance = await this.findOne(id);
    await attendance.destroy();
  }

  async getAttendanceStats(query: {
    classSectionCode?: string;
    studentId?: string;
    timetableId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    const where: any = {};

    if (query.startDate && query.endDate) {
      where.attendanceDate = {
        [Op.between]: [query.startDate, query.endDate],
      };
    } else if (query.startDate) {
      where.attendanceDate = {
        [Op.gte]: query.startDate,
      };
    } else if (query.endDate) {
      where.attendanceDate = {
        [Op.lte]: query.endDate,
      };
    }

    if (query.studentId) {
      where.studentId = query.studentId;
    }

    if (query.timetableId) {
      where.timetableId = query.timetableId;
    }

    const include: any = [];

    if (query.classSectionCode) {
      include.push({
        model: Timetable,
        where: { classSectionCode: query.classSectionCode },
      });
    }

    const attendanceRecords = await this.studentAttendanceModel.findAll({
      where,
      include: include.length > 0 ? include : undefined,
    });

    const stats = {
      total: attendanceRecords.length,
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      sick: 0,
      halfDay: 0,
    };

    attendanceRecords.forEach((record) => {
      switch (record.status) {
        case 'PRESENT':
          stats.present++;
          break;
        case 'ABSENT':
          stats.absent++;
          break;
        case 'LATE':
          stats.late++;
          break;
        case 'EXCUSED':
          stats.excused++;
          break;
        case 'SICK':
          stats.sick++;
          break;
        case 'HALF_DAY':
          stats.halfDay++;
          break;
      }
    });

    return stats;
  }

  async getAttendanceRequiredPeriods(query: {
    classSectionCode?: string;
    dayOfWeek?: string;
    academicYear?: string;
  }): Promise<Timetable[]> {
    const where: any = {
      requiresAttendance: true,
    };

    if (query.classSectionCode) {
      where.classSectionCode = query.classSectionCode;
    }

    if (query.dayOfWeek) {
      where.dayOfWeek = query.dayOfWeek;
    }

    if (query.academicYear) {
      where.academicYear = query.academicYear;
    }

    return this.timetableModel.findAll({
      where,
      include: [
        {
          model: ClassSection,
          include: [
            {
              model: Class,
              include: [ClassType],
            },
          ],
        },
        {
          model: Subject,
        },
        {
          model: Teacher,
        },
      ],
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
    });
  }
}
