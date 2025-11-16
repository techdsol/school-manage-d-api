# TEACHERS MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                      | API Endpoint                                                     | Method | Step |
| ------------------------------ | ---------------------------------------------------------------- | ------ | ---- |
| **Teacher Management**         |                                                                  |        |      |
| View All Teachers              | `/teachers`                                                      | GET    | 1.1  |
| Create New Teacher             | `/teachers`                                                      | POST   | 1.2  |
| View Teacher Details           | `/teachers/:id`                                                  | GET    | 1.3  |
| Update Teacher                 | `/teachers/:id`                                                  | PATCH  | 1.4  |
| Delete Teacher                 | `/teachers/:id`                                                  | DELETE | 1.5  |
| Get Teachers Count             | `/teachers/stats/count`                                          | GET    | 1.6  |
| **Teacher Attendance**         |                                                                  |        |      |
| View All Attendance            | `/teachers/attendance`                                           | GET    | 2.1  |
| Mark Attendance                | `/teachers/attendance`                                           | POST   | 2.2  |
| Bulk Mark Attendance           | `/teachers/attendance/bulk`                                      | POST   | 2.3  |
| Get Attendance Stats           | `/teachers/attendance/stats`                                     | GET    | 2.4  |
| Get Teachers for Marking       | `/teachers/attendance/list-for-marking`                          | GET    | 2.5  |
| Get Monthly Summary            | `/teachers/attendance/monthly`                                   | GET    | 2.6  |
| Get Attendance Details         | `/teachers/attendance/:id`                                       | GET    | 2.7  |
| Update Attendance              | `/teachers/attendance/:id`                                       | PATCH  | 2.8  |
| Delete Attendance              | `/teachers/attendance/:id`                                       | DELETE | 2.9  |
| **Teacher Specializations**    |                                                                  |        |      |
| View All Specializations       | `/teacher-specializations`                                       | GET    | 3.1  |
| Create Specialization          | `/teacher-specializations`                                       | POST   | 3.2  |
| Get by Teacher                 | `/teacher-specializations/teacher/:teacherId`                    | GET    | 3.3  |
| Get by Class                   | `/teacher-specializations/class/:classCode`                      | GET    | 3.4  |
| Get by Subject                 | `/teacher-specializations/subject/:subjectCode`                  | GET    | 3.5  |
| Find Teachers by Class+Subject | `/teacher-specializations/class/:classCode/subject/:subjectCode` | GET    | 3.6  |
| Get Specialization Details     | `/teacher-specializations/:id`                                   | GET    | 3.7  |
| Update Specialization          | `/teacher-specializations/:id`                                   | PATCH  | 3.8  |
| Delete Specialization          | `/teacher-specializations/:id`                                   | DELETE | 3.9  |

---

## Overview

The **Teachers Module** is a core component of the school management system that manages teacher records, class assignments, and attendance tracking. It provides comprehensive teacher lifecycle management from hiring through retirement.

### Key Characteristics

1. **Teacher Master Data**: Central repository for all teacher information
2. **Attendance Tracking**: Daily attendance marking and reporting
3. **Class Assignment Integration**: Links to class teacher assignments
4. **UUID-Based Identification**: Uses UUIDs for teacher records
5. **Performance Monitoring**: Attendance statistics and reports

### Entity Structure

```typescript
Teacher {
  id: string (PK, UUID)
  name: string (max 100 chars)
  phone: string (max 20 chars)
  classTeacherAssignments: ClassTeacherAssignment[]
  attendances: TeacherAttendance[]
  createdAt: Date
  updatedAt: Date
}

TeacherAttendance {
  id: string (PK, UUID)
  teacherId: string (FK to Teacher)
  date: Date
  status: string (PRESENT/ABSENT/LATE/HALF_DAY/ON_LEAVE)
  remarks: string (optional)
  markedBy: string (user who marked)
  createdAt: Date
  updatedAt: Date
}
```

### Integration Points

- **ClassTeacherAssignment**: Teachers assigned as primary/secondary class teachers
- **TeacherSpecialization**: Subject expertise tracking
- **Timetable**: Teaching schedules
- **ClassSubject**: Subject assignments to class sections
- **StudentAttendance**: Teachers mark student attendance

---

## STEP 1: Teacher Management APIs

### STEP 1.1: View All Teachers

**Purpose**: Retrieve a list of all teachers in the system.

**API Endpoint**

```http
GET /teachers
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/teachers \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Sarah Anderson",
    "phone": "+91-98765-43210",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440002",
    "name": "Prof. James Miller",
    "phone": "+91-98765-43211",
    "createdAt": "2024-01-10T08:15:00.000Z",
    "updatedAt": "2024-01-10T08:15:00.000Z"
  }
]
```

**UX Mockup**

