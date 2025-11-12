# CLASS-SECTIONS MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                     | API Endpoint                              | Method | Step |
| ----------------------------- | ----------------------------------------- | ------ | ---- |
| **Class Teacher Assignments** |                                           |        |      |
| View All Assignments          | `/class-sections/teacher-assignments`     | GET    | 1.1  |
| Assign Teacher to Class       | `/class-sections/teacher-assignments`     | POST   | 1.2  |
| View Assignment Details       | `/class-sections/teacher-assignments/:id` | GET    | 1.3  |
| Update Assignment             | `/class-sections/teacher-assignments/:id` | PATCH  | 1.4  |
| Remove Assignment             | `/class-sections/teacher-assignments/:id` | DELETE | 1.5  |

---

## Overview

The **Class-Sections Module** manages the relationship between teachers and class sections, enabling the assignment of primary and secondary teachers to specific classes. This module is critical for establishing classroom responsibility and teaching hierarchies.

### Key Characteristics

1. **Teacher-Class Linkage**: Associates teachers with class sections
2. **Role-Based Assignment**: PRIMARY vs SECONDARY teacher roles
3. **Status Tracking**: ACTIVE and INACTIVE assignment states
4. **Temporal Management**: Start and end dates for assignments
5. **Historical Records**: Maintains assignment history

### Entity Structure

```typescript
ClassTeacherAssignment {
  id: string (PK, UUID)
  teacherId: string (FK to Teacher)
  classSectionCode: string (FK to ClassSection)
  role: AssignmentRole (PRIMARY | SECONDARY)
  status: AssignmentStatus (ACTIVE | INACTIVE)
  assignmentStartDate: Date
  assignmentEndDate: Date (nullable)
  notes: string (optional)
  createdAt: Date
  updatedAt: Date
}

// Enums
AssignmentRole {
  PRIMARY = 'PRIMARY',      // Main class teacher
  SECONDARY = 'SECONDARY'   // Assistant/substitute teacher
}

AssignmentStatus {
  ACTIVE = 'ACTIVE',        // Currently assigned
  INACTIVE = 'INACTIVE'     // Historical/ended assignment
}
```

### Integration Points

- **Teacher Module**: References Teacher entity via teacherId (UUID)
- **Classes Module**: References ClassSection entity via classSectionCode
- **Timetable Module**: Teachers teach based on class assignments
- **Students Module**: Students linked to class teachers via class sections
- **Attendance Module**: Teachers mark attendance for their assigned classes

---

## STEP 1: Class Teacher Assignment APIs

### STEP 1.1: View All Assignments

**Purpose**: Retrieve teacher-class assignments with flexible filtering.

**API Endpoint**

```http
GET /class-sections/teacher-assignments
GET /class-sections/teacher-assignments?teacherId=660e8400-e29b-41d4-a716-446655440001
GET /class-sections/teacher-assignments?classSectionCode=1A
GET /class-sections/teacher-assignments?role=PRIMARY
GET /class-sections/teacher-assignments?status=ACTIVE
GET /class-sections/teacher-assignments?page=1&limit=10
```

**Query Parameters**

- `teacherId`: Filter by specific teacher (UUID)
- `classSectionCode`: Filter by class section (e.g., "1A")
- `role`: Filter by assignment role (PRIMARY or SECONDARY)
- `status`: Filter by assignment status (ACTIVE or INACTIVE)
- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 10)

**Sample Request**

