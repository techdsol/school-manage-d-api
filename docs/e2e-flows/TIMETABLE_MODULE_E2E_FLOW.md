# TIMETABLE MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                   | API Endpoint                    | Method | Step |
| --------------------------- | ------------------------------- | ------ | ---- |
| Create Single Period        | `/timetable`                    | POST   | 1.1  |
| Bulk Create Multi-Day       | `/timetable/bulk-multi-day`     | POST   | 1.2  |
| View All Periods (Filtered) | `/timetable`                    | GET    | 1.3  |
| Get Today's Schedule        | `/timetable/today`              | GET    | 1.4  |
| Get Class Weekly Schedule   | `/timetable/class/:code/weekly` | GET    | 2.1  |
| Get Class Daily Schedule    | `/timetable/class/:code/daily`  | GET    | 2.2  |
| Get Teacher Weekly Schedule | `/timetable/teacher/:id/weekly` | GET    | 3.1  |
| Get Teacher Daily Schedule  | `/timetable/teacher/:id/daily`  | GET    | 3.2  |
| Validate Time Slot          | `/timetable/validate-time`      | POST   | 4.1  |
| Copy Timetable to New Year  | `/timetable/copy-year`          | POST   | 4.2  |
| View Period Details         | `/timetable/:id`                | GET    | 5.1  |
| Update Period               | `/timetable/:id`                | PATCH  | 5.2  |
| Delete Period               | `/timetable/:id`                | DELETE | 5.3  |

---

## Overview

The **Timetable Module** manages the weekly scheduling of classes, periods, and activities across the school. It provides comprehensive scheduling capabilities with conflict detection, multi-view access (class-based, teacher-based), and flexible period types.

### Key Characteristics

1. **Period-Based Scheduling**: Each timetable entry represents one period in a day
2. **Multi-Period Type Support**: Teaching, Break, Lunch, Assembly, Library, Sports, Exam, Special
3. **Conflict Detection**: Prevents double-booking of teachers and class sections
4. **Multiple View Modes**: Class schedules, teacher schedules, daily/weekly views
5. **Academic Year Bound**: All periods tied to specific academic years
6. **Attendance Integration**: Can mark periods requiring attendance tracking
7. **Bulk Operations**: Create multiple periods across days efficiently
8. **Year-to-Year Copying**: Duplicate timetables from one academic year to another

### Entity Structure

```typescript
Timetable {
  id: UUID (PK)
  classSectionCode: string (FK → ClassSection)
  subjectCode: string | null (FK → Subject, null for non-teaching periods)
  teacherId: UUID | null (FK → Teacher, null for periods without teacher)
  dayOfWeek: enum (MONDAY-SUNDAY)
  startTime: TIME (HH:mm:ss)
  endTime: TIME (HH:mm:ss)
  periodNumber: number | null (for ordering)
  periodType: enum (TEACHING, BREAK, LUNCH, ASSEMBLY, LIBRARY, SPORTS, EXAM, SPECIAL)
  academicYear: string (e.g., "2024-2025")
  room: string | null
  status: enum (ACTIVE, INACTIVE)
  requiresAttendance: boolean
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
```

### Integration Points

- **ClassSection**: Every period belongs to a class section
- **Subject**: Teaching periods reference subjects
- **Teacher**: Teaching periods can be assigned to teachers
- **StudentAttendance**: Periods with `requiresAttendance=true` generate attendance records
- **TeacherAttendance**: Teachers' attendance linked to their scheduled periods

---

## STEP 1: Single Period Creation APIs

### STEP 1.1: Create a Single Timetable Period

**Purpose**: Create one period in the timetable for a specific class section, day, and time slot.

**API Endpoint**

```http
POST /timetable
```

**Request Headers**

```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "periodNumber": 1,
  "periodType": "TEACHING",
  "academicYear": "2024-2025",
  "room": "101",
  "status": "ACTIVE",
  "requiresAttendance": true,
  "notes": "Introduction to Algebra"
}
```

**Validation Rules**

- `classSectionCode`: Required, must exist in ClassSection table
- `subjectCode`: Optional (null for non-teaching periods), must exist if provided
- `teacherId`: Optional (null for periods without assigned teacher), must exist if provided
- `dayOfWeek`: Required, must be valid DayOfWeek enum
- `startTime`: Required, must be HH:mm:ss format (e.g., "09:00:00")
- `endTime`: Required, must be HH:mm:ss format, must be after startTime
- `periodNumber`: Optional, integer >= 1
- `periodType`: Optional, defaults to TEACHING
- `academicYear`: Required, string format "YYYY-YYYY"
- `room`: Optional, max 50 characters
- `status`: Optional, defaults to ACTIVE
- `requiresAttendance`: Optional, defaults to false
- `notes`: Optional, text

**Sample Request**

```bash
curl -X POST http://localhost:3000/timetable \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "550e8400-e29b-41d4-a716-446655440001",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00:00",
    "endTime": "09:45:00",
    "periodNumber": 1,
    "periodType": "TEACHING",
    "academicYear": "2024-2025",
    "room": "101",
    "requiresAttendance": true
  }'
```

**Sample Response** (201 Created)

```json
{
  "id": "tt0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "periodNumber": 1,
  "periodType": "TEACHING",
  "academicYear": "2024-2025",
  "room": "101",
  "status": "ACTIVE",
  "requiresAttendance": true,
  "notes": null,
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z"
}
```

**Error Responses**

**400 Bad Request** - Invalid Data