```
┌─────────────────────────────────────────────────────┐
│ 👨‍🏫 Teachers Management                   [+ Add]    │
├─────────────────────────────────────────────────────┤
│ Search: [________________]  🔍  Filter: [All ▼]    │
│                                                     │
│ ┌───────┬──────────────────┬──────────────┬──────┐ │
│ │ ID    │ Name             │ Phone        │ Act. │ │
│ ├───────┼──────────────────┼──────────────┼──────┤ │
│ │ 660e..│ Dr. Sarah Anders │ +91-98765... │[V][E]│ │
│ │ 660e..│ Prof. James Mill │ +91-98765... │[V][E]│ │
│ │ 660e..│ Ms. Priya Sharma │ +91-98765... │[V][E]│ │
│ └───────┴──────────────────┴──────────────┴──────┘ │
│                                                     │
│ Showing 3 teachers                                  │
└─────────────────────────────────────────────────────┘
```

**Use Cases**

- Admin reviews teaching staff directory
- Search for teacher before class assignment
- Export teacher list for HR records
- View teacher directory for contact information

---

### STEP 1.2: Create New Teacher

**Purpose**: Register a new teacher in the system.

**API Endpoint**

```http
POST /teachers
```

**Request Body**

```json
{
  "name": "Mr. Rajesh Kumar",
  "phone": "+91-98765-43213"
}
```

**Validation Rules**

- `name`: Required, string, max 100 characters
- `phone`: Required, string, max 20 characters

**Sample Request**

```bash
curl -X POST http://localhost:3000/teachers \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mr. Rajesh Kumar",
    "phone": "+91-98765-43213"
  }'
```

**Sample Response** (201 Created)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440004",
  "name": "Mr. Rajesh Kumar",
  "phone": "+91-98765-43213",
  "createdAt": "2024-11-12T10:30:00.000Z",
  "updatedAt": "2024-11-12T10:30:00.000Z"
}
```

**Error Responses**

```json
// 400 Bad Request
{
  "statusCode": 400,
  "message": ["Name is required", "Phone must not exceed 20 characters"],
  "error": "Bad Request"
}
```

**UX Mockup**

```
┌─────────────────────────────────────────┐
│ Add New Teacher                    [X]  │
├─────────────────────────────────────────┤
│                                         │
│ Teacher Name *                          │
│ ┌─────────────────────────────────────┐ │
│ │ Mr. Rajesh Kumar                    │ │
│ └─────────────────────────────────────┘ │
│ Max 100 characters                      │
│                                         │
│ Phone Number *                          │
│ ┌─────────────────────────────────────┐ │
│ │ +91-98765-43213                     │ │
│ └─────────────────────────────────────┘ │
│ Max 20 characters                       │
│                                         │
│          [Cancel]  [Create Teacher]     │
└─────────────────────────────────────────┘
```

**Business Rules**

1. Teacher ID is automatically generated as UUID
2. Teacher record is created before assignment to classes
3. Name and phone are mandatory
4. Phone number should be unique (business consideration)

---

### STEP 1.3: View Teacher Details

**Purpose**: Retrieve detailed information about a specific teacher.

**API Endpoint**

```http
GET /teachers/:id
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/teachers/660e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGc..."
```

**Sample Response** (200 OK)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Dr. Sarah Anderson",
  "phone": "+91-98765-43210",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

**Error Responses**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Teacher with ID 660e8400-e29b-41d4-a716-446655440001 not found",
  "error": "Not Found"
}
```

---

### STEP 1.4: Update Teacher

**Purpose**: Modify existing teacher information.

**API Endpoint**

```http
PATCH /teachers/:id
```

**Request Body**

```json
{
  "name": "Dr. Sarah Elizabeth Anderson",
  "phone": "+91-98765-43299"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Dr. Sarah Elizabeth Anderson",
  "phone": "+91-98765-43299",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-11-12T11:00:00.000Z"
}
```

---

### STEP 1.5: Delete Teacher

**Purpose**: Remove a teacher from the system.

**API Endpoint**

```http
DELETE /teachers/:id
```

**Sample Response** (204 No Content)

**Error Responses**

```json
// 409 Conflict - Teacher has active assignments
{
  "statusCode": 409,
  "message": "Cannot delete teacher. Teacher has active class assignments.",
  "error": "Conflict"
}
```

**Business Rules**

1. Cannot delete teacher with active class assignments
2. Cannot delete teacher with timetable entries
3. Consider soft delete for historical data

---

### STEP 1.6: Get Teachers Count

**Purpose**: Retrieve total number of teachers.

**API Endpoint**

```http
GET /teachers/stats/count
```

**Sample Response** (200 OK)

```json
{
  "count": 42
}
```

---

## STEP 2: Teacher Attendance APIs

### STEP 2.1: View All Attendance

**Purpose**: Retrieve teacher attendance records.

**API Endpoint**