```bash
curl -X GET "http://localhost:3000/class-sections/teacher-assignments?status=ACTIVE" \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)

```json
{
  "data": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440001",
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "classSectionCode": "1A",
      "role": "PRIMARY",
      "status": "ACTIVE",
      "assignmentStartDate": "2024-04-01",
      "assignmentEndDate": null,
      "notes": "Experienced primary teacher for Class 1A",
      "createdAt": "2024-04-01T08:00:00.000Z",
      "updatedAt": "2024-04-01T08:00:00.000Z",
      "teacher": {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "Dr. Sarah Anderson",
        "phone": "+91-98765-43210"
      },
      "classSection": {
        "code": "1A",
        "classCode": "CLASS1",
        "section": "A",
        "academicYearCode": "AY2024"
      }
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440002",
      "teacherId": "660e8400-e29b-41d4-a716-446655440002",
      "classSectionCode": "1A",
      "role": "SECONDARY",
      "status": "ACTIVE",
      "assignmentStartDate": "2024-04-01",
      "assignmentEndDate": null,
      "notes": "Assistant teacher for Class 1A",
      "createdAt": "2024-04-01T08:15:00.000Z",
      "updatedAt": "2024-04-01T08:15:00.000Z",
      "teacher": {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "name": "Prof. James Miller",
        "phone": "+91-98765-43211"
      },
      "classSection": {
        "code": "1A",
        "classCode": "CLASS1",
        "section": "A",
        "academicYearCode": "AY2024"
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**UX Mockup**

```
┌──────────────────────────────────────────────────────────────────┐
│ 🏫 Class Teacher Assignments                      [+ Assign]     │
├──────────────────────────────────────────────────────────────────┤
│ Filters:                                                         │
│ Class: [All ▼]  Teacher: [All ▼]  Role: [All ▼]  Status: [Active▼]│
│                                                                  │
│ ┌──────┬──────────┬──────────────┬─────────┬────────┬────────┐  │
│ │Class │ Teacher  │ Role         │ Status  │ Start  │ Action │  │
│ ├──────┼──────────┼──────────────┼─────────┼────────┼────────┤  │
│ │ 1A   │ Dr.Sarah │ ⭐ PRIMARY   │ 🟢Active│04/01/24│ [View] │  │
│ │ 1A   │ Prof.Jam │   SECONDARY  │ 🟢Active│04/01/24│ [View] │  │
│ │ 2B   │ Ms.Priya │ ⭐ PRIMARY   │ 🟢Active│04/01/24│ [View] │  │
│ │ 5A   │ Mr.Rajes │ ⭐ PRIMARY   │ 🟢Active│04/15/24│ [View] │  │
│ └──────┴──────────┴──────────────┴─────────┴────────┴────────┘  │
│                                                                  │
│ Showing 4 of 4 assignments                   [← 1 of 1 →]       │
└──────────────────────────────────────────────────────────────────┘
```

**Use Cases**

- Admin views all active teacher assignments
- Filter assignments by specific class section
- Find all classes assigned to a particular teacher
- Identify classes without PRIMARY teacher assignments
- Generate teacher workload reports

---

### STEP 1.2: Assign Teacher to Class

**Purpose**: Create a new teacher-class assignment.

**API Endpoint**

```http
POST /class-sections/teacher-assignments
```

**Request Body**

```json
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "role": "PRIMARY",
  "status": "ACTIVE",
  "assignmentStartDate": "2024-04-01",
  "assignmentEndDate": null,
  "notes": "Experienced primary teacher for Class 1A"
}
```

**Validation Rules**

- `teacherId`: Required, valid UUID, teacher must exist
- `classSectionCode`: Required, string, class section must exist
- `role`: Required, enum (PRIMARY | SECONDARY)
- `status`: Optional, enum (ACTIVE | INACTIVE), defaults to ACTIVE
- `assignmentStartDate`: Required, date string (YYYY-MM-DD format)
- `assignmentEndDate`: Optional, date string, must be after start date
- `notes`: Optional, text

**Sample Request**

```bash
curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "role": "PRIMARY",
    "assignmentStartDate": "2024-04-01"
  }'
```

**Sample Response** (201 Created)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "role": "PRIMARY",
  "status": "ACTIVE",
  "assignmentStartDate": "2024-04-01",
  "assignmentEndDate": null,
  "notes": null,
  "createdAt": "2024-11-12T10:30:00.000Z",
  "updatedAt": "2024-11-12T10:30:00.000Z"
}
```

**Error Responses**

```json
// 400 Bad Request - Validation error
{
  "statusCode": 400,
  "message": [
    "teacherId must be a UUID",
    "role must be one of: PRIMARY, SECONDARY"
  ],
  "error": "Bad Request"
}

// 404 Not Found - Teacher not found
{
  "statusCode": 404,
  "message": "Teacher with ID 660e8400-e29b-41d4-a716-446655440001 not found",
  "error": "Not Found"
}

// 404 Not Found - Class Section not found
{
  "statusCode": 404,
  "message": "Class section with code 1A not found",
  "error": "Not Found"
}

// 409 Conflict - Duplicate PRIMARY assignment
{
  "statusCode": 409,
  "message": "Class section 1A already has an active PRIMARY teacher",
  "error": "Conflict"
}
```

**UX Mockup**

```
┌──────────────────────────────────────────────────┐
│ Assign Teacher to Class                     [X]  │
├──────────────────────────────────────────────────┤
│                                                  │
│ Class Section *                                  │
│ ┌──────────────────────────────────────────────┐ │
│ │ 1A - Class 1, Section A (AY2024)         [▼]│ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Teacher *                                        │
│ ┌──────────────────────────────────────────────┐ │
│ │ Dr. Sarah Anderson (+91-98765-43210)     [▼]│ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Assignment Role *                                │
│ ┌──────────────────────────────────────────────┐ │
│ │ ● PRIMARY     ○ SECONDARY                    │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Start Date *                                     │
│ ┌──────────────────────────────────────────────┐ │
│ │ 2024-04-01                          [📅]     │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ End Date (Optional)                              │
│ ┌──────────────────────────────────────────────┐ │
│ │                                     [📅]     │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│ Notes                                            │
│ ┌──────────────────────────────────────────────┐ │
│ │ Experienced primary teacher...               │ │
│ └──────────────────────────────────────────────┘ │
│                                                  │
│              [Cancel]  [Assign Teacher]          │
└──────────────────────────────────────────────────┘
```

**Business Rules**

1. **PRIMARY Teacher Uniqueness**: Each class section can have only ONE active PRIMARY teacher
2. **SECONDARY Teachers**: Multiple SECONDARY teachers allowed per class
3. **Teacher Availability**: Teachers can be assigned to multiple classes
4. **Date Validation**: End date must be after start date
5. **Status Default**: If not specified, status defaults to ACTIVE

---

### STEP 1.3: View Assignment Details

**Purpose**: Retrieve detailed information about a specific assignment.

**API Endpoint**

```http
GET /class-sections/teacher-assignments/:id
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/class-sections/teacher-assignments/770e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGc..."
```

**Sample Response** (200 OK)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "role": "PRIMARY",
  "status": "ACTIVE",
  "assignmentStartDate": "2024-04-01",
  "assignmentEndDate": null,
  "notes": "Experienced primary teacher for Class 1A",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z",
  "teacher": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Sarah Anderson",
    "phone": "+91-98765-43210"
  },
  "classSection": {
    "code": "1A",
    "classCode": "CLASS1",
    "section": "A",
    "academicYearCode": "AY2024",
    "class": {
      "code": "CLASS1",
      "name": "Class 1",
      "grade": 1
    }
  }
}
```

**Error Responses**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Class teacher assignment with ID 770e8400-e29b-41d4-a716-446655440001 not found",
  "error": "Not Found"
}
```

---

### STEP 1.4: Update Assignment

**Purpose**: Modify an existing teacher-class assignment.

**API Endpoint**

```http
PATCH /class-sections/teacher-assignments/:id
```

**Request Body** (All fields optional)

```json
{
  "role": "SECONDARY",
  "status": "INACTIVE",
  "assignmentEndDate": "2024-10-31",
  "notes": "Teacher transferred to another class"
}
```

**Sample Request**

```bash
curl -X PATCH http://localhost:3000/class-sections/teacher-assignments/770e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "INACTIVE",
    "assignmentEndDate": "2024-10-31",
    "notes": "Teacher transferred to another class"
  }'
