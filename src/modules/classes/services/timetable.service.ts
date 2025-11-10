import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Timetable, DayOfWeek, TimetableStatus } from '../entities/timetable.entity';
import { ClassSection } from '../entities/class-section.entity';
import { Subject } from '../../subjects/entities/subject.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';
import { CreateTimetableDto } from '../dto/timetable/create-timetable.dto';
import { UpdateTimetableDto } from '../dto/timetable/update-timetable.dto';
import { BulkCreateMultiDayDto } from '../dto/timetable/bulk-create-multi-day.dto';
import { QueryTimetableDto } from '../dto/timetable/query-timetable.dto';
import { ValidateTimeSlotDto } from '../dto/timetable/validate-time-slot.dto';
import { Op } from 'sequelize';

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable)
    private timetableModel: typeof Timetable,
    @InjectModel(ClassSection)
    private classSectionModel: typeof ClassSection,
    @InjectModel(Subject)
    private subjectModel: typeof Subject,
    @InjectModel(Teacher)
    private teacherModel: typeof Teacher,
  ) { }

  async create(createTimetableDto: CreateTimetableDto): Promise<Timetable> {
    // Validate class section exists
    const classSection = await this.classSectionModel.findOne({
      where: { code: createTimetableDto.classSectionCode },
    });
    if (!classSection) {
      throw new NotFoundException(
        `Class section with code ${createTimetableDto.classSectionCode} not found`,
      );
    }

    // Validate subject exists if provided
    if (createTimetableDto.subjectCode) {
      const subject = await this.subjectModel.findOne({
        where: { code: createTimetableDto.subjectCode },
      });
      if (!subject) {
        throw new NotFoundException(
          `Subject with code ${createTimetableDto.subjectCode} not found`,
        );
      }
    }

    // Validate teacher exists if provided
    if (createTimetableDto.teacherId) {
      const teacher = await this.teacherModel.findByPk(createTimetableDto.teacherId);
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${createTimetableDto.teacherId} not found`,
        );
      }
    }

    // Validate start time is before end time
    if (createTimetableDto.startTime >= createTimetableDto.endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for time conflicts with class schedule
    const hasClassConflict = await this.checkTimeConflict(
      createTimetableDto.classSectionCode,
      createTimetableDto.dayOfWeek,
      createTimetableDto.startTime,
      createTimetableDto.endTime,
      createTimetableDto.academicYear,
    );
    if (hasClassConflict) {
      throw new ConflictException(
        `Time conflict detected for class ${createTimetableDto.classSectionCode} on ${createTimetableDto.dayOfWeek} from ${createTimetableDto.startTime} to ${createTimetableDto.endTime}`,
      );
    }

    // Check for teacher conflicts if teacher is assigned
    if (createTimetableDto.teacherId) {
      const hasTeacherConflict = await this.checkTeacherConflict(
        createTimetableDto.teacherId,
        createTimetableDto.dayOfWeek,
        createTimetableDto.startTime,
        createTimetableDto.endTime,
        createTimetableDto.academicYear,
      );
      if (hasTeacherConflict) {
        throw new ConflictException(
          `Teacher is already assigned to another class at this time`,
        );
      }
    }

    return this.timetableModel.create(createTimetableDto as any);
  }

  async bulkCreateMultiDay(dto: BulkCreateMultiDayDto): Promise<Timetable[]> {
    // Validate class section exists
    const classSection = await this.classSectionModel.findOne({
      where: { code: dto.classSectionCode },
    });
    if (!classSection) {
      throw new NotFoundException(
        `Class section with code ${dto.classSectionCode} not found`,
      );
    }

    // Validate subject exists if provided
    if (dto.subjectCode) {
      const subject = await this.subjectModel.findOne({
        where: { code: dto.subjectCode },
      });
      if (!subject) {
        throw new NotFoundException(
          `Subject with code ${dto.subjectCode} not found`,
        );
      }
    }

    // Validate teacher exists if provided
    if (dto.teacherId) {
      const teacher = await this.teacherModel.findByPk(dto.teacherId);
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${dto.teacherId} not found`,
        );
      }
    }

    const createdPeriods: Timetable[] = [];
    const errors: string[] = [];

    for (const period of dto.periods) {
      try {
        // Validate start time is before end time
        if (period.startTime >= period.endTime) {
          errors.push(
            `${period.dayOfWeek}: Start time must be before end time`,
          );
          continue;
        }

        // Check for time conflicts with class schedule
        const hasClassConflict = await this.checkTimeConflict(
          dto.classSectionCode,
          period.dayOfWeek,
          period.startTime,
          period.endTime,
          dto.academicYear,
        );
        if (hasClassConflict) {
          errors.push(
            `${period.dayOfWeek} ${period.startTime}-${period.endTime}: Time conflict for class`,
          );
          continue;
        }

        // Check for teacher conflicts if teacher is assigned
        if (dto.teacherId) {
          const hasTeacherConflict = await this.checkTeacherConflict(
            dto.teacherId,
            period.dayOfWeek,
            period.startTime,
            period.endTime,
            dto.academicYear,
          );
          if (hasTeacherConflict) {
            errors.push(
              `${period.dayOfWeek} ${period.startTime}-${period.endTime}: Teacher already assigned`,
            );
            continue;
          }
        }

        const timetable = await this.timetableModel.create({
          classSectionCode: dto.classSectionCode,
          subjectCode: dto.subjectCode,
          teacherId: dto.teacherId,
          dayOfWeek: period.dayOfWeek,
          startTime: period.startTime,
          endTime: period.endTime,
          periodNumber: period.periodNumber,
          room: period.room,
          periodType: dto.periodType,
          academicYear: dto.academicYear,
          status: dto.status || TimetableStatus.ACTIVE,
          notes: dto.notes,
        } as any);

        createdPeriods.push(timetable);
      } catch (error) {
        errors.push(
          `${period.dayOfWeek} ${period.startTime}-${period.endTime}: ${error.message}`,
        );
      }
    }

    if (errors.length > 0 && createdPeriods.length === 0) {
      throw new BadRequestException(
        `Failed to create any periods. Errors: ${errors.join('; ')}`,
      );
    }

    return createdPeriods;
  }

  async findAll(query: QueryTimetableDto): Promise<{
    data: Timetable[];
    total: number;
    page: number;
    limit: number;
  }> {
    const where: any = {};

    if (query.classSectionCode) {
      where.classSectionCode = query.classSectionCode;
    }
    if (query.subjectCode) {
      where.subjectCode = query.subjectCode;
    }
    if (query.teacherId) {
      where.teacherId = query.teacherId;
    }
    if (query.dayOfWeek) {
      where.dayOfWeek = query.dayOfWeek;
    }
    if (query.periodType) {
      where.periodType = query.periodType;
    }
    if (query.academicYear) {
      where.academicYear = query.academicYear;
    }
    if (query.status) {
      where.status = query.status;
    }

    const page = query.page || 1;
    const limit = query.limit || 50;
    const offset = (page - 1) * limit;

    const { rows: data, count: total } = await this.timetableModel.findAndCountAll({
      where,
      include: [
        { model: ClassSection, as: 'classSection' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher' },
      ],
      limit,
      offset,
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Timetable> {
    const timetable = await this.timetableModel.findByPk(id, {
      include: [
        { model: ClassSection, as: 'classSection' },
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher' },
      ],
    });

    if (!timetable) {
      throw new NotFoundException(`Timetable with ID ${id} not found`);
    }

    return timetable;
  }

  async getWeeklySchedule(
    classSectionCode: string,
    academicYear: string,
    status: TimetableStatus = TimetableStatus.ACTIVE,
  ): Promise<Record<DayOfWeek, Timetable[]>> {
    const timetables = await this.timetableModel.findAll({
      where: {
        classSectionCode,
        academicYear,
        status,
      },
      include: [
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher' },
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    // Group by day of week
    const weeklySchedule: Record<DayOfWeek, Timetable[]> = {
      [DayOfWeek.MONDAY]: [],
      [DayOfWeek.TUESDAY]: [],
      [DayOfWeek.WEDNESDAY]: [],
      [DayOfWeek.THURSDAY]: [],
      [DayOfWeek.FRIDAY]: [],
      [DayOfWeek.SATURDAY]: [],
      [DayOfWeek.SUNDAY]: [],
    };

    timetables.forEach((timetable) => {
      weeklySchedule[timetable.dayOfWeek].push(timetable);
    });

    return weeklySchedule;
  }

  async getDailySchedule(
    classSectionCode: string,
    dayOfWeek: DayOfWeek,
    academicYear: string,
    status: TimetableStatus = TimetableStatus.ACTIVE,
  ): Promise<Timetable[]> {
    return this.timetableModel.findAll({
      where: {
        classSectionCode,
        dayOfWeek,
        academicYear,
        status,
      },
      include: [
        { model: Subject, as: 'subject' },
        { model: Teacher, as: 'teacher' },
      ],
      order: [['startTime', 'ASC']],
    });
  }

  async getTeacherWeeklySchedule(
    teacherId: string,
    academicYear: string,
    status: TimetableStatus = TimetableStatus.ACTIVE,
  ): Promise<Record<DayOfWeek, Timetable[]>> {
    const timetables = await this.timetableModel.findAll({
      where: {
        teacherId,
        academicYear,
        status,
      },
      include: [
        { model: ClassSection, as: 'classSection' },
        { model: Subject, as: 'subject' },
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        ['startTime', 'ASC'],
      ],
    });

    // Group by day of week
    const weeklySchedule: Record<DayOfWeek, Timetable[]> = {
      [DayOfWeek.MONDAY]: [],
      [DayOfWeek.TUESDAY]: [],
      [DayOfWeek.WEDNESDAY]: [],
      [DayOfWeek.THURSDAY]: [],
      [DayOfWeek.FRIDAY]: [],
      [DayOfWeek.SATURDAY]: [],
      [DayOfWeek.SUNDAY]: [],
    };

    timetables.forEach((timetable) => {
      weeklySchedule[timetable.dayOfWeek].push(timetable);
    });

    return weeklySchedule;
  }

  async getTeacherDailySchedule(
    teacherId: string,
    dayOfWeek: DayOfWeek,
    academicYear: string,
    status: TimetableStatus = TimetableStatus.ACTIVE,
  ): Promise<Timetable[]> {
    return this.timetableModel.findAll({
      where: {
        teacherId,
        dayOfWeek,
        academicYear,
        status,
      },
      include: [
        { model: ClassSection, as: 'classSection' },
        { model: Subject, as: 'subject' },
      ],
      order: [['startTime', 'ASC']],
    });
  }

  async update(id: string, updateTimetableDto: UpdateTimetableDto): Promise<Timetable> {
    const timetable = await this.findOne(id);

    // Validate class section if being updated
    if (updateTimetableDto.classSectionCode) {
      const classSection = await this.classSectionModel.findOne({
        where: { code: updateTimetableDto.classSectionCode },
      });
      if (!classSection) {
        throw new NotFoundException(
          `Class section with code ${updateTimetableDto.classSectionCode} not found`,
        );
      }
    }

    // Validate subject if being updated
    if (updateTimetableDto.subjectCode) {
      const subject = await this.subjectModel.findOne({
        where: { code: updateTimetableDto.subjectCode },
      });
      if (!subject) {
        throw new NotFoundException(
          `Subject with code ${updateTimetableDto.subjectCode} not found`,
        );
      }
    }

    // Validate teacher if being updated
    if (updateTimetableDto.teacherId) {
      const teacher = await this.teacherModel.findByPk(updateTimetableDto.teacherId);
      if (!teacher) {
        throw new NotFoundException(
          `Teacher with ID ${updateTimetableDto.teacherId} not found`,
        );
      }
    }

    // Validate time if being updated
    const startTime = updateTimetableDto.startTime || timetable.startTime;
    const endTime = updateTimetableDto.endTime || timetable.endTime;
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    // Check for conflicts if schedule details are being updated
    if (
      updateTimetableDto.dayOfWeek ||
      updateTimetableDto.startTime ||
      updateTimetableDto.endTime ||
      updateTimetableDto.academicYear
    ) {
      const classSectionCode = updateTimetableDto.classSectionCode || timetable.classSectionCode;
      const dayOfWeek = updateTimetableDto.dayOfWeek || timetable.dayOfWeek;
      const academicYear = updateTimetableDto.academicYear || timetable.academicYear;

      const hasClassConflict = await this.checkTimeConflict(
        classSectionCode,
        dayOfWeek,
        startTime,
        endTime,
        academicYear,
        id,
      );
      if (hasClassConflict) {
        throw new ConflictException(
          `Time conflict detected for class ${classSectionCode} on ${dayOfWeek} from ${startTime} to ${endTime}`,
        );
      }
    }

    // Check for teacher conflicts if teacher or schedule is being updated
    if (
      updateTimetableDto.teacherId ||
      updateTimetableDto.dayOfWeek ||
      updateTimetableDto.startTime ||
      updateTimetableDto.endTime ||
      updateTimetableDto.academicYear
    ) {
      const teacherId = updateTimetableDto.teacherId || timetable.teacherId;
      if (teacherId) {
        const dayOfWeek = updateTimetableDto.dayOfWeek || timetable.dayOfWeek;
        const academicYear = updateTimetableDto.academicYear || timetable.academicYear;

        const hasTeacherConflict = await this.checkTeacherConflict(
          teacherId,
          dayOfWeek,
          startTime,
          endTime,
          academicYear,
          id,
        );
        if (hasTeacherConflict) {
          throw new ConflictException(
            `Teacher is already assigned to another class at this time`,
          );
        }
      }
    }

    await timetable.update(updateTimetableDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const timetable = await this.findOne(id);
    await timetable.destroy();
  }

  async validateTimeSlot(dto: ValidateTimeSlotDto): Promise<{
    valid: boolean;
    conflicts?: {
      classConflict?: boolean;
      teacherConflict?: boolean;
      details?: string[];
    };
  }> {
    const conflicts: string[] = [];
    let hasConflict = false;

    // Validate start time is before end time
    if (dto.startTime >= dto.endTime) {
      conflicts.push('Start time must be before end time');
      hasConflict = true;
    }

    // Check class conflict
    const hasClassConflict = await this.checkTimeConflict(
      dto.classSectionCode,
      dto.dayOfWeek,
      dto.startTime,
      dto.endTime,
      dto.academicYear,
      dto.excludeId,
    );
    if (hasClassConflict) {
      conflicts.push(
        `Time slot conflicts with existing class schedule on ${dto.dayOfWeek} from ${dto.startTime} to ${dto.endTime}`,
      );
      hasConflict = true;
    }

    // Check teacher conflict if teacher is provided
    let hasTeacherConflict = false;
    if (dto.teacherId) {
      hasTeacherConflict = await this.checkTeacherConflict(
        dto.teacherId,
        dto.dayOfWeek,
        dto.startTime,
        dto.endTime,
        dto.academicYear,
        dto.excludeId,
      );
      if (hasTeacherConflict) {
        conflicts.push(
          `Teacher is already assigned to another class at this time`,
        );
        hasConflict = true;
      }
    }

    return {
      valid: !hasConflict,
      conflicts: hasConflict
        ? {
          classConflict: hasClassConflict,
          teacherConflict: hasTeacherConflict,
          details: conflicts,
        }
        : undefined,
    };
  }

  async copyToNewYear(
    oldYear: string,
    newYear: string,
    classSectionCode?: string,
  ): Promise<{ created: number; errors: string[] }> {
    const where: any = {
      academicYear: oldYear,
      status: TimetableStatus.ACTIVE,
    };

    if (classSectionCode) {
      where.classSectionCode = classSectionCode;
    }

    const oldTimetables = await this.timetableModel.findAll({ where });

    let created = 0;
    const errors: string[] = [];

    for (const oldTimetable of oldTimetables) {
      try {
        await this.timetableModel.create({
          classSectionCode: oldTimetable.classSectionCode,
          subjectCode: oldTimetable.subjectCode,
          teacherId: oldTimetable.teacherId,
          dayOfWeek: oldTimetable.dayOfWeek,
          startTime: oldTimetable.startTime,
          endTime: oldTimetable.endTime,
          periodNumber: oldTimetable.periodNumber,
          periodType: oldTimetable.periodType,
          academicYear: newYear,
          room: oldTimetable.room,
          status: TimetableStatus.ACTIVE,
          notes: oldTimetable.notes,
        } as any);
        created++;
      } catch (error) {
        errors.push(
          `Failed to copy ${oldTimetable.classSectionCode} ${oldTimetable.dayOfWeek} ${oldTimetable.startTime}: ${error.message}`,
        );
      }
    }

    return { created, errors };
  }

  private async checkTimeConflict(
    classSectionCode: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    academicYear: string,
    excludeId?: string,
  ): Promise<boolean> {
    const where: any = {
      classSectionCode,
      dayOfWeek,
      academicYear,
      status: TimetableStatus.ACTIVE,
      [Op.or]: [
        {
          // New period starts during existing period
          startTime: {
            [Op.lt]: endTime,
          },
          endTime: {
            [Op.gt]: startTime,
          },
        },
      ],
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const conflictingPeriod = await this.timetableModel.findOne({ where });
    return !!conflictingPeriod;
  }

  private async checkTeacherConflict(
    teacherId: string,
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    academicYear: string,
    excludeId?: string,
  ): Promise<boolean> {
    const where: any = {
      teacherId,
      dayOfWeek,
      academicYear,
      status: TimetableStatus.ACTIVE,
      [Op.or]: [
        {
          // New period starts during existing period
          startTime: {
            [Op.lt]: endTime,
          },
          endTime: {
            [Op.gt]: startTime,
          },
        },
      ],
    };

    if (excludeId) {
      where.id = { [Op.ne]: excludeId };
    }

    const conflictingPeriod = await this.timetableModel.findOne({ where });
    return !!conflictingPeriod;
  }
}