```json
{
  "statusCode": 400,
  "message": [
    "startTime must be in HH:mm:ss format",
    "endTime must be after startTime"
  ],
  "error": "Bad Request"
}
```

**404 Not Found** - Related Entity Missing

```json
{
  "statusCode": 404,
  "message": "Class section '1A' not found",
  "error": "Not Found"
}
```

**409 Conflict** - Time Conflict Detected

```json
{
  "statusCode": 409,
  "message": "Time conflict: Teacher already scheduled from 09:00:00 to 09:45:00 on MONDAY",
  "error": "Conflict"
}
```

**UX Flow**

**Screen**: Create Timetable Period

```
┌──────────────────────────────────────────────────────┐
│ Add Period to Timetable                              │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Class Section: [1A ▼]                               │
│                                                      │
│ Day of Week:   [Monday ▼]                           │
│                                                      │
│ Time:          [09:00] to [09:45]                   │
│                                                      │
│ Period Type:   [Teaching ▼]                         │
│                                                      │
│ Subject:       [Mathematics ▼]                      │
│                                                      │
│ Teacher:       [John Doe ▼]                         │
│                                                      │
│ Room:          [101]                                 │
│                                                      │
│ Academic Year: [2024-2025]                          │
│                                                      │
│ Period Number: [1]                                   │
│                                                      │
│ ☑ Requires Attendance                               │
│                                                      │
│ Notes:         [Introduction to Algebra]            │
│                                                      │
│ [Validate Time Slot]  [Cancel]  [Create Period]    │
└──────────────────────────────────────────────────────┘
```

**Use Cases**

- Timetable coordinator creates periods one by one
- Admin adds special events (assembly, sports day)
- Substitute teacher assignment for specific period
- Add break/lunch periods to class schedules

---

### STEP 1.2: Bulk Create Multiple Periods Across Days

**Purpose**: Create multiple timetable periods for the same subject across different days and times in one operation.

**API Endpoint**

```http
POST /timetable/bulk-multi-day
```

**Request Body**

```json
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "academicYear": "2024-2025",
  "room": "101",
  "periodType": "TEACHING",
  "requiresAttendance": true,
  "periods": [
    {
      "dayOfWeek": "MONDAY",
      "startTime": "09:00:00",
      "endTime": "09:45:00",
      "periodNumber": 1
    },
    {
      "dayOfWeek": "WEDNESDAY",
      "startTime": "10:00:00",
      "endTime": "10:45:00",
      "periodNumber": 2
    },
    {
      "dayOfWeek": "FRIDAY",
      "startTime": "11:00:00",
      "endTime": "11:45:00",
      "periodNumber": 3
    }
  ]
}
```

**Sample Response** (201 Created)

```json
{
  "created": 3,
  "periods": [
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440001",
      "classSectionCode": "1A",
      "subjectCode": "MATH",
      "dayOfWeek": "MONDAY",
      "startTime": "09:00:00",
      "endTime": "09:45:00",
      "periodNumber": 1,
      "teacherId": "550e8400-e29b-41d4-a716-446655440001",
      "periodType": "TEACHING",
      "academicYear": "2024-2025",
      "room": "101",
      "status": "ACTIVE",
      "requiresAttendance": true,
      "createdAt": "2024-04-01T08:00:00.000Z"
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440002",
      "classSectionCode": "1A",
      "subjectCode": "MATH",
      "dayOfWeek": "WEDNESDAY",
      "startTime": "10:00:00",
      "endTime": "10:45:00",
      "periodNumber": 2,
      "teacherId": "550e8400-e29b-41d4-a716-446655440001",
      "periodType": "TEACHING",
      "academicYear": "2024-2025",
      "room": "101",
      "status": "ACTIVE",
      "requiresAttendance": true,
      "createdAt": "2024-04-01T08:00:00.000Z"
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440003",
      "classSectionCode": "1A",
      "subjectCode": "MATH",
      "dayOfWeek": "FRIDAY",
      "startTime": "11:00:00",
      "endTime": "11:45:00",
      "periodNumber": 3,
      "teacherId": "550e8400-e29b-41d4-a716-446655440001",
      "periodType": "TEACHING",
      "academicYear": "2024-2025",
      "room": "101",
      "status": "ACTIVE",
      "requiresAttendance": true,
      "createdAt": "2024-04-01T08:00:00.000Z"
    }
  ]
}
```

**Use Cases**

- Set up recurring subject periods across the week
- Create weekly schedule for a subject in one operation
- Bulk assign teacher's schedule for a class
- Efficiently configure full weekly timetable

---

### STEP 1.3: View All Timetable Periods with Filters

**Purpose**: Retrieve timetable periods with optional filters for class, subject, teacher, day, academic year, etc.

**API Endpoint**

```http
GET /timetable?classSectionCode=1A&academicYear=2024-2025&dayOfWeek=MONDAY&status=ACTIVE
```

**Query Parameters**

- `classSectionCode`: Filter by class section (optional)
- `subjectCode`: Filter by subject (optional)
- `teacherId`: Filter by teacher (optional)
- `dayOfWeek`: Filter by day (optional)
- `academicYear`: Filter by academic year (optional)
- `periodType`: Filter by period type (optional)
- `status`: Filter by status (optional)

**Sample Response** (200 OK)

```json
[
  {
    "id": "tt0e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "550e8400-e29b-41d4-a716-446655440001",
    "dayOfWeek": "MONDAY",
    "startTime": "09:00:00",
    "endTime": "09:45:00",
    "periodNumber": 1,
    "periodType": "TEACHING",
    "academicYear": "2024-2025",
    "room": "101",
    "status": "ACTIVE",
    "requiresAttendance": true,
    "notes": null,
    "classSection": {
      "code": "1A",
      "sectionName": "Section A",
      "className": "Class 1"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    },
    "teacher": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "John Doe"
    }
  }
]
```