```

**Sample Response** (200 OK)

```json
{
  "id": "770e8400-e29b-41d4-a716-446655440001",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "role": "PRIMARY",
  "status": "INACTIVE",
  "assignmentStartDate": "2024-04-01",
  "assignmentEndDate": "2024-10-31",
  "notes": "Teacher transferred to another class",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-11-12T10:30:00.000Z"
}
```

**Common Update Scenarios**

**1. End an Assignment**

```json
{
  "status": "INACTIVE",
  "assignmentEndDate": "2024-10-31"
}
```

**2. Change Role**

```json
{
  "role": "SECONDARY",
  "notes": "Demoted due to new hire"
}
```

**3. Extend Assignment**

```json
{
  "assignmentEndDate": "2025-03-31",
  "notes": "Extended for another academic year"
}
```

---

### STEP 1.5: Remove Assignment

**Purpose**: Delete a teacher-class assignment record.

**API Endpoint**

```http
DELETE /class-sections/teacher-assignments/:id
```

**Sample Request**

```bash
curl -X DELETE http://localhost:3000/class-sections/teacher-assignments/770e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer eyJhbGc..."
```

**Sample Response** (204 No Content)

**Error Responses**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Class teacher assignment with ID 770e8400-e29b-41d4-a716-446655440001 not found",
  "error": "Not Found"
}

// 409 Conflict - Cannot delete active assignment
{
  "statusCode": 409,
  "message": "Cannot delete active assignment. Please mark as INACTIVE first.",
  "error": "Conflict"
}
```