```http
GET /teachers/attendance
GET /teachers/attendance?teacherId=660e8400-e29b-41d4-a716-446655440001
GET /teachers/attendance?startDate=2024-11-01&endDate=2024-11-30
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "a20e8400-e29b-41d4-a716-446655440001",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "date": "2024-11-12",
    "status": "PRESENT",
    "remarks": null,
    "markedBy": "admin-user-id",
    "createdAt": "2024-11-12T08:00:00.000Z",
    "updatedAt": "2024-11-12T08:00:00.000Z"
  }
]
```

---

### STEP 2.2: Mark Attendance

**Purpose**: Mark attendance for a single teacher.

**API Endpoint**

```http
POST /teachers/attendance
```

**Request Body**

```json
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "date": "2024-11-12",
  "status": "PRESENT",
  "remarks": "On time",
  "markedBy": "admin-user-id"
}
```

**Validation Rules**

- `teacherId`: Required, valid UUID
- `date`: Required, valid date (YYYY-MM-DD format)
- `status`: Required, one of: PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE
- `remarks`: Optional, string
- `markedBy`: Required, user ID who marked attendance

**Sample Response** (201 Created)

```json
{
  "id": "a20e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "date": "2024-11-12",
  "status": "PRESENT",
  "remarks": "On time",
  "markedBy": "admin-user-id",
  "createdAt": "2024-11-12T08:00:00.000Z",
  "updatedAt": "2024-11-12T08:00:00.000Z"
}
```

**Error Responses**

```json
// 400 Bad Request - Duplicate attendance
{
  "statusCode": 400,
  "message": "Attendance already marked for this teacher on this date",
  "error": "Bad Request"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "Teacher not found",
  "error": "Not Found"
}
```

---

### STEP 2.3: Bulk Mark Attendance

**Purpose**: Mark attendance for multiple teachers at once.

**API Endpoint**

```http
POST /teachers/attendance/bulk
```

**Request Body**

```json
{
  "date": "2024-11-12",
  "attendances": [
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "status": "PRESENT"
    },
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440002",
      "status": "ABSENT",
      "remarks": "Sick leave"
    },
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440003",
      "status": "LATE",
      "remarks": "Arrived 30 minutes late"
    }
  ],
  "markedBy": "admin-user-id"
}
```

**Sample Response** (201 Created)

```json
{
  "success": true,
  "created": 3,
  "failed": 0,
  "results": [
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "status": "success",
      "id": "a20e8400-e29b-41d4-a716-446655440001"
    },
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440002",
      "status": "success",
      "id": "a20e8400-e29b-41d4-a716-446655440002"
    },
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440003",
      "status": "success",
      "id": "a20e8400-e29b-41d4-a716-446655440003"
    }
  ]
}
```

**UX Mockup**

```
┌─────────────────────────────────────────────────────┐
│ 📋 Mark Teacher Attendance - Nov 12, 2024          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ ┌────┬──────────────────┬──────────┬──────────────┐│
│ │ ☑  │ Teacher Name     │ Status   │ Remarks      ││
│ ├────┼──────────────────┼──────────┼──────────────┤│
│ │[✓] │ Dr. Sarah Anders │[Present▼]│              ││
│ │[✓] │ Prof. James Mill │[Absent ▼]│ Sick leave   ││
│ │[✓] │ Ms. Priya Sharma │[Late   ▼]│ 30 min late  ││
│ │[✓] │ Mr. Rajesh Kumar │[Present▼]│              ││
│ └────┴──────────────────┴──────────┴──────────────┘│
│                                                     │
│ Selected: 4 teachers                                │
│                                                     │
│             [Cancel]  [Mark Attendance]             │
└─────────────────────────────────────────────────────┘
```

**Business Rules**

1. All teachers must exist in the system
2. Date cannot be in the future
3. Cannot mark duplicate attendance for same teacher and date
4. Bulk operation is atomic - all or nothing

---

### STEP 2.4: Get Attendance Statistics

**Purpose**: Get attendance statistics for teachers.

**API Endpoint**

```http
GET /teachers/attendance/stats
GET /teachers/attendance/stats?teacherId=660e8400-e29b-41d4-a716-446655440001
GET /teachers/attendance/stats?startDate=2024-11-01&endDate=2024-11-30
```

**Sample Response** (200 OK)

```json
{
  "totalDays": 20,
  "present": 18,
  "absent": 1,
  "late": 1,
  "halfDay": 0,
  "onLeave": 0,
  "attendancePercentage": 90.0,
  "byTeacher": {
    "660e8400-e29b-41d4-a716-446655440001": {
      "teacherName": "Dr. Sarah Anderson",
      "totalDays": 20,
      "present": 19,
      "absent": 0,
      "late": 1,
      "attendancePercentage": 95.0
    }
  }
}
```

---

### STEP 2.5: Get Teachers for Marking

**Purpose**: Get list of all teachers with their attendance status for a specific date.