**Use Cases**

- View all periods for a specific class section
- See all periods taught by a particular teacher
- Filter timetable by day of the week
- Audit inactive/cancelled periods

---

### STEP 1.4: Get Today's Schedule

**Purpose**: Retrieve all timetable periods scheduled for today that require attendance.

**API Endpoint**

```http
GET /timetable/today?classSectionCode=1A&academicYear=2024-2025
```

**Query Parameters**

- `classSectionCode`: Filter by class section (optional)
- `academicYear`: Filter by academic year (optional)

**Sample Response** (200 OK)

```json
{
  "date": "2024-11-12",
  "dayOfWeek": "TUESDAY",
  "periods": [
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440005",
      "classSectionCode": "1A",
      "subjectCode": "ENG",
      "teacherId": "550e8400-e29b-41d4-a716-446655440002",
      "startTime": "08:00:00",
      "endTime": "08:45:00",
      "periodNumber": 1,
      "periodType": "TEACHING",
      "room": "102",
      "requiresAttendance": true,
      "subject": {
        "code": "ENG",
        "name": "English"
      },
      "teacher": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Jane Smith"
      }
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440006",
      "classSectionCode": "1A",
      "subjectCode": "MATH",
      "teacherId": "550e8400-e29b-41d4-a716-446655440001",
      "startTime": "09:00:00",
      "endTime": "09:45:00",
      "periodNumber": 2,
      "periodType": "TEACHING",
      "room": "101",
      "requiresAttendance": true,
      "subject": {
        "code": "MATH",
        "name": "Mathematics"
      },
      "teacher": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "John Doe"
      }
    }
  ]
}
```

**Use Cases**

- Attendance module retrieves periods needing attendance today
- Teachers check their daily schedule
- Students view today's classes
- Admin monitors current day's activities

---

## STEP 2: Class Section Schedule APIs

### STEP 2.1: Get Weekly Schedule for a Class Section

**Purpose**: Retrieve the complete weekly timetable for a specific class section.

**API Endpoint**

```http
GET /timetable/class/1A/weekly?academicYear=2024-2025&status=ACTIVE
```

**Path Parameters**

- `code`: Class section code (required)

**Query Parameters**

- `academicYear`: Academic year (required)
- `status`: Filter by status (optional, defaults to showing all)

**Sample Response** (200 OK)

```json
{
  "classSectionCode": "1A",
  "academicYear": "2024-2025",
  "weeklySchedule": {
    "MONDAY": [
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440001",
        "startTime": "09:00:00",
        "endTime": "09:45:00",
        "periodNumber": 1,
        "subjectCode": "MATH",
        "subject": { "code": "MATH", "name": "Mathematics" },
        "teacherId": "550e8400-e29b-41d4-a716-446655440001",
        "teacher": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "John Doe"
        },
        "room": "101",
        "periodType": "TEACHING",
        "requiresAttendance": true
      },
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440002",
        "startTime": "10:00:00",
        "endTime": "10:15:00",
        "periodNumber": null,
        "subjectCode": null,
        "subject": null,
        "teacherId": null,
        "teacher": null,
        "room": null,
        "periodType": "BREAK",
        "requiresAttendance": false
      }
    ],
    "TUESDAY": [
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440010",
        "startTime": "08:00:00",
        "endTime": "08:45:00",
        "periodNumber": 1,
        "subjectCode": "ENG",
        "subject": { "code": "ENG", "name": "English" },
        "teacherId": "550e8400-e29b-41d4-a716-446655440002",
        "teacher": {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "name": "Jane Smith"
        },
        "room": "102",
        "periodType": "TEACHING",
        "requiresAttendance": true
      }
    ],
    "WEDNESDAY": [],
    "THURSDAY": [],
    "FRIDAY": [],
    "SATURDAY": [],
    "SUNDAY": []
  }
}
```

**UX Flow**

**Screen**: Class Weekly Timetable

```
┌────────────────────────────────────────────────────────────────────┐
│ 📅 Weekly Timetable - Class 1A (2024-2025)                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ ┌──────┬──────────┬──────────┬──────────┬──────────┬──────────┐  │
│ │ Time │ Monday   │ Tuesday  │ Wednesdy │ Thursday │  Friday  │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │ 8:00 │          │ English  │          │          │          │  │
│ │      │          │ Room 102 │          │          │          │  │
│ │      │          │ J.Smith  │          │          │          │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │ 9:00 │ Math     │ Science  │ Math     │          │ Math     │  │
│ │      │ Room 101 │ Room 103 │ Room 101 │          │ Room 101 │  │
│ │      │ J.Doe    │ A.Brown  │ J.Doe    │          │ J.Doe    │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │10:00 │  BREAK   │  BREAK   │  BREAK   │  BREAK   │  BREAK   │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │10:15 │ English  │ Math     │ English  │          │          │  │
│ │      │ Room 102 │ Room 101 │ Room 102 │          │          │  │
│ │      │ J.Smith  │ J.Doe    │ J.Smith  │          │          │  │
│ └──────┴──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                                                                    │
│ [Download PDF] [Print] [Edit Schedule]                            │
└────────────────────────────────────────────────────────────────────┘
```

**Use Cases**

- Class teacher views complete weekly schedule
- Parents check when subjects are taught
- Students plan their week
- Admin reviews class workload distribution