**Business Rules**

1. **Soft Delete Recommended**: Instead of deleting, mark as INACTIVE with end date
2. **Data Integrity**: Deletion may affect historical reports
3. **Active Assignment Protection**: Should not delete ACTIVE assignments
4. **Audit Trail**: Consider keeping historical data for compliance

---

## Complete Workflows

### Workflow 1: Academic Year Teacher Assignment

**Scenario**: Assign all teachers to their classes at the start of academic year

**Timeline**: Start of academic year (typically April 1st)

**STEP 1**: Prepare Class Sections

```http
GET /classes/sections?academicYearCode=AY2024&status=ACTIVE
```

**STEP 2**: Prepare Teacher List

```http
GET /teachers
```

**STEP 3**: Bulk Assign PRIMARY Teachers

```bash
# For each class section, assign one PRIMARY teacher
curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "role": "PRIMARY",
    "assignmentStartDate": "2024-04-01"
  }'

curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440002",
    "classSectionCode": "2B",
    "role": "PRIMARY",
    "assignmentStartDate": "2024-04-01"
  }'
```

**STEP 4**: Assign SECONDARY Teachers (if needed)

```bash
curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440003",
    "classSectionCode": "1A",
    "role": "SECONDARY",
    "assignmentStartDate": "2024-04-01"
  }'
```

**STEP 5**: Verify All Assignments

```http
GET /class-sections/teacher-assignments?status=ACTIVE
```

---

### Workflow 2: Mid-Year Teacher Transfer

**Scenario**: Transfer teacher from one class to another

**Timeline**: Any time during academic year

**STEP 1**: End Current Assignment

```bash
curl -X PATCH http://localhost:3000/class-sections/teacher-assignments/770e8400-e29b-41d4-a716-446655440001 \
  -d '{
    "status": "INACTIVE",
    "assignmentEndDate": "2024-10-15",
    "notes": "Teacher transferred to Class 5A"
  }'
```

**STEP 2**: Create New Assignment

```bash
curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "5A",
    "role": "PRIMARY",
    "assignmentStartDate": "2024-10-16",
    "notes": "Transferred from Class 1A"
  }'
```

**STEP 3**: Assign Replacement Teacher to Old Class

```bash
curl -X POST http://localhost:3000/class-sections/teacher-assignments \
  -d '{
    "teacherId": "660e8400-e29b-41d4-a716-446655440010",
    "classSectionCode": "1A",
    "role": "PRIMARY",
    "assignmentStartDate": "2024-10-16",
    "notes": "Replacement for transferred teacher"
  }'
```

---

### Workflow 3: Teacher Workload Report

**Scenario**: Generate report of all classes assigned to a teacher

**STEP 1**: Get All Assignments for Teacher

```http
GET /class-sections/teacher-assignments?teacherId=660e8400-e29b-41d4-a716-446655440001&status=ACTIVE
```

**Sample Response**

```json
{
  "data": [
    {
      "id": "...",
      "classSectionCode": "1A",
      "role": "PRIMARY",
      "assignmentStartDate": "2024-04-01"
    },
    {
      "id": "...",
      "classSectionCode": "2B",
      "role": "SECONDARY",
      "assignmentStartDate": "2024-05-01"
    }
  ],
  "meta": {
    "total": 2
  }
}
```

**STEP 2**: Calculate Workload

- Count PRIMARY assignments (more responsibility)
- Count SECONDARY assignments (less responsibility)
- Get student count per class section
- Calculate total teaching load