**API Endpoint**

```http
GET /teachers/attendance/list-for-marking
GET /teachers/attendance/list-for-marking?date=2024-11-12
```

**Sample Response** (200 OK)

```json
[
  {
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "teacherName": "Dr. Sarah Anderson",
    "phone": "+91-98765-43210",
    "attendanceMarked": true,
    "status": "PRESENT",
    "remarks": null
  },
  {
    "teacherId": "660e8400-e29b-41d4-a716-446655440002",
    "teacherName": "Prof. James Miller",
    "phone": "+91-98765-43211",
    "attendanceMarked": false,
    "status": null,
    "remarks": null
  }
]
```

**Use Cases**

- Display teacher list for daily attendance marking
- Show which teachers' attendance is pending
- Quick attendance marking interface
- Generate attendance reports

---

### STEP 2.6: Get Monthly Summary

**Purpose**: Get monthly attendance summary for a teacher.

**API Endpoint**

```http
GET /teachers/attendance/monthly?teacherId=660e8400-e29b-41d4-a716-446655440001&month=2024-11
```

**Sample Response** (200 OK)

```json
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "teacherName": "Dr. Sarah Anderson",
  "month": "2024-11",
  "totalWorkingDays": 22,
  "present": 20,
  "absent": 1,
  "late": 1,
  "halfDay": 0,
  "onLeave": 0,
  "attendancePercentage": 90.91,
  "dailyRecords": [
    {
      "date": "2024-11-01",
      "status": "PRESENT"
    },
    {
      "date": "2024-11-02",
      "status": "PRESENT"
    }
  ]
}
```

---

### STEP 2.7: Get Attendance Details

**API Endpoint**

```http
GET /teachers/attendance/:id
```

---

### STEP 2.8: Update Attendance

**Purpose**: Update existing attendance record.

**API Endpoint**

```http
PATCH /teachers/attendance/:id
```

**Request Body**

```json
{
  "status": "HALF_DAY",
  "remarks": "Left early due to medical appointment"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "a20e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "date": "2024-11-12",
  "status": "HALF_DAY",
  "remarks": "Left early due to medical appointment",
  "markedBy": "admin-user-id",
  "createdAt": "2024-11-12T08:00:00.000Z",
  "updatedAt": "2024-11-12T14:00:00.000Z"
}
```

---

### STEP 2.9: Delete Attendance

**Purpose**: Delete an attendance record (in case of marking error).

**API Endpoint**

```http
DELETE /teachers/attendance/:id
```

**Sample Response** (204 No Content)

---

## Complete Workflows

### Workflow 1: Daily Attendance Marking

**Timeline**: Every morning

1. **Get Teachers for Marking**

   ```http
   GET /teachers/attendance/list-for-marking?date=2024-11-12
   ```

2. **Bulk Mark Attendance**

   ```http
   POST /teachers/attendance/bulk
   {
     "date": "2024-11-12",
     "attendances": [
       {"teacherId": "...", "status": "PRESENT"},
       {"teacherId": "...", "status": "ABSENT", "remarks": "Sick"}
     ],
     "markedBy": "admin-user-id"
   }
   ```

3. **Verify Completion**
   ```http
   GET /teachers/attendance/stats?date=2024-11-12
   ```

---

### Workflow 2: Monthly Performance Review

**Scenario**: Generate monthly attendance report for teacher evaluation

1. **Get Monthly Summary**

   ```http
   GET /teachers/attendance/monthly?teacherId=660e8400-e29b-41d4-a716-446655440001&month=2024-11
   ```

2. **Get Detailed Statistics**

   ```http
   GET /teachers/attendance/stats?teacherId=660e8400-e29b-41d4-a716-446655440001&startDate=2024-11-01&endDate=2024-11-30
   ```

3. **Generate Report** (Frontend processing)

---

## Integration Examples

### Teacher Onboarding Process

**Step 1**: Create Teacher Record

```http
POST /teachers
{
  "name": "New Teacher",
  "phone": "+91-98765-43214"
}
```

**Step 2**: Assign Specializations (via TeacherSpecialization module)

```http
POST /teacher-specializations
{
  "teacherId": "new-teacher-id",
  "subjectCode": "MATH101",
  "proficiencyLevel": "EXPERT",
  "yearsOfExperience": 5
}
```

**Step 3**: Assign to Classes (via ClassTeacherAssignment module)

```http
POST /class-sections/teacher-assignments
{
  "teacherId": "new-teacher-id",
  "classSectionCode": "1A",
  "role": "PRIMARY",
  "assignedDate": "2024-11-12"
}
```

---

## Error Handling

### Common Error Scenarios

**1. Duplicate Attendance**

```json
{
  "statusCode": 400,
  "message": "Attendance already marked for this teacher on 2024-11-12",
  "error": "Bad Request"
}
```

**2. Future Date Attendance**

