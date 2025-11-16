import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TeacherAttendance } from '../entities/teacher-attendance.entity';
import { Teacher } from '../entities/teacher.entity';
import { CreateTeacherAttendanceDto } from '../dto/teacher-attendance/create-teacher-attendance.dto';
import { UpdateTeacherAttendanceDto } from '../dto/teacher-attendance/update-teacher-attendance.dto';
import { BulkCreateTeacherAttendanceDto } from '../dto/teacher-attendance/bulk-create-teacher-attendance.dto';
import { QueryTeacherAttendanceDto } from '../dto/teacher-attendance/query-teacher-attendance.dto';
import { Op } from 'sequelize';

@Injectable()
export class TeacherAttendanceService {
  constructor(
    @InjectModel(TeacherAttendance)
    private teacherAttendanceModel: typeof TeacherAttendance,
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
  ) { }

  async create(createTeacherAttendanceDto: CreateTeacherAttendanceDto): Promise<TeacherAttendance> {
    // Validate teacher exists and is active
    const teacher = await this.teacherModel.findByPk(
      createTeacherAttendanceDto.teacherId,
    );

    if (!teacher) {
      throw new NotFoundException(
        `Teacher with ID ${createTeacherAttendanceDto.teacherId} not found`,
      );
    }

    // Validate date is not in the future
    const attendanceDate = new Date(createTeacherAttendanceDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Check for duplicate attendance
    const existingAttendance = await this.teacherAttendanceModel.findOne({
      where: {
        teacherId: createTeacherAttendanceDto.teacherId,
        attendanceDate: createTeacherAttendanceDto.attendanceDate,
      },
    });

    if (existingAttendance) {
      throw new ConflictException(
        'Attendance already marked for this teacher on this date',
      );
    }

    // Create attendance record
    const attendanceData: any = {
      teacherId: createTeacherAttendanceDto.teacherId,
      attendanceDate: createTeacherAttendanceDto.attendanceDate,
      status: createTeacherAttendanceDto.status,
      checkInTime: createTeacherAttendanceDto.checkInTime,
      checkOutTime: createTeacherAttendanceDto.checkOutTime,
      notes: createTeacherAttendanceDto.notes,
      markedBy: createTeacherAttendanceDto.markedBy,
    };

    return this.teacherAttendanceModel.create(attendanceData);
  }

  async bulkCreate(bulkCreateDto: BulkCreateTeacherAttendanceDto): Promise<TeacherAttendance[]> {
    // Validate date is not in the future
    const attendanceDate = new Date(bulkCreateDto.attendanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (attendanceDate > today) {
      throw new BadRequestException('Cannot mark attendance for future dates');
    }

    // Validate all teachers exist and are active
    const teacherIds = bulkCreateDto.attendances.map((a) => a.teacherId);

    const teachers = await this.teacherModel.findAll({
      where: {
        id: teacherIds,
      },
    });

    if (teachers.length !== teacherIds.length) {
      throw new NotFoundException('One or more teachers not found');
    }

    // Check for existing attendance records
    const existingAttendance = await this.teacherAttendanceModel.findAll({
      where: {
        teacherId: teacherIds,
        attendanceDate: bulkCreateDto.attendanceDate,
      },
    });

    if (existingAttendance.length > 0) {
      throw new ConflictException(
        `Attendance already exists for ${existingAttendance.length} teacher(s) on this date`,
      );
    }

    // Create all attendance records
    const attendanceRecords: any[] = bulkCreateDto.attendances.map((attendance) => ({
      teacherId: attendance.teacherId,
      attendanceDate: bulkCreateDto.attendanceDate,
      status: attendance.status,
      checkInTime: attendance.checkInTime,
      checkOutTime: attendance.checkOutTime,
      notes: attendance.notes,
      markedBy: bulkCreateDto.markedBy,
    }));

    return this.teacherAttendanceModel.bulkCreate(attendanceRecords);
  }

  async findAll(queryDto: QueryTeacherAttendanceDto): Promise<{
    data: TeacherAttendance[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = queryDto.page || 1;
    const limit = queryDto.limit || 50;
    const offset = (page - 1) * limit;

    const where: any = {};

    // Build query filters
    if (queryDto.teacherId) {
      where.teacherId = queryDto.teacherId;
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
        model: Teacher,
        as: 'teacher',
      },
    ];

    // Add teacher name filter if needed
    if (queryDto.teacherName) {
      include[0].where = {
        name: {
          [Op.like]: `%${queryDto.teacherName}%`,
        },
      };
    }

    const { rows, count } = await this.teacherAttendanceModel.findAndCountAll({
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

  async findOne(id: string): Promise<TeacherAttendance> {
    const attendance = await this.teacherAttendanceModel.findByPk(id, {
      include: [
        {
          model: Teacher,
          as: 'teacher',
        },
      ],
    });

    if (!attendance) {
      throw new NotFoundException(`Teacher attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async update(id: string, updateTeacherAttendanceDto: UpdateTeacherAttendanceDto): Promise<TeacherAttendance> {
    const attendance = await this.findOne(id);

    const updateData = {
      status: updateTeacherAttendanceDto.status,
      checkInTime: updateTeacherAttendanceDto.checkInTime,
      checkOutTime: updateTeacherAttendanceDto.checkOutTime,
      notes: updateTeacherAttendanceDto.notes,
      markedBy: updateTeacherAttendanceDto.markedBy,
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
    teacherId?: string;
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

    if (query.teacherId) {
      where.teacherId = query.teacherId;
    }

    const attendanceRecords = await this.teacherAttendanceModel.findAll({
      where,
    });

    const stats = {
      total: attendanceRecords.length,
      present: 0,
      absent: 0,
      late: 0,
      halfDay: 0,
      onLeave: 0,
      sickLeave: 0,
      casualLeave: 0,
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
        case 'HALF_DAY':
          stats.halfDay++;
          break;
        case 'ON_LEAVE':
          stats.onLeave++;
          break;
        case 'SICK_LEAVE':
          stats.sickLeave++;
          break;
        case 'CASUAL_LEAVE':
          stats.casualLeave++;
          break;
      }
    });

    return stats;
  }

  async getMonthlyAttendance(query: {
    teacherId: string;
    month: number;
    year: number;
  }): Promise<any> {
    const startDate = new Date(query.year, query.month - 1, 1);
    const endDate = new Date(query.year, query.month, 0);

    const attendanceRecords = await this.teacherAttendanceModel.findAll({
      where: {
        teacherId: query.teacherId,
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
      teacherId: query.teacherId,
      month: query.month,
      year: query.year,
      totalDays,
      presentDays,
      absentDays: totalDays - presentDays,
      attendancePercentage: Math.round(percentage * 100) / 100,
      records: attendanceRecords,
    };
  }

  async getTeachersForAttendance(date?: string): Promise<any> {
    const attendanceDate = date || new Date().toISOString().split('T')[0];

    // Get all teachers
    const teachers = await this.teacherModel.findAll({
      order: [['name', 'ASC']],
    });

    // Get attendance for each teacher on the specified date
    const teachersWithAttendance = await Promise.all(
      teachers.map(async (teacher) => {
        const attendance = await this.teacherAttendanceModel.findOne({
          where: {
            teacherId: teacher.id,
            attendanceDate,
          },
        });

        return {
          id: teacher.id,
          name: teacher.name,
          phone: teacher.phone,
          attendance: attendance
            ? {
              id: attendance.id,
              status: attendance.status,
              checkInTime: attendance.checkInTime,
              checkOutTime: attendance.checkOutTime,
              notes: attendance.notes,
            }
            : null,
        };
      }),
    );

    return {
      date: attendanceDate,
      totalTeachers: teachers.length,
      marked: teachersWithAttendance.filter((t) => t.attendance).length,
      unmarked: teachersWithAttendance.filter((t) => !t.attendance).length,
      present: teachersWithAttendance.filter((t) => t.attendance?.status === 'PRESENT').length,
      absent: teachersWithAttendance.filter((t) => t.attendance?.status === 'ABSENT').length,
      teachers: teachersWithAttendance,
    };
  }
}