---

### STEP 2.2: Get Daily Schedule for a Class Section

**Purpose**: Retrieve the timetable for a specific day and class section.

**API Endpoint**

```http
GET /timetable/class/1A/daily?dayOfWeek=MONDAY&academicYear=2024-2025
```

**Path Parameters**

- `code`: Class section code (required)

**Query Parameters**

- `dayOfWeek`: Day of week (required)
- `academicYear`: Academic year (required)
- `status`: Filter by status (optional)

**Sample Response** (200 OK)

```json
{
  "classSectionCode": "1A",
  "dayOfWeek": "MONDAY",
  "academicYear": "2024-2025",
  "periods": [
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440001",
      "startTime": "09:00:00",
      "endTime": "09:45:00",
      "periodNumber": 1,
      "subjectCode": "MATH",
      "subject": { "code": "MATH", "name": "Mathematics" },
      "teacherId": "550e8400-e29b-41d4-a716-446655440001",
      "teacher": { "name": "John Doe" },
      "room": "101",
      "periodType": "TEACHING",
      "requiresAttendance": true,
      "status": "ACTIVE"
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440002",
      "startTime": "10:00:00",
      "endTime": "10:15:00",
      "periodNumber": null,
      "subjectCode": null,
      "subject": null,
      "teacherId": null,
      "teacher": null,
      "room": null,
      "periodType": "BREAK",
      "requiresAttendance": false,
      "status": "ACTIVE"
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440003",
      "startTime": "10:15:00",
      "endTime": "11:00:00",
      "periodNumber": 2,
      "subjectCode": "ENG",
      "subject": { "code": "ENG", "name": "English" },
      "teacherId": "550e8400-e29b-41d4-a716-446655440002",
      "teacher": { "name": "Jane Smith" },
      "room": "102",
      "periodType": "TEACHING",
      "requiresAttendance": true,
      "status": "ACTIVE"
    }
  ]
}
```

**Use Cases**

- View complete schedule for a specific day
- Plan daily activities
- Check room allocation for the day
- Verify period sequencing

---

## STEP 3: Teacher Schedule APIs

### STEP 3.1: Get Weekly Schedule for a Teacher

**Purpose**: Retrieve all periods assigned to a teacher across the week.

**API Endpoint**

```http
GET /timetable/teacher/550e8400-e29b-41d4-a716-446655440001/weekly?academicYear=2024-2025
```

**Path Parameters**

- `id`: Teacher UUID (required)

**Query Parameters**

- `academicYear`: Academic year (required)
- `status`: Filter by status (optional)

**Sample Response** (200 OK)

```json
{
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "teacherName": "John Doe",
  "academicYear": "2024-2025",
  "weeklySchedule": {
    "MONDAY": [
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440001",
        "classSectionCode": "1A",
        "classSection": { "code": "1A", "sectionName": "Section A" },
        "subjectCode": "MATH",
        "subject": { "code": "MATH", "name": "Mathematics" },
        "startTime": "09:00:00",
        "endTime": "09:45:00",
        "periodNumber": 1,
        "room": "101",
        "periodType": "TEACHING",
        "requiresAttendance": true
      },
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440004",
        "classSectionCode": "2B",
        "classSection": { "code": "2B", "sectionName": "Section B" },
        "subjectCode": "MATH",
        "subject": { "code": "MATH", "name": "Mathematics" },
        "startTime": "11:00:00",
        "endTime": "11:45:00",
        "periodNumber": 3,
        "room": "105",
        "periodType": "TEACHING",
        "requiresAttendance": true
      }
    ],
    "TUESDAY": [
      {
        "id": "tt0e8400-e29b-41d4-a716-446655440010",
        "classSectionCode": "1A",
        "classSection": { "code": "1A", "sectionName": "Section A" },
        "subjectCode": "MATH",
        "subject": { "code": "MATH", "name": "Mathematics" },
        "startTime": "10:00:00",
        "endTime": "10:45:00",
        "periodNumber": 2,
        "room": "101",
        "periodType": "TEACHING",
        "requiresAttendance": true
      }
    ],
    "WEDNESDAY": [],
    "THURSDAY": [],
    "FRIDAY": [],
    "SATURDAY": [],
    "SUNDAY": []
  },
  "totalPeriods": 3,
  "periodsPerDay": {
    "MONDAY": 2,
    "TUESDAY": 1,
    "WEDNESDAY": 0,
    "THURSDAY": 0,
    "FRIDAY": 0,
    "SATURDAY": 0,
    "SUNDAY": 0
  }
}
```

**UX Flow**

**Screen**: Teacher Weekly Schedule

```
┌────────────────────────────────────────────────────────────────────┐
│ 👨‍🏫 Teacher Schedule - John Doe (2024-2025)                         │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Total Teaching Periods: 15 per week                               │
│                                                                    │
│ ┌──────┬──────────┬──────────┬──────────┬──────────┬──────────┐  │
│ │ Time │ Monday   │ Tuesday  │ Wednesdy │ Thursday │  Friday  │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │ 8:00 │          │          │          │          │          │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │ 9:00 │ Math     │          │ Math     │ Math     │ Math     │  │
│ │      │ Class 1A │          │ Class 1A │ Class 2B │ Class 1A │  │
│ │      │ Room 101 │          │ Room 101 │ Room 105 │ Room 101 │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │10:00 │  Free    │ Math     │  Free    │  Free    │  Free    │  │
│ │      │          │ Class 1A │          │          │          │  │
│ │      │          │ Room 101 │          │          │          │  │
│ ├──────┼──────────┼──────────┼──────────┼──────────┼──────────┤  │
│ │11:00 │ Math     │  Free    │ Math     │ Math     │  Free    │  │
│ │      │ Class 2B │          │ Class 2B │ Class 1A │          │  │
│ │      │ Room 105 │          │ Room 105 │ Room 101 │          │  │
│ └──────┴──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                                                                    │
│ [Download My Schedule] [Print] [Request Changes]                  │
└────────────────────────────────────────────────────────────────────┘
```