```json
{
  "statusCode": 400,
  "message": "Cannot mark attendance for future dates",
  "error": "Bad Request"
}
```

**3. Invalid Teacher ID**

```json
{
  "statusCode": 404,
  "message": "Teacher with ID 660e8400-e29b-41d4-a716-446655440099 not found",
  "error": "Not Found"
}
```

---

## Testing Scenarios

### Test Case 1: Teacher CRUD Operations

```typescript
describe('Teachers Module - CRUD', () => {
  let teacherId: string;

  it('should create a new teacher', async () => {
    const response = await request(app)
      .post('/teachers')
      .send({ name: 'Test Teacher', phone: '+1234567890' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    teacherId = response.body.id;
  });

  it('should get all teachers', async () => {
    const response = await request(app).get('/teachers').expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should update teacher', async () => {
    const response = await request(app)
      .patch(`/teachers/${teacherId}`)
      .send({ name: 'Updated Teacher' })
      .expect(200);

    expect(response.body.name).toBe('Updated Teacher');
  });
});
```

### Test Case 2: Attendance Marking

```typescript
describe('Teacher Attendance', () => {
  it('should mark attendance for teacher', async () => {
    const response = await request(app)
      .post('/teachers/attendance')
      .send({
        teacherId,
        date: '2024-11-12',
        status: 'PRESENT',
        markedBy: 'admin',
      })
      .expect(201);

    expect(response.body.status).toBe('PRESENT');
  });

  it('should prevent duplicate attendance', async () => {
    await request(app)
      .post('/teachers/attendance')
      .send({
        teacherId,
        date: '2024-11-12',
        status: 'PRESENT',
        markedBy: 'admin',
      })
      .expect(400);
  });
});
```

---

## Database Schema

### Teachers Table

```sql
CREATE TABLE teachers (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Teacher Attendance Table

```sql
CREATE TABLE teacher_attendances (
  id VARCHAR(36) PRIMARY KEY,
  teacher_id VARCHAR(36) NOT NULL,
  date DATE NOT NULL,
  status ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE') NOT NULL,
  remarks TEXT,
  marked_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_teacher_date (teacher_id, date)
);
```

---

## Best Practices

### 1. Attendance Status Values

- **PRESENT**: Teacher present for full day
- **ABSENT**: Teacher completely absent
- **LATE**: Teacher arrived late but worked full day
- **HALF_DAY**: Teacher worked half day
- **ON_LEAVE**: Teacher on approved leave

### 2. Attendance Marking Guidelines

- Mark attendance daily before 10 AM
- Use bulk marking for efficiency
- Include remarks for ABSENT, LATE, HALF_DAY, ON_LEAVE
- Cannot modify attendance after 24 hours (configurable)

### 3. Performance Considerations

- Cache teacher list for attendance marking
- Index on (teacher_id, date) for fast lookups
- Use bulk operations for marking multiple teachers
- Generate monthly reports asynchronously

---

## STEP 3: Teacher Specialization APIs

The Teacher Specialization APIs manage which teachers are qualified to teach which subjects in which classes. This helps with optimal teacher assignment and timetable planning.

### Entity Structure

```typescript
TeacherSpecialization {
  id: UUID (PK)
  teacherId: UUID (FK → Teacher)
  classCode: string (FK → Class)
  subjectCode: string (FK → Subject)
  notes: string | null
  createdAt: Date
  updatedAt: Date
}
```

### STEP 3.1: View All Teacher Specializations

**Purpose**: Retrieve all teacher specialization records in the system.

**API Endpoint**

```http
GET /teacher-specializations
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/teacher-specializations \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "1",
    "subjectCode": "MATH",
    "notes": "Specialized in elementary mathematics",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson",
      "phone": "+91-98765-43210"
    },
    "class": {
      "code": "1",
      "name": "Class 1"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    },
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440002",
    "teacherId": "660e8400-e29b-41d4-a716-446655440002",
    "classCode": "5",
    "subjectCode": "SCI",
    "notes": "Science teacher with 10 years experience",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Mr. John Smith",
      "phone": "+91-98765-43211"
    },
    "class": {
      "code": "5",
      "name": "Class 5"
    },
    "subject": {
      "code": "SCI",
      "name": "Science"
    },
    "createdAt": "2024-01-15T08:05:00.000Z",
    "updatedAt": "2024-01-15T08:05:00.000Z"
  }
]
```

**Use Cases**

- Admin reviews all teacher qualifications
- HR audits teacher expertise across the school
- Timetable coordinator sees available teachers for subjects
- System displays teacher capabilities for planning

---

### STEP 3.2: Create New Teacher Specialization

**Purpose**: Record a teacher's qualification to teach a specific subject in a specific class.

**API Endpoint**

```http
POST /teacher-specializations
```

**Request Body**

```json
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "1",
  "subjectCode": "MATH",
  "notes": "Specialized in elementary mathematics"
}
```

**Validation Rules**

- `teacherId`: Required, must be valid UUID, teacher must exist
- `classCode`: Required, max 8 characters, class must exist
- `subjectCode`: Required, max 8 characters, subject must exist
- `notes`: Optional, text field
- **Uniqueness**: Combination of (teacherId, classCode, subjectCode) must be unique

**Sample Request**

```bash
curl -X POST http://localhost:3000/teacher-specializations \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "1",
    "subjectCode": "MATH",
    "notes": "Specialized in elementary mathematics"
  }'