---

## Integration Examples

### Integration 1: Student Enrollment with Teacher Assignment

**Scenario**: When student enrolls, show assigned class teacher

**STEP 1**: Get Student Enrollment

```http
GET /students/enrollments/550e8400-e29b-41d4-a716-446655440001
```

**Response**

```json
{
  "id": "...",
  "studentId": "550e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "rollNumber": "001"
}
```

**STEP 2**: Get Class Teacher

```http
GET /class-sections/teacher-assignments?classSectionCode=1A&role=PRIMARY&status=ACTIVE
```

**Response**

```json
{
  "data": [
    {
      "teacher": {
        "name": "Dr. Sarah Anderson",
        "phone": "+91-98765-43210"
      }
    }
  ]
}
```

---

### Integration 2: Timetable Generation

**Scenario**: Generate timetable based on teacher assignments

**STEP 1**: Get All Active Teacher Assignments

```http
GET /class-sections/teacher-assignments?status=ACTIVE
```

**STEP 2**: For Each Assignment, Create Timetable Slots

```http
POST /timetables
{
  "classSectionCode": "1A",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "subjectCode": "MATH101",
  "dayOfWeek": "MONDAY",
  "startTime": "09:00",
  "endTime": "10:00"
}
```

---

## Error Handling

### Common Error Scenarios

**1. Duplicate PRIMARY Teacher**

```json
{
  "statusCode": 409,
  "message": "Class section 1A already has an active PRIMARY teacher. Remove or inactivate existing assignment first.",
  "error": "Conflict"
}
```

**Solution**: Either mark existing PRIMARY as INACTIVE or assign new teacher as SECONDARY.

---

**2. Invalid Date Range**

```json
{
  "statusCode": 400,
  "message": "Assignment end date must be after start date",
  "error": "Bad Request"
}
```

**Solution**: Ensure end date is chronologically after start date.

---

**3. Teacher Not Found**

```json
{
  "statusCode": 404,
  "message": "Teacher with ID 660e8400-e29b-41d4-a716-446655440099 not found",
  "error": "Not Found"
}
```

**Solution**: Verify teacher exists in system before assignment.

---

**4. Class Section Not Found**

```json
{
  "statusCode": 404,
  "message": "Class section with code 9Z not found",
  "error": "Not Found"
}
```

**Solution**: Verify class section code exists in current academic year.

---

## Testing Scenarios

### Test Case 1: Assignment CRUD Operations

```typescript
describe('ClassTeacherAssignment Module', () => {
  let assignmentId: string;
  const teacherId = '660e8400-e29b-41d4-a716-446655440001';
  const classSectionCode = '1A';

  it('should create teacher assignment', async () => {
    const response = await request(app)
      .post('/class-sections/teacher-assignments')
      .send({
        teacherId,
        classSectionCode,
        role: 'PRIMARY',
        assignmentStartDate: '2024-04-01',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    assignmentId = response.body.id;
  });

  it('should prevent duplicate PRIMARY teacher', async () => {
    await request(app)
      .post('/class-sections/teacher-assignments')
      .send({
        teacherId: '660e8400-e29b-41d4-a716-446655440002',
        classSectionCode,
        role: 'PRIMARY',
        assignmentStartDate: '2024-04-01',
      })
      .expect(409);
  });

  it('should allow SECONDARY teacher', async () => {
    await request(app)
      .post('/class-sections/teacher-assignments')
      .send({
        teacherId: '660e8400-e29b-41d4-a716-446655440003',
        classSectionCode,
        role: 'SECONDARY',
        assignmentStartDate: '2024-04-01',
      })
      .expect(201);
  });

  it('should update assignment status', async () => {
    const response = await request(app)
      .patch(`/class-sections/teacher-assignments/${assignmentId}`)
      .send({
        status: 'INACTIVE',
        assignmentEndDate: '2024-10-31',
      })
      .expect(200);

    expect(response.body.status).toBe('INACTIVE');
  });
});
```

### Test Case 2: Query Filtering