**Use Cases**

- Teacher checks their weekly teaching load
- Admin verifies teacher workload balance
- HR reviews teacher schedules for planning
- Substitute teacher sees periods to cover

---

### STEP 3.2: Get Daily Schedule for a Teacher

**Purpose**: Retrieve all periods for a teacher on a specific day.

**API Endpoint**

```http
GET /timetable/teacher/550e8400-e29b-41d4-a716-446655440001/daily?dayOfWeek=MONDAY&academicYear=2024-2025
```

**Path Parameters**

- `id`: Teacher UUID (required)

**Query Parameters**

- `dayOfWeek`: Day of week (required)
- `academicYear`: Academic year (required)
- `status`: Filter by status (optional)

**Sample Response** (200 OK)

```json
{
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "teacherName": "John Doe",
  "dayOfWeek": "MONDAY",
  "academicYear": "2024-2025",
  "periods": [
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440001",
      "classSectionCode": "1A",
      "classSection": {
        "code": "1A",
        "sectionName": "Section A",
        "className": "Class 1"
      },
      "subjectCode": "MATH",
      "subject": { "code": "MATH", "name": "Mathematics" },
      "startTime": "09:00:00",
      "endTime": "09:45:00",
      "periodNumber": 1,
      "room": "101",
      "periodType": "TEACHING",
      "requiresAttendance": true,
      "status": "ACTIVE"
    },
    {
      "id": "tt0e8400-e29b-41d4-a716-446655440004",
      "classSectionCode": "2B",
      "classSection": {
        "code": "2B",
        "sectionName": "Section B",
        "className": "Class 2"
      },
      "subjectCode": "MATH",
      "subject": { "code": "MATH", "name": "Mathematics" },
      "startTime": "11:00:00",
      "endTime": "11:45:00",
      "periodNumber": 3,
      "room": "105",
      "periodType": "TEACHING",
      "requiresAttendance": true,
      "status": "ACTIVE"
    }
  ],
  "totalPeriods": 2
}
```

**Use Cases**

- Teacher views today's classes
- Attendance system shows periods needing teacher present
- Daily lesson planning
- Check specific day workload

---

## STEP 4: Validation & Utility APIs

### STEP 4.1: Validate Time Slot for Conflicts

**Purpose**: Check if a proposed time slot is available without creating the period. Useful for frontend validation before submission.

**API Endpoint**

```http
POST /timetable/validate-time
```

**Request Body**

```json
{
  "classSectionCode": "1A",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "dayOfWeek": "MONDAY",
  "startTime": "14:00:00",
  "endTime": "14:45:00",
  "academicYear": "2024-2025",
  "excludeTimetableId": "tt0e8400-e29b-41d4-a716-446655440001"
}
```

**Sample Response** (200 OK) - No Conflicts

```json
{
  "valid": true,
  "conflicts": [],
  "message": "Time slot is available"
}
```

**Sample Response** (200 OK) - Conflicts Found

```json
{
  "valid": false,
  "conflicts": [
    {
      "type": "TEACHER_CONFLICT",
      "message": "Teacher already scheduled from 14:00:00 to 15:00:00",
      "conflictingPeriod": {
        "id": "tt0e8400-e29b-41d4-a716-446655440099",
        "classSectionCode": "2B",
        "subjectCode": "MATH",
        "startTime": "14:00:00",
        "endTime": "15:00:00"
      }
    },
    {
      "type": "CLASS_CONFLICT",
      "message": "Class section already has a period from 13:45:00 to 14:30:00",
      "conflictingPeriod": {
        "id": "tt0e8400-e29b-41d4-a716-446655440088",
        "classSectionCode": "1A",
        "subjectCode": "ENG",
        "startTime": "13:45:00",
        "endTime": "14:30:00"
      }
    }
  ],
  "message": "Time conflicts detected"
}
```

**Use Cases**

- Frontend validates before submission
- User gets immediate feedback on conflicts
- Admin checks availability before manual scheduling
- Prevent conflict errors during creation

---

### STEP 4.2: Copy Timetable from One Academic Year to Another

**Purpose**: Duplicate all active timetable periods from an old academic year to a new academic year, optionally filtered by class section.

**API Endpoint**

```http
POST /timetable/copy-year
```

**Request Body**

```json
{
  "oldYear": "2023-2024",
  "newYear": "2024-2025",
  "classSectionCode": "1A"
}
```

**Sample Response** (201 Created)

```json
{
  "copied": 45,
  "oldYear": "2023-2024",
  "newYear": "2024-2025",
  "classSectionCode": "1A",
  "message": "Successfully copied 45 periods from 2023-2024 to 2024-2025 for class section 1A"
}
```

**Use Cases**

- Start new academic year with previous year's schedule
- Quickly set up timetable for new year
- Copy proven working schedules
- Bulk migration of scheduling data

---

## STEP 5: Individual Period Management APIs

### STEP 5.1: Get Timetable Period by ID

**Purpose**: Retrieve detailed information about a specific timetable period.

**API Endpoint**