```

**Sample Response** (201 Created)

```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "1",
  "subjectCode": "MATH",
  "notes": "Specialized in elementary mathematics",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z"
}
```

**Error Responses**

**400 Bad Request** - Duplicate Specialization

```json
{
  "statusCode": 400,
  "message": "Teacher already has specialization for this class and subject",
  "error": "Bad Request"
}
```

**404 Not Found** - Teacher Not Found

```json
{
  "statusCode": 404,
  "message": "Teacher with ID '660e8400-e29b-41d4-a716-446655440001' not found",
  "error": "Not Found"
}
```

**404 Not Found** - Class Not Found

```json
{
  "statusCode": 404,
  "message": "Class with code '1' not found",
  "error": "Not Found"
}
```

**404 Not Found** - Subject Not Found

```json
{
  "statusCode": 404,
  "message": "Subject with code 'MATH' not found",
  "error": "Not Found"
}
```

**UX Flow**

**Screen**: Add Teacher Specialization

```
┌──────────────────────────────────────────────────────┐
│ Add Teacher Specialization                           │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Teacher:    [Dr. Sarah Anderson ▼]                  │
│             ID: 660e8400-e29b-41d4-a716-446655440001 │
│                                                      │
│ Class:      [Class 1 ▼]                             │
│                                                      │
│ Subject:    [Mathematics ▼]                         │
│                                                      │
│ Notes:      [________________________________]       │
│             [Specialized in elementary math...]      │
│             [________________________________]       │
│                                                      │
│             [Cancel]  [Add Specialization]           │
└──────────────────────────────────────────────────────┘
```

**Use Cases**

- HR records new teacher's qualifications
- Admin adds expertise after teacher training
- Document teacher's subject proficiency
- Enable teacher for teaching specific class-subject combinations

---

### STEP 3.3: Get Specializations by Teacher

**Purpose**: Retrieve all subjects and classes a specific teacher is qualified to teach.

**API Endpoint**

```http
GET /teacher-specializations/teacher/660e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "1",
    "subjectCode": "MATH",
    "notes": "Specialized in elementary mathematics",
    "class": {
      "code": "1",
      "name": "Class 1"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    }
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440003",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "2",
    "subjectCode": "MATH",
    "notes": "Can also teach Class 2 mathematics",
    "class": {
      "code": "2",
      "name": "Class 2"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    }
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440005",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "1",
    "subjectCode": "ENG",
    "notes": "Secondary expertise in English",
    "class": {
      "code": "1",
      "name": "Class 1"
    },
    "subject": {
      "code": "ENG",
      "name": "English"
    }
  }
]
```

**UX Flow**

**Screen**: Teacher Profile - Specializations

```
┌──────────────────────────────────────────────────────┐
│ 👩‍🏫 Dr. Sarah Anderson - Specializations             │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ┌──────────┬──────────────┬───────────────────────┐ │
│ │ Class    │ Subject      │ Notes                 │ │
│ ├──────────┼──────────────┼───────────────────────┤ │
│ │ Class 1  │ Mathematics  │ Primary expertise     │ │
│ │ Class 2  │ Mathematics  │ Can teach Class 2     │ │
│ │ Class 1  │ English      │ Secondary expertise   │ │
│ └──────────┴──────────────┴───────────────────────┘ │
│                                                      │
│ Total Specializations: 3                            │
│                                                      │
│ [Add New Specialization] [Export]                   │
└──────────────────────────────────────────────────────┘
```

**Use Cases**

- View teacher's complete qualification profile
- Check if teacher can cover substitute classes
- Plan training needs for teachers
- Assign teachers to appropriate classes

---

### STEP 3.4: Get Specializations by Class

**Purpose**: Find all teachers qualified to teach any subject in a specific class.

**API Endpoint**

```http
GET /teacher-specializations/class/5
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440010",
    "teacherId": "660e8400-e29b-41d4-a716-446655440002",
    "classCode": "5",
    "subjectCode": "SCI",
    "notes": "Science teacher",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Mr. John Smith",
      "phone": "+91-98765-43211"
    },
    "subject": {
      "code": "SCI",
      "name": "Science"
    }
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440011",
    "teacherId": "660e8400-e29b-41d4-a716-446655440003",
    "classCode": "5",
    "subjectCode": "MATH",
    "notes": "Mathematics specialist",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440003",
      "name": "Ms. Emily Davis",
      "phone": "+91-98765-43212"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    }
  }
]
```

**Use Cases**

- Find available teachers for a class
- Plan teacher allocation for new academic year
- Check coverage for all subjects in a class
- Identify gaps in teacher availability

---

### STEP 3.5: Get Specializations by Subject

**Purpose**: Find all teachers qualified to teach a specific subject across all classes.

**API Endpoint**

```http
GET /teacher-specializations/subject/MATH
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440001",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "1",
    "subjectCode": "MATH",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson"
    },
    "class": {
      "code": "1",
      "name": "Class 1"
    }
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440003",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classCode": "2",
    "subjectCode": "MATH",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson"
    },
    "class": {
      "code": "2",
      "name": "Class 2"
    }
  },
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440011",
    "teacherId": "660e8400-e29b-41d4-a716-446655440003",
    "classCode": "5",
    "subjectCode": "MATH",
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440003",
      "name": "Ms. Emily Davis"
    },
    "class": {
      "code": "5",
      "name": "Class 5"
    }
  }
]
```

**Use Cases**

- Find all mathematics teachers in school
- Check subject coverage across classes
- Plan department meetings
- Assess teacher capacity for a subject

---

### STEP 3.6: Find Teachers by Class and Subject

**Purpose**: Get all teachers qualified to teach a specific subject in a specific class. This is the most commonly used filter for teacher assignment.

**API Endpoint**

```http
GET /teacher-specializations/class/5/subject/MATH
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440003",
    "name": "Ms. Emily Davis",
    "phone": "+91-98765-43212",
    "specialization": {
      "id": "aa0e8400-e29b-41d4-a716-446655440011",
      "notes": "Mathematics specialist for Class 5"
    }
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440005",
    "name": "Dr. Robert Lee",
    "phone": "+91-98765-43214",
    "specialization": {
      "id": "aa0e8400-e29b-41d4-a716-446655440025",
      "notes": "Can teach Class 5 Math"
    }
  }
]
```

**UX Flow**

**Screen**: Assign Teacher to Class Subject

```
┌──────────────────────────────────────────────────────┐
│ Assign Teacher - Class 5, Mathematics               │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Qualified Teachers:                                 │
│                                                      │
│ ┌──────────────────────────────────────────────────┐│
│ │ ✓ Ms. Emily Davis                                ││
│ │   Phone: +91-98765-43212                         ││
│ │   Note: Mathematics specialist for Class 5       ││
│ │   [Select]                                       ││
│ ├──────────────────────────────────────────────────┤│
│ │ ○ Dr. Robert Lee                                 ││
│ │   Phone: +91-98765-43214                         ││
│ │   Note: Can teach Class 5 Math                   ││
│ │   [Select]                                       ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ [Cancel]  [Assign Selected Teacher]                 │
└──────────────────────────────────────────────────────┘
```

**Use Cases**

- Assign teacher to teach a subject in a class
- Find qualified substitutes for absent teachers
- Timetable creation - select appropriate teachers
- Ensure only qualified teachers assigned to subjects

---

### STEP 3.7: Get Specialization Details by ID

**Purpose**: Retrieve detailed information about a specific specialization record.

**API Endpoint**

```http
GET /teacher-specializations/aa0e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (200 OK)

