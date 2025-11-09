import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attendance } from '../entities/attendance.entity';
import { StudentAssignment } from '../entities/student-assignment.entity';
import { Student } from '../entities/student.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { CreateAttendanceDto } from '../dto/attendance/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/attendance/update-attendance.dto';
import { BulkCreateAttendanceDto } from '../dto/attendance/bulk-create-attendance.dto';
import { QueryAttendanceDto } from '../dto/attendance/query-attendance.dto';
import { Op } from 'sequelize';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectModel(Attendance)
    private attendanceModel: typeof Attendance,
    @InjectModel(StudentAssignment)
    private studentAssignmentModel: typeof StudentAssignment,
  ) {}

  async create(createAttendanceDto: CreateAttendanceDto): Promise<Attendance> {
    // Validate student assignment exists and is active
    const studentAssignment = await this.studentAssignmentModel.findByPk(
      createAttendanceDto.studentAssignmentId,
    );

    if (!studentAssignment) {
      throw new NotFoundException(
        `Student assignment with ID ${createAttendanceDto.studentAssignmentId} not found`,
      );
    }

    if (studentAssignment.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Cannot mark attendance for inactive student assignment',
      );
    }

    // Validate date is not in the future
    const attendanceDate = new Date(createAttendanceDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Check for duplicate attendance
    const existingAttendance = await this.attendanceModel.findOne({
      where: {
        studentAssignmentId: createAttendanceDto.studentAssignmentId,
        attendanceDate: createAttendanceDto.attendanceDate,
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        'Attendance already marked for this student on this date',
      );
    }

    // Create attendance record
    const attendanceData: any = {
      studentAssignmentId: createAttendanceDto.studentAssignmentId,
      attendanceDate: createAttendanceDto.attendanceDate,
      status: createAttendanceDto.status,
      checkInTime: createAttendanceDto.checkInTime,
      checkOutTime: createAttendanceDto.checkOutTime,
      notes: createAttendanceDto.notes,
      markedBy: createAttendanceDto.markedBy,
    };

    return this.attendanceModel.create(attendanceData);
  }

  async bulkCreate(bulkCreateDto: BulkCreateAttendanceDto): Promise<Attendance[]> {
    // Validate date is not in the future
    const attendanceDate = new Date(bulkCreateDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Validate all student assignments exist and are active
    const studentAssignmentIds = bulkCreateDto.attendances.map(
      (a) => a.studentAssignmentId,
    );

    const studentAssignments = await this.studentAssignmentModel.findAll({
      where: {
        id: studentAssignmentIds,
      },
    });

    if (studentAssignments.length !== studentAssignmentIds.length) {
      throw new NotFoundException('One or more student assignments not found');
    }

    const inactiveAssignments = studentAssignments.filter(
      (sa) => sa.status !== 'ACTIVE',
    );

    if (inactiveAssignments.length > 0) {
      throw new BadRequestException(
        'Cannot mark attendance for inactive student assignments',
      );
    }

    // Check for existing attendance records
    const existingAttendance = await this.attendanceModel.findAll({
      where: {
        studentAssignmentId: studentAssignmentIds,
        attendanceDate: bulkCreateDto.attendanceDate,
      },
    });

    if (existingAttendance.length > 0) {
      throw new ConflictException(
        `Attendance already exists for ${existingAttendance.length} student(s) on this date`,
      );
    }

    // Create all attendance records
    const attendanceRecords: any[] = bulkCreateDto.attendances.map((attendance) => ({
      studentAssignmentId: attendance.studentAssignmentId,
      attendanceDate: bulkCreateDto.attendanceDate,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      notes: attendance.notes,
      markedBy: bulkCreateDto.markedBy,
    }));

    return this.attendanceModel.bulkCreate(attendanceRecords);
  }

  async findAll(queryDto: QueryAttendanceDto): Promise<{
    data: Attendance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Build query filters
    if (queryDto.studentAssignmentId) {
      where.studentAssignmentId = queryDto.studentAssignmentId;
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

    // Build include filters for student assignment
    const include: any = [
      {
        model: StudentAssignment,
        as: 'studentAssignment',
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
      },
    ];

    // Add filters through associations if needed
    if (queryDto.studentId) {
      include[0].where = { studentId: queryDto.studentId };
    }

    if (queryDto.classSectionCode) {
      include[0].where = {
        ...include[0].where,
        classSectionCode: queryDto.classSectionCode,
      };
    }

    const { rows, count } = await this.attendanceModel.findAndCountAll({
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

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceModel.findByPk(id, {
      include: [
        {
          model: StudentAssignment,
          as: 'studentAssignment',
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
        },
      ],
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async update(id: string, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);

    const updateData = {
      status: updateAttendanceDto.status,
      checkInTime: updateAttendanceDto.checkInTime,
      checkOutTime: updateAttendanceDto.checkOutTime,
      notes: updateAttendanceDto.notes,
      markedBy: updateAttendanceDto.markedBy,
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
    studentAssignmentId?: string;
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

    if (query.studentAssignmentId) {
      where.studentAssignmentId = query.studentAssignmentId;
    }

    const include: any = [];

    if (query.classSectionCode) {
      include.push({
        model: StudentAssignment,
        as: 'studentAssignment',
        where: { classSectionCode: query.classSectionCode },
      });
    }

    const attendanceRecords = await this.attendanceModel.findAll({
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

  async getMonthlyAttendance(query: {
    studentAssignmentId: string;
    month: number;
    year: number;
  }): Promise<any> {
    const startDate = new Date(query.year, query.month - 1, 1);
    const endDate = new Date(query.year, query.month, 0);

    const attendanceRecords = await this.attendanceModel.findAll({
      where: {
        studentAssignmentId: query.studentAssignmentId,
        attendanceDate: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['attendanceDate', 'ASC']],
    });

    const totalDays = attendanceRecords.length;
    const presentDays = attendanceRecords.filter(
      (r) => r.status === 'PRESENT' || r.status === 'LATE',
    ).length;

    const percentage = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

    return {
      studentAssignmentId: query.studentAssignmentId,
      month: query.month,
      year: query.year,
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage: Math.round(percentage * 100) / 100,
      records: attendanceRecords,
    };
  }
}