```http
GET /timetable/tt0e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (200 OK)

```json
{
  "id": "tt0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "periodNumber": 1,
  "periodType": "TEACHING",
  "academicYear": "2024-2025",
  "room": "101",
  "status": "ACTIVE",
  "requiresAttendance": true,
  "notes": "Introduction to Algebra",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z",
  "classSection": {
    "code": "1A",
    "sectionName": "Section A",
    "className": "Class 1"
  },
  "subject": {
    "code": "MATH",
    "name": "Mathematics"
  },
  "teacher": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "John Doe",
    "phone": "+91-98765-43210"
  }
}
```

**Error Responses**

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Timetable period with ID 'tt0e8400-e29b-41d4-a716-446655440001' not found",
  "error": "Not Found"
}
```

---

### STEP 5.2: Update Timetable Period

**Purpose**: Modify an existing timetable period (time, teacher, room, etc.).

**API Endpoint**

```http
PATCH /timetable/tt0e8400-e29b-41d4-a716-446655440001
```

**Request Body** (Partial Update)

```json
{
  "teacherId": "550e8400-e29b-41d4-a716-446655440002",
  "room": "103",
  "notes": "Updated teacher assignment"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "tt0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440002",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "periodNumber": 1,
  "periodType": "TEACHING",
  "academicYear": "2024-2025",
  "room": "103",
  "status": "ACTIVE",
  "requiresAttendance": true,
  "notes": "Updated teacher assignment",
  "updatedAt": "2024-04-15T14:30:00.000Z"
}
```

**Error Responses**

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Timetable period not found",
  "error": "Not Found"
}
```

**409 Conflict** - Time Conflict After Update

```json
{
  "statusCode": 409,
  "message": "Time conflict: New teacher already scheduled at this time",
  "error": "Conflict"
}
```

**Use Cases**

- Substitute teacher assignment
- Room change due to maintenance
- Update period timing
- Mark period as inactive/cancelled

---

### STEP 5.3: Delete Timetable Period

**Purpose**: Remove a timetable period from the schedule.

**API Endpoint**

```http
DELETE /timetable/tt0e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (204 No Content)

```
(Empty response body)
```

