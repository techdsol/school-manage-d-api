import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { StudentAttendance } from '../entities/student-attendance.entity';
import { Student } from '../entities/student.entity';
import { Timetable } from '../../timetable/entities/timetable.entity';
import { ClassSection } from '../../classes/entities/class-section.entity';
import { Class } from '../../classes/entities/class.entity';
import { ClassType } from '../../classes/entities/class-type.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { CreateStudentAttendanceDto } from '../dto/student-attendance/create-student-attendance.dto';
import { UpdateStudentAttendanceDto } from '../dto/student-attendance/update-student-attendance.dto';
import { BulkCreateStudentAttendanceDto } from '../dto/student-attendance/bulk-create-student-attendance.dto';
import { QueryStudentAttendanceDto } from '../dto/student-attendance/query-student-attendance.dto';
import { QueryAttendanceCompletionDto } from '../dto/student-attendance/query-attendance-completion.dto';
import { Op } from 'sequelize';
import { StudentAssignment } from '../entities/student-assignment.entity';

@Injectable()
export class StudentAttendanceService {
  constructor(
    @InjectModel(StudentAttendance)
    private studentAttendanceModel: typeof StudentAttendance,
    @InjectModel(Timetable)
    private timetableModel: typeof Timetable,
    @InjectModel(Student)
    private studentModel: typeof Student,
    @InjectModel(StudentAssignment)
    private studentAssignmentModel: typeof StudentAssignment,
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

  async getStudentsForAttendance(
    timetableId: string,
    date?: string,
  ): Promise<any> {
    // Get timetable entry with class section details
    const timetable = await this.timetableModel.findByPk(timetableId, {
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
    });

    if (!timetable) {
      throw new NotFoundException(`Timetable entry with ID ${timetableId} not found`);
    }

    if (!timetable.requiresAttendance) {
      throw new BadRequestException('This timetable entry does not require attendance');
    }

    // Get all students enrolled in this class section
    const studentAssignments = await this.studentModel.sequelize.models.StudentAssignment.findAll({
      where: {
        classSectionCode: timetable.classSectionCode,
        status: 'ACTIVE',
      },
      include: [
        {
          model: this.studentModel,
          as: 'student',
        },
      ],
    });

    // If date is provided, get attendance status for each student
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const students = await Promise.all(
      studentAssignments.map(async (assignment: any) => {
        const attendance = await this.studentAttendanceModel.findOne({
          where: {
            timetableId,
            studentId: assignment.student.id,
            attendanceDate,
          },
        });

        return {
          id: assignment.student.id,
          name: assignment.student.name,
          phone: assignment.student.phone,
          assignmentId: assignment.id,
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
      timetable: {
        id: timetable.id,
        classSectionCode: timetable.classSectionCode,
        classSection: timetable.classSection,
        subject: timetable.subject,
        teacher: timetable.teacher,
        dayOfWeek: timetable.dayOfWeek,
        startTime: timetable.startTime,
        endTime: timetable.endTime,
        periodNumber: timetable.periodNumber,
        periodType: timetable.periodType,
        room: timetable.room,
      },
      date: attendanceDate,
      students,
      summary: {
        total: students.length,
        marked: students.filter((s) => s.attendance).length,
        unmarked: students.filter((s) => !s.attendance).length,
        present: students.filter((s) => s.attendance?.status === 'PRESENT').length,
        absent: students.filter((s) => s.attendance?.status === 'ABSENT').length,
        late: students.filter((s) => s.attendance?.status === 'LATE').length,
      },
    };
  }

  async getUnmarkedAttendance(query: {
    date?: string;
    classSectionCode?: string;
  }): Promise<any> {
    const attendanceDate = query.date || new Date().toISOString().split('T')[0];
    const dayOfWeek = new Date(attendanceDate)
      .toLocaleDateString('en-US', { weekday: 'long' })
      .toUpperCase();

    // Get timetable entries that require attendance for the specified date
    const where: any = {
      requiresAttendance: true,
      dayOfWeek,
      status: 'ACTIVE',
    };

    if (query.classSectionCode) {
      where.classSectionCode = query.classSectionCode;
    }

    const timetableEntries = await this.timetableModel.findAll({
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
      order: [['startTime', 'ASC']],
    });

    // For each timetable entry, check attendance status
    const unmarkedPeriods = await Promise.all(
      timetableEntries.map(async (timetable) => {
        // Count students in class section
        const studentCount = await this.studentModel.sequelize.models.StudentAssignment.count({
          where: {
            classSectionCode: timetable.classSectionCode,
            status: 'ACTIVE',
          },
        });

        // Count marked attendance for this period
        const markedCount = await this.studentAttendanceModel.count({
          where: {
            timetableId: timetable.id,
            attendanceDate,
          },
        });

        return {
          timetable: {
            id: timetable.id,
            classSectionCode: timetable.classSectionCode,
            classSection: timetable.classSection,
            subject: timetable.subject,
            teacher: timetable.teacher,
            startTime: timetable.startTime,
            endTime: timetable.endTime,
            periodNumber: timetable.periodNumber,
            periodType: timetable.periodType,
            room: timetable.room,
          },
          studentCount,
          markedCount,
          unmarkedCount: studentCount - markedCount,
          isComplete: studentCount === markedCount,
        };
      }),
    );

    return {
      date: attendanceDate,
      dayOfWeek,
      totalPeriods: unmarkedPeriods.length,
      completedPeriods: unmarkedPeriods.filter((p) => p.isComplete).length,
      pendingPeriods: unmarkedPeriods.filter((p) => !p.isComplete).length,
      periods: unmarkedPeriods,
    };
  }

  /**
   * Get attendance completion report for a date range
   * Shows which timetable periods have missing or incomplete attendance
   */
  async getAttendanceCompletionReport(query: QueryAttendanceCompletionDto) {
    const { startDate, endDate, classSectionCode, academicYear, minCompletionPercent } = query;

    // Build where clause for timetable
    const timetableWhere: any = {
      requiresAttendance: true,
      status: 'ACTIVE',
    };

    if (classSectionCode) {
      timetableWhere.classSectionCode = classSectionCode;
    }

    if (academicYear) {
      timetableWhere.academicYear = academicYear;
    }

    // Get all timetable entries that require attendance
    const timetableEntries = await this.timetableModel.findAll({
      where: timetableWhere,
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
        { model: Subject },
        { model: Teacher },
      ],
      order: [['classSectionCode', 'ASC'], ['dayOfWeek', 'ASC'], ['startTime', 'ASC']],
    });

    // Generate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dates: Date[] = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date));
    }

    // Map day names to numbers for comparison
    const dayMap = {
      SUNDAY: 0,
      MONDAY: 1,
      TUESDAY: 2,
      WEDNESDAY: 3,
      THURSDAY: 4,
      FRIDAY: 5,
      SATURDAY: 6,
    };

    // Group by class section
    const classSectionMap = new Map<string, any>();

    for (const timetable of timetableEntries) {
      const sectionCode = timetable.classSectionCode;

      if (!classSectionMap.has(sectionCode)) {
        // Get total enrolled students for this section
        const enrolledStudents = await this.studentAssignmentModel.count({
          where: {
            classSectionCode: sectionCode,
            status: 'ACTIVE',
          },
        });

        classSectionMap.set(sectionCode, {
          classSectionCode: sectionCode,
          className: timetable.classSection?.classDetails?.name || 'Unknown',
          sectionName: timetable.classSection?.section || 'Unknown',
          classType: timetable.classSection?.classDetails?.classTypeDetails?.type || 'Unknown',
          totalStudents: enrolledStudents,
          periods: [],
          dailySummary: new Map<string, any>(),
        });
      }
    }

    // Process each date and timetable entry
    for (const date of dates) {
      const dayOfWeek = Object.keys(dayMap).find(
        key => dayMap[key] === date.getDay()
      );
      const dateStr = date.toISOString().split('T')[0];

      for (const timetable of timetableEntries) {
        if (timetable.dayOfWeek !== dayOfWeek) {
          continue; // Skip if not matching day
        }

        const sectionCode = timetable.classSectionCode;
        const sectionData = classSectionMap.get(sectionCode);

        // Count attendance records for this timetable + date
        const attendanceRecords = await this.studentAttendanceModel.findAll({
          where: {
            timetableId: timetable.id,
            attendanceDate: dateStr,
          },
        });

        const markedCount = attendanceRecords.length;
        const expectedCount = sectionData.totalStudents;
        const completionPercent = expectedCount > 0
          ? Math.round((markedCount / expectedCount) * 100)
          : 0;

        // Count by status
        const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
        const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;
        const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length;

        // Determine status
        let status = 'NOT_MARKED';
        if (completionPercent === 100) {
          status = 'COMPLETE';
        } else if (completionPercent > 0) {
          status = 'PARTIAL';
        }

        const periodData = {
          date: dateStr,
          timetableId: timetable.id,
          dayOfWeek: timetable.dayOfWeek,
          periodNumber: timetable.periodNumber,
          periodType: timetable.periodType,
          subject: timetable.subject?.name || 'N/A',
          subjectCode: timetable.subjectCode,
          teacher: timetable.teacher
            ? timetable.teacher.name
            : 'Not Assigned',
          teacherId: timetable.teacherId,
          startTime: timetable.startTime,
          endTime: timetable.endTime,
          room: timetable.room,
          expectedStudents: expectedCount,
          markedStudents: markedCount,
          completionPercent,
          status,
          presentCount,
          absentCount,
          lateCount,
        };

        sectionData.periods.push(periodData);

        // Update daily summary
        if (!sectionData.dailySummary.has(dateStr)) {
          sectionData.dailySummary.set(dateStr, {
            date: dateStr,
            dayOfWeek,
            totalPeriods: 0,
            markedPeriods: 0,
            unmarkedPeriods: 0,
            completionRate: 0,
          });
        }

        const dailyData = sectionData.dailySummary.get(dateStr);
        dailyData.totalPeriods++;

        if (status === 'COMPLETE') {
          dailyData.markedPeriods++;
        } else if (status === 'NOT_MARKED') {
          dailyData.unmarkedPeriods++;
        }
      }
    }

    // Calculate daily completion rates and convert to arrays
    const classSections = Array.from(classSectionMap.values()).map(section => {
      // Convert daily summary map to array and calculate rates
      const dailySummaryArray = Array.from(section.dailySummary.values()).map((day: any) => {
        day.completionRate = day.totalPeriods > 0
          ? Math.round((day.markedPeriods / day.totalPeriods) * 100)
          : 0;
        return day;
      });

      // Calculate overall section completion rate
      const totalPeriods = section.periods.length;
      const completedPeriods = section.periods.filter(p => p.status === 'COMPLETE').length;
      const sectionCompletionRate = totalPeriods > 0
        ? Math.round((completedPeriods / totalPeriods) * 100)
        : 0;

      return {
        ...section,
        dailySummary: dailySummaryArray,
        totalPeriods,
        completedPeriods,
        incompletePeriods: totalPeriods - completedPeriods,
        completionRate: sectionCompletionRate,
      };
    });

    // Filter by minimum completion percentage if specified
    let filteredSections = classSections;
    if (minCompletionPercent !== undefined) {
      filteredSections = classSections.filter(
        section => section.completionRate < minCompletionPercent
      );
    }

    // Calculate overall summary
    const totalPeriods = filteredSections.reduce((sum, s) => sum + s.totalPeriods, 0);
    const completedPeriods = filteredSections.reduce((sum, s) => sum + s.completedPeriods, 0);
    const incompletePeriods = totalPeriods - completedPeriods;
    const overallCompletionRate = totalPeriods > 0
      ? Math.round((completedPeriods / totalPeriods) * 100)
      : 0;

    return {
      summary: {
        startDate,
        endDate,
        totalClassSections: filteredSections.length,
        totalPeriods,
        completedPeriods,
        incompletePeriods,
        completionRate: overallCompletionRate,
      },
      classSections: filteredSections,
    };
  }
}