```typescript
describe('Assignment Queries', () => {
  it('should filter by teacher', async () => {
    const response = await request(app)
      .get(`/class-sections/teacher-assignments?teacherId=${teacherId}`)
      .expect(200);

    expect(response.body.data.every((a) => a.teacherId === teacherId)).toBe(
      true,
    );
  });

  it('should filter by class section', async () => {
    const response = await request(app)
      .get(`/class-sections/teacher-assignments?classSectionCode=1A`)
      .expect(200);

    expect(response.body.data.every((a) => a.classSectionCode === '1A')).toBe(
      true,
    );
  });

  it('should filter by role', async () => {
    const response = await request(app)
      .get('/class-sections/teacher-assignments?role=PRIMARY')
      .expect(200);

    expect(response.body.data.every((a) => a.role === 'PRIMARY')).toBe(true);
  });
});
```

---

## Database Schema

### Class Teacher Assignments Table

```sql
CREATE TABLE class_teacher_assignments (
  id VARCHAR(36) PRIMARY KEY,
  teacher_id VARCHAR(36) NOT NULL,
  class_section_code VARCHAR(10) NOT NULL,
  role ENUM('PRIMARY', 'SECONDARY') NOT NULL,
  status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  assignment_start_date DATE NOT NULL,
  assignment_end_date DATE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE RESTRICT,
  FOREIGN KEY (class_section_code) REFERENCES class_sections(code) ON DELETE RESTRICT,

  INDEX idx_class_teacher_assignment_teacher (teacher_id),
  INDEX idx_class_teacher_assignment_section (class_section_code),
  INDEX idx_class_teacher_assignment_role (role),
  INDEX idx_class_teacher_assignment_status (status),
  INDEX idx_class_teacher_assignment_start_date (assignment_start_date),

  -- Ensure only one PRIMARY teacher per class section at a time
  UNIQUE KEY unique_primary_teacher (class_section_code, role, status)
    WHERE role = 'PRIMARY' AND status = 'ACTIVE'
);
```

---

## Best Practices

### 1. Assignment Management

**PRIMARY Teacher Responsibility**

- Each class must have exactly ONE active PRIMARY teacher
- PRIMARY teacher is main point of contact for students and parents
- PRIMARY teacher marks attendance and manages class activities

**SECONDARY Teacher Support**

- SECONDARY teachers assist PRIMARY teacher
- Can substitute when PRIMARY is absent
- Useful for large classes or specialized subjects

### 2. Status Management

**ACTIVE Assignments**

- Current ongoing teaching assignments
- Teacher actively responsible for the class
- Used for attendance marking and reporting

**INACTIVE Assignments**

- Historical assignments that have ended
- Keep for audit trail and reports
- Should have assignmentEndDate populated

### 3. Date Management

**Start Date Best Practices**

- Align with academic year start (typically April 1st)
- Can be mid-year for new hires or transfers
- Should match actual teaching start date

**End Date Best Practices**

- Leave null for ongoing assignments
- Set when teacher leaves or is transferred
- Mark status as INACTIVE when setting end date

### 4. Performance Considerations

**Indexing**

- Index on teacherId for fast teacher workload queries
- Index on classSectionCode for class-specific queries
- Composite index on (role, status) for PRIMARY teacher lookups

**Caching**

- Cache active PRIMARY teacher assignments
- Invalidate cache when assignments change
- Use for frequent class teacher lookups

---

## Summary

The **Class-Sections Module** (Teacher Assignment component) provides:

### ✅ Implemented Features

- Complete CRUD for teacher-class assignments
- Role-based assignment (PRIMARY/SECONDARY)
- Status tracking (ACTIVE/INACTIVE)
- Flexible query filtering
- Temporal assignment management

### 🎯 Use Cases Covered

- Academic year teacher allocation
- Mid-year teacher transfers
- Teacher workload reporting
- Class directory generation
- Historical assignment tracking

### 🔒 Business Rules Enforced

- One PRIMARY teacher per class section
- Multiple SECONDARY teachers allowed
- Date range validation
- Foreign key integrity (teachers and class sections must exist)

### 🔗 Integration Points

- Students Module: Student-teacher relationships
- Timetable Module: Teaching schedule generation
- Attendance Module: Teacher marking responsibilities
- Teachers Module: Teacher workload tracking

This module ensures proper teacher-class relationships and forms the foundation for classroom management and academic operations.