**Error Responses**

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Timetable period not found",
  "error": "Not Found"
}
```

**Use Cases**

- Cancel a period
- Remove outdated schedule entries
- Delete test/draft periods
- Clean up after schedule reorganization

---

## Complete Workflow Examples

### Workflow 1: Set Up Weekly Schedule for a New Class

**Scenario**: Admin needs to create a complete weekly timetable for Class 1A for the 2024-2025 academic year.

**Steps**:

1. **Create Morning Assembly** (Same for all days)

```bash
POST /timetable/bulk-multi-day
{
  "classSectionCode": "1A",
  "subjectCode": null,
  "teacherId": null,
  "academicYear": "2024-2025",
  "periodType": "ASSEMBLY",
  "requiresAttendance": true,
  "periods": [
    { "dayOfWeek": "MONDAY", "startTime": "08:00:00", "endTime": "08:15:00" },
    { "dayOfWeek": "TUESDAY", "startTime": "08:00:00", "endTime": "08:15:00" },
    { "dayOfWeek": "WEDNESDAY", "startTime": "08:00:00", "endTime": "08:15:00" },
    { "dayOfWeek": "THURSDAY", "startTime": "08:00:00", "endTime": "08:15:00" },
    { "dayOfWeek": "FRIDAY", "startTime": "08:00:00", "endTime": "08:15:00" }
  ]
}
```

2. **Create Mathematics Periods** (Monday, Wednesday, Friday)

```bash
POST /timetable/bulk-multi-day
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "550e8400-e29b-41d4-a716-446655440001",
  "academicYear": "2024-2025",
  "room": "101",
  "periodType": "TEACHING",
  "requiresAttendance": true,
  "periods": [
    { "dayOfWeek": "MONDAY", "startTime": "08:15:00", "endTime": "09:00:00", "periodNumber": 1 },
    { "dayOfWeek": "WEDNESDAY", "startTime": "08:15:00", "endTime": "09:00:00", "periodNumber": 1 },
    { "dayOfWeek": "FRIDAY", "startTime": "08:15:00", "endTime": "09:00:00", "periodNumber": 1 }
  ]
}
```

3. **Create Break Periods** (All weekdays)

```bash
POST /timetable/bulk-multi-day
{
  "classSectionCode": "1A",
  "periodType": "BREAK",
  "academicYear": "2024-2025",
  "requiresAttendance": false,
  "periods": [
    { "dayOfWeek": "MONDAY", "startTime": "10:00:00", "endTime": "10:15:00" },
    { "dayOfWeek": "TUESDAY", "startTime": "10:00:00", "endTime": "10:15:00" },
    { "dayOfWeek": "WEDNESDAY", "startTime": "10:00:00", "endTime": "10:15:00" },
    { "dayOfWeek": "THURSDAY", "startTime": "10:00:00", "endTime": "10:15:00" },
    { "dayOfWeek": "FRIDAY", "startTime": "10:00:00", "endTime": "10:15:00" }
  ]
}
```

4. **Repeat for other subjects** (English, Science, etc.)

5. **Verify Weekly Schedule**

```bash
GET /timetable/class/1A/weekly?academicYear=2024-2025
```

---

### Workflow 2: Handle Teacher Absence and Substitute Assignment

**Scenario**: Regular teacher (John Doe) is absent on Monday. Need to assign substitute teacher for Math period.

**Steps**:

1. **Find Math period on Monday**

```bash
GET /timetable/class/1A/daily?dayOfWeek=MONDAY&academicYear=2024-2025
```

2. **Check substitute teacher availability**

```bash
GET /timetable/teacher/550e8400-e29b-41d4-a716-446655440003/daily?dayOfWeek=MONDAY&academicYear=2024-2025
```

3. **Validate substitute can take the period**

```bash
POST /timetable/validate-time
{
  "classSectionCode": "1A",
  "teacherId": "550e8400-e29b-41d4-a716-446655440003",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00:00",
  "endTime": "09:45:00",
  "academicYear": "2024-2025"
}
```

4. **Update period with substitute teacher**

```bash
PATCH /timetable/tt0e8400-e29b-41d4-a716-446655440001
{
  "teacherId": "550e8400-e29b-41d4-a716-446655440003",
  "notes": "Substitute teacher - original teacher absent"
}
```

---

### Workflow 3: Start New Academic Year with Previous Year's Schedule

**Scenario**: New academic year 2025-2026 is starting. Copy entire timetable from 2024-2025.

**Steps**:

1. **Copy all timetables for all classes**

```bash
POST /timetable/copy-year
{
  "oldYear": "2024-2025",
  "newYear": "2025-2026"
}
```

2. **Review copied timetables**

```bash
GET /timetable?academicYear=2025-2026
```

3. **Make adjustments** (new teachers, room changes, etc.)

```bash
PATCH /timetable/:id
{
  "teacherId": "new-teacher-id",
  "room": "new-room"
}
```

---

## Integration Examples

### Integration 1: Timetable + Student Attendance

When a student's attendance is marked, the system references the timetable:

**Flow**:

1. Get today's periods requiring attendance

```bash
GET /timetable/today?classSectionCode=1A&academicYear=2024-2025
```

2. For each period with `requiresAttendance: true`, create attendance record

```bash
POST /attendance/students
{
  "timetableId": "tt0e8400-e29b-41d4-a716-446655440001",
  "studentId": "550e8400-e29b-41d4-a716-446655440010",
  "attendanceDate": "2024-11-12",
  "status": "PRESENT"
}
```

---

### Integration 2: Timetable + Teacher Workload Analysis

Calculate teacher teaching hours per week:

**Flow**:

1. Get teacher's weekly schedule

```bash
GET /timetable/teacher/550e8400-e29b-41d4-a716-446655440001/weekly?academicYear=2024-2025
```

2. Calculate total hours from all periods
3. Compare against workload guidelines (e.g., max 25 hours/week)
4. Display workload balance report

---

### Integration 3: Timetable + Class Subject Assignment

Before creating timetable periods, verify subject is assigned to class section:

**Flow**:

1. Get subjects assigned to class section

```bash
GET /class-subjects?classSectionCode=1A
```

2. Validate subject exists in assignments
3. Then create timetable period

```bash
POST /timetable
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  ...
}
```

---

## Error Handling

### Common Errors and Solutions

**Error 1: Time Conflict - Teacher Double-Booked**

```json
{
  "statusCode": 409,
  "message": "Time conflict: Teacher already scheduled from 09:00:00 to 09:45:00 on MONDAY",
  "error": "Conflict"
}
```

**Solution**: Use validation API first, adjust timing, or assign different teacher

---

**Error 2: Time Conflict - Class Section Overlap**

```json
{
  "statusCode": 409,
  "message": "Time conflict: Class section already has period from 09:00:00 to 10:00:00",
  "error": "Conflict"
}
```

**Solution**: Check daily schedule before creating, adjust time slots

---

**Error 3: Invalid Time Format**

```json
{
  "statusCode": 400,
  "message": ["startTime must be in HH:mm:ss format"],
  "error": "Bad Request"
}
```

**Solution**: Use correct format "HH:mm:ss" (e.g., "09:00:00" not "9:00")

---

**Error 4: End Time Before Start Time**

```json
{
  "statusCode": 400,
  "message": "endTime must be after startTime",
  "error": "Bad Request"
}
```

**Solution**: Ensure endTime > startTime

---

**Error 5: Referenced Entity Not Found**

```json
{
  "statusCode": 404,
  "message": "Subject with code 'MATH' not found",
  "error": "Not Found"
}
```

**Solution**: Verify subject/teacher/class section exists before assignment

---

## Testing Scenarios

### Unit Tests

**Test 1: Create Valid Timetable Period**

```typescript
describe('TimetableController - Create', () => {
  it('should create a valid timetable period', async () => {
    const dto = {
      classSectionCode: '1A',
      subjectCode: 'MATH',
      teacherId: 'valid-teacher-id',
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00:00',
      endTime: '09:45:00',
      academicYear: '2024-2025',
      periodType: PeriodType.TEACHING,
      requiresAttendance: true,
    };

    const result = await controller.create(dto);

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.classSectionCode).toBe('1A');
  });
});
```

**Test 2: Prevent Teacher Time Conflict**

```typescript
describe('TimetableService - Conflict Detection', () => {
  it('should detect teacher time conflict', async () => {
    // Create first period
    await service.create({
      teacherId: 'teacher-1',
      dayOfWeek: DayOfWeek.MONDAY,
      startTime: '09:00:00',
      endTime: '10:00:00',
      ...otherFields,
    });

    // Attempt overlapping period
    await expect(
      service.create({
        teacherId: 'teacher-1',
        dayOfWeek: DayOfWeek.MONDAY,
        startTime: '09:30:00',
        endTime: '10:30:00',
        ...otherFields,
      }),
    ).rejects.toThrow('Time conflict');
  });
});
```

---

### E2E Tests

**Test 1: Complete Weekly Schedule Creation**

```typescript
describe('Timetable E2E - Weekly Setup', () => {
  it('should create complete weekly schedule for a class', async () => {
    // Create assembly periods
    const assemblyResult = await request(app.getHttpServer())
      .post('/timetable/bulk-multi-day')
      .send({
        classSectionCode: '1A',
        periodType: 'ASSEMBLY',
        academicYear: '2024-2025',
        periods: [
          { dayOfWeek: 'MONDAY', startTime: '08:00:00', endTime: '08:15:00' },
          // ... other days
        ],
      })
      .expect(201);

    // Create teaching periods
    // ... more periods

    // Verify weekly schedule
    const scheduleResult = await request(app.getHttpServer())
      .get('/timetable/class/1A/weekly')
      .query({ academicYear: '2024-2025' })
      .expect(200);

    expect(scheduleResult.body.weeklySchedule.MONDAY.length).toBeGreaterThan(0);
  });
});
```

---

## Database Schema

### Timetable Table

```sql
CREATE TABLE timetable (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  classSectionCode VARCHAR(20) NOT NULL,
  subjectCode VARCHAR(20) NULL,
  teacherId UUID NULL,
  dayOfWeek ENUM('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY') NOT NULL,
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  periodNumber INT NULL,
  periodType ENUM('TEACHING', 'BREAK', 'LUNCH', 'ASSEMBLY', 'LIBRARY', 'SPORTS', 'EXAM', 'SPECIAL') NOT NULL DEFAULT 'TEACHING',
  academicYear VARCHAR(20) NOT NULL,
  room VARCHAR(50) NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  requiresAttendance BOOLEAN NOT NULL DEFAULT false,
  notes TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (classSectionCode) REFERENCES class_sections(code) ON DELETE CASCADE,
  FOREIGN KEY (subjectCode) REFERENCES subjects(code) ON DELETE SET NULL,
  FOREIGN KEY (teacherId) REFERENCES teachers(id) ON DELETE SET NULL,

  INDEX idx_timetable_class_section (classSectionCode),
  INDEX idx_timetable_subject (subjectCode),
  INDEX idx_timetable_teacher (teacherId),
  INDEX idx_timetable_day (dayOfWeek),
  INDEX idx_timetable_academic_year (academicYear),
  INDEX idx_timetable_schedule (classSectionCode, dayOfWeek, startTime, academicYear),
  INDEX idx_timetable_teacher_schedule (teacherId, dayOfWeek, startTime, academicYear)
);
```

---

## Best Practices

### 1. Always Validate Before Creating

```typescript
// Check for conflicts first
const validation = await validateTimeSlot(dto);
if (!validation.valid) {
  // Show conflicts to user
  return;
}