```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "1",
  "subjectCode": "MATH",
  "notes": "Specialized in elementary mathematics with 15 years experience",
  "teacher": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Sarah Anderson",
    "phone": "+91-98765-43210"
  },
  "class": {
    "code": "1",
    "name": "Class 1",
    "classTypeCode": "PRI"
  },
  "subject": {
    "code": "MATH",
    "name": "Mathematics"
  },
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-03-20T10:30:00.000Z"
}
```

**Error Responses**

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Specialization not found",
  "error": "Not Found"
}
```

---

### STEP 3.8: Update Teacher Specialization

**Purpose**: Modify an existing specialization record (typically just the notes).

**API Endpoint**

```http
PATCH /teacher-specializations/aa0e8400-e29b-41d4-a716-446655440001
```

**Request Body** (Partial Update)

```json
{
  "notes": "Updated expertise level after advanced training completion"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "aa0e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "1",
  "subjectCode": "MATH",
  "notes": "Updated expertise level after advanced training completion",
  "updatedAt": "2024-04-15T14:30:00.000Z"
}
```

**Error Responses**

**404 Not Found**

```json
{
  "statusCode": 404,
  "message": "Specialization not found",
  "error": "Not Found"
}
```

**400 Bad Request** - Duplicate After Update

```json
{
  "statusCode": 400,
  "message": "Cannot update - another specialization exists with same teacher, class, and subject",
  "error": "Bad Request"
}
```

**Use Cases**

- Update notes after teacher completes training
- Document certification changes
- Add details about expertise level
- Record specialization modifications

---

### STEP 3.9: Delete Teacher Specialization

**Purpose**: Remove a teacher's qualification for a specific class-subject combination.

**API Endpoint**

```http
DELETE /teacher-specializations/aa0e8400-e29b-41d4-a716-446655440001
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
  "message": "Specialization not found",
  "error": "Not Found"
}
```

**Use Cases**

- Teacher no longer qualified for subject
- Remove outdated specializations
- Teacher transferred to different department
- Cleanup after data entry errors

---

## Complete Workflow: Teacher Specialization Management

### Workflow 1: Register New Teacher with Specializations

**Scenario**: A new mathematics teacher joins who can teach Classes 1, 2, and 3.

**Steps**:

1. **Create Teacher Record**

```bash
POST /teachers
{
  "name": "Dr. Sarah Anderson",
  "phone": "+91-98765-43210"
}
# Returns: { "id": "660e8400-e29b-41d4-a716-446655440001", ... }
```

2. **Add Specialization for Class 1**

```bash
POST /teacher-specializations
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "1",
  "subjectCode": "MATH",
  "notes": "Primary expertise"
}
```

3. **Add Specialization for Class 2**

```bash
POST /teacher-specializations
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "2",
  "subjectCode": "MATH",
  "notes": "Can teach Class 2"
}
```

4. **Add Specialization for Class 3**

```bash
POST /teacher-specializations
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classCode": "3",
  "subjectCode": "MATH",
  "notes": "Can teach Class 3"
}
```

5. **Verify Teacher's Complete Profile**

```bash
GET /teacher-specializations/teacher/660e8400-e29b-41d4-a716-446655440001
```

---

### Workflow 2: Find Substitute Teacher for Absent Teacher

**Scenario**: Class 5 Math teacher is absent. Need to find qualified substitute.

**Steps**:

1. **Find All Teachers Qualified for Class 5 Math**

```bash
GET /teacher-specializations/class/5/subject/MATH
```

2. **Check Each Teacher's Today's Schedule**

```bash
GET /timetable/teacher/{teacherId}/daily?dayOfWeek=MONDAY&academicYear=2024-2025
```

3. **Select Available Teacher and Update Timetable**

```bash
PATCH /timetable/{periodId}
{
  "teacherId": "substitute-teacher-id",
  "notes": "Substitute teacher - original teacher absent"
}
```

---

### Workflow 3: Plan Next Year's Teacher Allocation

**Scenario**: Principal wants to see subject coverage for each class.

**Steps**:

1. **For Each Class, Check Subject Coverage**

```bash
GET /teacher-specializations/class/1
GET /teacher-specializations/class/2
GET /teacher-specializations/class/3
...
```

2. **Identify Gaps** (classes without teachers for certain subjects)

3. **Find Teachers Who Can Fill Gaps**

```bash
GET /teacher-specializations/subject/SCI
# Check which teachers have science expertise
```

4. **Add Missing Specializations or Hire New Teachers**

```bash
POST /teacher-specializations
{
  "teacherId": "existing-teacher-id",
  "classCode": "gap-class-code",
  "subjectCode": "gap-subject-code",
  "notes": "Assigned after training"
}
```

---

## Summary

The **Teachers Module** provides comprehensive teacher management with:

### ✅ Implemented Features

**Teacher Management (6 APIs)**

- Complete CRUD operations for teachers (UUID-based)
- Teacher statistics and counting

**Teacher Attendance (9 APIs)**

- Daily attendance tracking with multiple status types
- Bulk attendance marking capability
- Monthly and custom date range statistics
- Teacher list for attendance marking
- Attendance modification and correction

**Teacher Specializations (9 APIs)**

- Record teacher qualifications for class-subject combinations
- Query by teacher, class, or subject
- Find qualified teachers for specific assignments
- Support substitute teacher assignment
- Track teacher expertise and certifications

### 🎯 Use Cases Covered

- Teacher hiring and onboarding
- Daily attendance tracking
- Monthly performance reports
- Attendance statistics and analytics
- Teacher directory management
- Leave and absence tracking
- Teacher qualification management
- Subject-class assignment with qualified teachers
- Substitute teacher identification
- Teacher workload balancing
- Expertise-based timetable creation

### 🔒 Data Integrity

- UUID-based teacher identification
- Unique attendance per teacher per date
- Unique specialization per (teacher, class, subject)
- Foreign key constraints to Teacher, Class, Subject
- Status validation
- Audit trail with timestamps
- Cascade delete handling

**Total APIs: 24** (6 Teacher + 9 Attendance + 9 Specialization)

This module serves as the foundation for teacher management, performance tracking, and qualification management in the school management system.

**Last Updated**: November 12, 2024  
**Version**: 2.0 (Added Teacher Specializations)  
**Status**: ✅ Complete