// Then create
const period = await createTimetable(dto);
```

### 2. Use Bulk Operations for Efficiency

```typescript
// Instead of 5 separate POST requests
for (const day of ['MONDAY', 'TUESDAY', ...]) {
  await createTimetable({ dayOfWeek: day, ...dto });
}

// Use bulk-multi-day
await bulkCreateMultiDay({
  ...commonFields,
  periods: [
    { dayOfWeek: 'MONDAY', ... },
    { dayOfWeek: 'TUESDAY', ... }
  ]
});
```

### 3. Handle Time Zones Consistently

```typescript
// Always use school's local time zone
// Store times in HH:mm:ss format without time zone
// Document expected time zone in API docs
```

### 4. Index Critical Query Patterns

```sql
-- Optimize class schedule queries
CREATE INDEX idx_timetable_schedule
ON timetable(classSectionCode, dayOfWeek, startTime, academicYear);

-- Optimize teacher schedule queries
CREATE INDEX idx_timetable_teacher_schedule
ON timetable(teacherId, dayOfWeek, startTime, academicYear);
```

### 5. Soft Delete vs Hard Delete

```typescript
// Consider marking periods as INACTIVE instead of deleting
await updateTimetable(id, { status: TimetableStatus.INACTIVE });

// Preserve historical data for reporting
```

---

## Summary

### Features Covered

✅ **15 API Endpoints** documented:

- Create single period
- Bulk create multi-day periods
- Query with filters
- Today's schedule
- Class weekly/daily schedules
- Teacher weekly/daily schedules
- Validate time slots
- Copy year-to-year
- Get, Update, Delete individual periods

✅ **Conflict Detection**: Teacher and class section double-booking prevention

✅ **Multi-View Support**: Class-based and teacher-based schedule views

✅ **Flexible Period Types**: Teaching, Break, Lunch, Assembly, Library, Sports, Exam, Special

✅ **Attendance Integration**: Periods marked for attendance tracking

✅ **Bulk Operations**: Efficient multi-period creation

✅ **Year-to-Year Migration**: Copy timetables to new academic years

### Use Cases Supported

- Complete weekly timetable management
- Teacher workload balancing
- Student schedule viewing
- Substitute teacher assignment
- Room allocation tracking
- Attendance period generation
- Academic year transitions
- Special event scheduling
- Conflict-free scheduling

### Data Integrity

- Foreign key constraints to ClassSection, Subject, Teacher
- Unique time slot validation (no overlaps)
- Status-based period lifecycle (ACTIVE/INACTIVE)
- Comprehensive indexing for performance
- Cascade delete handling
- Time format validation (HH:mm:ss)

---

**Last Updated**: November 12, 2024  
**Version**: 1.0  
**Status**: ✅ Complete
