# STUDENTS MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                    | API Endpoint                                                           | Method | Step |
| ---------------------------- | ---------------------------------------------------------------------- | ------ | ---- |
| **Student Management**       |                                                                        |        |      |
| View All Students            | `/students`                                                            | GET    | 1.1  |
| Create New Student           | `/students`                                                            | POST   | 1.2  |
| View Student Details         | `/students/:id`                                                        | GET    | 1.3  |
| Update Student               | `/students/:id`                                                        | PATCH  | 1.4  |
| Delete Student               | `/students/:id`                                                        | DELETE | 1.5  |
| Get Students Count           | `/students/stats/count`                                                | GET    | 1.6  |
| **Student Assignments**      |                                                                        |        |      |
| View All Assignments         | `/student-assignments`                                                 | GET    | 2.1  |
| Create New Assignment        | `/student-assignments`                                                 | POST   | 2.2  |
| Get Active Assignments       | `/student-assignments/active`                                          | GET    | 2.3  |
| Get Assignment Stats         | `/student-assignments/stats`                                           | GET    | 2.4  |
| Get Assignments by Student   | `/student-assignments/student/:studentId`                              | GET    | 2.5  |
| Get Assignments by Class     | `/student-assignments/class-section/:classSectionId`                   | GET    | 2.6  |
| Get Active Students in Class | `/student-assignments/class-section/:classSectionCode/active-students` | GET    | 2.7  |
| Get Assignment Details       | `/student-assignments/:id`                                             | GET    | 2.8  |
| Update Assignment            | `/student-assignments/:id`                                             | PATCH  | 2.9  |
| Delete Assignment            | `/student-assignments/:id`                                             | DELETE | 2.10 |
| **Student Enrollments**      |                                                                        |        |      |
| View All Enrollments         | `/student-enrollments`                                                 | GET    | 3.1  |
| Create New Enrollment        | `/student-enrollments`                                                 | POST   | 3.2  |
| Get Enrollments by Student   | `/student-enrollments/student/:studentId`                              | GET    | 3.3  |
| Get Enrollments by Class     | `/student-enrollments/class-section/:classSectionCode`                 | GET    | 3.4  |
| Get Enrollment Counts        | `/student-enrollments/stats/count`                                     | GET    | 3.5  |
| Get Class Section Count      | `/student-enrollments/class-section/:classSectionCode/count`           | GET    | 3.6  |
| Get Enrollment Details       | `/student-enrollments/:id`                                             | GET    | 3.7  |
| Update Enrollment            | `/student-enrollments/:id`                                             | PATCH  | 3.8  |
| Delete Enrollment            | `/student-enrollments/:id`                                             | DELETE | 3.9  |

---

## Overview

The **Students Module** is a core component of the school management system that manages student records, class assignments, and enrollments. It provides comprehensive student lifecycle management from admission through graduation.

### Key Characteristics

1. **Student Master Data**: Central repository for all student information
2. **Class Assignment Management**: Tracks student assignments to class sections
3. **Enrollment System**: Manages student enrollment with roll numbers and status tracking
4. **UUID-Based Identification**: Uses UUIDs for student records (not code-based)
5. **Hierarchical Dependencies**: Links to class sections, academic years, and attendance

### Entity Structure

```typescript
Student {
  id: string (PK, UUID)
  name: string (max 100 chars)
  phone: string (max 20 chars)
  assignments: StudentAssignment[]
  createdAt: Date
  updatedAt: Date
}

StudentAssignment {
  id: string (PK, UUID)
  studentId: string (FK to Student)
  classSectionCode: string (FK to ClassSection)
  enrollmentDate: Date
  status: string (ACTIVE/INACTIVE)
  createdAt: Date
  updatedAt: Date
}

StudentEnrollment {
  id: string (PK, UUID)
  studentId: string (FK to Student)
  classSectionCode: string (FK to ClassSection)
  rollNumber: string (unique per class section)
  enrollmentDate: Date
  status: string (ENROLLED/TRANSFERRED/GRADUATED/WITHDRAWN)
  createdAt: Date
  updatedAt: Date
}
```

### Integration Points

- **ClassSection**: Students assigned to specific class sections
- **AcademicYear**: Enrollments tied to academic years via class sections
- **StudentAttendance**: Daily attendance tracking
- **PaymentSystem**: Fee structures and transactions per student
- **Timetable**: Class schedules for enrolled students

---

## STEP 1: Student Management APIs

### STEP 1.1: View All Students

**Purpose**: Retrieve a list of all students in the system.

**API Endpoint**

```http
GET /students
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/students \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "phone": "+1234567890",
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  },
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Jane Smith",
    "phone": "+1234567891",
    "createdAt": "2024-06-01T10:15:00.000Z",
    "updatedAt": "2024-06-01T10:15:00.000Z"
  }
]
```

**UX Mockup**

```
┌─────────────────────────────────────────────────────┐
│ 👨‍🎓 Students Management                   [+ Add]    │
├─────────────────────────────────────────────────────┤
│ Search: [________________]  🔍  Filter: [All ▼]    │
│                                                     │
│ ┌───────┬──────────────┬───────────────┬─────────┐ │
│ │ ID    │ Name         │ Phone         │ Actions │ │
│ ├───────┼──────────────┼───────────────┼─────────┤ │
│ │ 550e..│ John Doe     │ +1234567890   │[V][E][D]│ │
│ │ 660e..│ Jane Smith   │ +1234567891   │[V][E][D]│ │
│ │ 770e..│ Bob Johnson  │ +1234567892   │[V][E][D]│ │
│ └───────┴──────────────┴───────────────┴─────────┘ │
│                                                     │
│ Showing 3 students                                  │
└─────────────────────────────────────────────────────┘
```

**Use Cases**

- Admin reviews all registered students
- Search for specific student before enrollment
- Export student list for reporting
- View student directory

---

### STEP 1.2: Create New Student

**Purpose**: Register a new student in the system.

**API Endpoint**

```http
POST /students
```

**Request Body**

```json
{
  "name": "Alice Johnson",
  "phone": "+1234567893"
}
```

**Validation Rules**

- `name`: Required, string, max 100 characters
- `phone`: Required, string, max 20 characters

**Sample Request**

```bash
curl -X POST http://localhost:3000/students \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "phone": "+1234567893"
  }'
```

**Sample Response** (201 Created)

```json
{
  "id": "880e8400-e29b-41d4-a716-446655440002",
  "name": "Alice Johnson",
  "phone": "+1234567893",
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

**Business Rules**

1. Student ID is automatically generated as UUID
2. Phone number should be unique (business logic consideration)
3. Student record is created before assignment to class
4. Name and phone are mandatory for student registration

---

### STEP 1.3: View Student Details

**Purpose**: Retrieve detailed information about a specific student.

**API Endpoint**

```http
GET /students/:id
```

**Sample Request**

```bash
curl -X GET http://localhost:3000/students/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGc..."
```

**Sample Response** (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "phone": "+1234567890",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-01T10:00:00.000Z"
}
```

**Error Responses**

```json
// 404 Not Found
{
  "statusCode": 404,
  "message": "Student with ID 550e8400-e29b-41d4-a716-446655440000 not found",
  "error": "Not Found"
}
```

---

### STEP 1.4: Update Student

**Purpose**: Modify existing student information.

**API Endpoint**

```http
PATCH /students/:id
```

**Request Body**

```json
{
  "name": "John Michael Doe",
  "phone": "+1234567899"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Michael Doe",
  "phone": "+1234567899",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-11-12T11:00:00.000Z"
}
```

---

### STEP 1.5: Delete Student

**Purpose**: Remove a student from the system.

**API Endpoint**

```http
DELETE /students/:id
```

**Sample Response** (204 No Content)

**Error Responses**

```json
// 409 Conflict - Student has active assignments
{
  "statusCode": 409,
  "message": "Cannot delete student. Student has active class assignments.",
  "error": "Conflict"
}
```

**Business Rules**

1. Cannot delete student with active assignments
2. Cannot delete student with enrollment records
3. Consider soft delete for historical data preservation

---

### STEP 1.6: Get Students Count

**Purpose**: Retrieve total number of students.

**API Endpoint**

```http
GET /students/stats/count
```

**Sample Response** (200 OK)

```json
{
  "count": 42
}
```

---

## STEP 2: Student Assignment APIs

Student assignments link students to class sections for a specific academic period.

### STEP 2.1: View All Assignments

**API Endpoint**

```http
GET /student-assignments
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "a10e8400-e29b-41d4-a716-446655440000",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "classSectionCode": "1A",
    "enrollmentDate": "2024-06-01",
    "status": "ACTIVE",
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

### STEP 2.2: Create New Assignment

**Purpose**: Assign a student to a class section.

**API Endpoint**

```http
POST /student-assignments
```

**Request Body**

```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "classSectionCode": "1A",
  "enrollmentDate": "2024-06-01",
  "status": "ACTIVE"
}
```

**Sample Response** (201 Created)

```json
{
  "id": "a10e8400-e29b-41d4-a716-446655440000",
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "classSectionCode": "1A",
  "enrollmentDate": "2024-06-01",
  "status": "ACTIVE",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-01T10:00:00.000Z"
}
```

**Error Responses**

```json
// 400 Bad Request - Student already assigned
{
  "statusCode": 400,
  "message": "Student already assigned to this class section",
  "error": "Bad Request"
}

// 404 Not Found
{
  "statusCode": 404,
  "message": "Student or class section not found",
  "error": "Not Found"
}
```

**Business Rules**

1. One student can only be assigned to one class section at a time (for same academic year)
2. Student ID and Class Section must exist
3. Enrollment date cannot be in the future
4. Status defaults to ACTIVE

---

### STEP 2.3: Get Active Assignments

**Purpose**: Retrieve only active student assignments.

**API Endpoint**

```http
GET /student-assignments/active
```

---

### STEP 2.4: Get Assignment Statistics

**Purpose**: Get statistics about student assignments.

**API Endpoint**

```http
GET /student-assignments/stats
```

**Sample Response** (200 OK)

```json
{
  "total": 150,
  "active": 145,
  "inactive": 5,
  "byClassSection": {
    "1A": 30,
    "1B": 28,
    "2A": 32
  }
}
```

---

### STEP 2.5: Get Assignments by Student

**Purpose**: Get all assignments for a specific student.

**API Endpoint**

```http
GET /student-assignments/student/:studentId
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "a10e8400-e29b-41d4-a716-446655440000",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "classSectionCode": "1A",
    "enrollmentDate": "2024-06-01",
    "status": "ACTIVE",
    "createdAt": "2024-06-01T10:00:00.000Z",
    "updatedAt": "2024-06-01T10:00:00.000Z"
  }
]
```

---

### STEP 2.7: Get Active Students in Class

**Purpose**: Get list of all active students in a class section with full details.

**API Endpoint**

```http
GET /student-assignments/class-section/:classSectionCode/active-students
```

**Sample Response** (200 OK)

```json
[
  {
    "assignmentId": "a10e8400-e29b-41d4-a716-446655440000",
    "studentId": "550e8400-e29b-41d4-a716-446655440000",
    "studentName": "John Doe",
    "studentPhone": "+1234567890",
    "rollNumber": "001",
    "enrollmentDate": "2024-06-01",
    "status": "ACTIVE"
  }
]
```

**Use Cases**

- Display class roster
- Mark attendance for a class
- Generate class lists for teachers
- Student seating arrangements

---

## STEP 3: Student Enrollment APIs

### STEP 3.1: View All Enrollments

**API Endpoint**

```http
GET /student-enrollments
GET /student-enrollments?status=active
```

---

### STEP 3.2: Create New Enrollment

**Purpose**: Enroll a student in a class section with roll number.

**API Endpoint**

```http
POST /student-enrollments
```

**Request Body**

```json
{
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "classSectionCode": "1A",
  "rollNumber": "001",
  "enrollmentDate": "2024-06-01",
  "status": "ENROLLED"
}
```

**Sample Response** (201 Created)

```json
{
  "id": "e10e8400-e29b-41d4-a716-446655440000",
  "studentId": "550e8400-e29b-41d4-a716-446655440000",
  "classSectionCode": "1A",
  "rollNumber": "001",
  "enrollmentDate": "2024-06-01",
  "status": "ENROLLED",
  "createdAt": "2024-06-01T10:00:00.000Z",
  "updatedAt": "2024-06-01T10:00:00.000Z"
}
```

**Error Responses**

```json
// 409 Conflict - Roll number taken
{
  "statusCode": 409,
  "message": "Roll number 001 already taken in this class section",
  "error": "Conflict"
}

// 409 Conflict - Student already enrolled
{
  "statusCode": 409,
  "message": "Student already enrolled in this class section",
  "error": "Conflict"
}
```

**Business Rules**

1. Roll number must be unique within a class section
2. One student cannot be enrolled multiple times in same class section
3. Enrollment status can be: ENROLLED, TRANSFERRED, GRADUATED, WITHDRAWN
4. Roll number is mandatory for enrollment

---

### STEP 3.5: Get Enrollment Counts

**API Endpoint**

```http
GET /student-enrollments/stats/count
```

**Sample Response** (200 OK)

```json
{
  "total": 150,
  "active": 145
}
```

---

## Integration Examples

### Complete Student Onboarding Workflow

**Step 1**: Create Student Record

```http
POST /students
{
  "name": "Alice Johnson",
  "phone": "+1234567893"
}
```

**Step 2**: Assign to Class Section

```http
POST /student-assignments
{
  "studentId": "880e8400-e29b-41d4-a716-446655440002",
  "classSectionCode": "1A",
  "enrollmentDate": "2024-06-01",
  "status": "ACTIVE"
}
```

**Step 3**: Create Enrollment with Roll Number

```http
POST /student-enrollments
{
  "studentId": "880e8400-e29b-41d4-a716-446655440002",
  "classSectionCode": "1A",
  "rollNumber": "025",
  "enrollmentDate": "2024-06-01",
  "status": "ENROLLED"
}
```

**Step 4**: Verify Assignment

```http
GET /student-assignments/student/880e8400-e29b-41d4-a716-446655440002
```

---

## Complete Workflows

### Workflow 1: New Student Admission

**Timeline**: During admission period

1. **Register Student**

   ```http
   POST /students
   {
     "name": "New Student",
     "phone": "+1234567894"
   }
   ```

2. **Assign to Class**

   ```http
   POST /student-assignments
   {
     "studentId": "new-student-id",
     "classSectionCode": "1A",
     "enrollmentDate": "2024-06-01",
     "status": "ACTIVE"
   }
   ```

3. **Create Enrollment**
   ```http
   POST /student-enrollments
   {
     "studentId": "new-student-id",
     "classSectionCode": "1A",
     "rollNumber": "026",
     "enrollmentDate": "2024-06-01",
     "status": "ENROLLED"
   }
   ```

---

### Workflow 2: Student Transfer

**Scenario**: Moving student from Class 1A to Class 1B

1. **Update Current Assignment**

   ```http
   PATCH /student-assignments/current-assignment-id
   {
     "status": "INACTIVE"
   }
   ```

2. **Update Enrollment Status**

   ```http
   PATCH /student-enrollments/current-enrollment-id
   {
     "status": "TRANSFERRED"
   }
   ```

3. **Create New Assignment**

   ```http
   POST /student-assignments
   {
     "studentId": "student-id",
     "classSectionCode": "1B",
     "enrollmentDate": "2024-11-12",
     "status": "ACTIVE"
   }
   ```

4. **Create New Enrollment**
   ```http
   POST /student-enrollments
   {
     "studentId": "student-id",
     "classSectionCode": "1B",
     "rollNumber": "015",
     "enrollmentDate": "2024-11-12",
     "status": "ENROLLED"
   }
   ```

---

## Error Handling

### Common Error Scenarios

**1. Duplicate Assignment**

```json
{
  "statusCode": 400,
  "message": "Student already assigned to this class section",
  "error": "Bad Request"
}
```

**2. Roll Number Conflict**

```json
{
  "statusCode": 409,
  "message": "Roll number 001 already taken in this class section",
  "error": "Conflict"
}
```

**3. Invalid UUID Format**

```json
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request"
}
```

---

## Testing Scenarios

### Test Case 1: Student CRUD Operations

```typescript
describe('Students Module - CRUD', () => {
  let studentId: string;

  it('should create a new student', async () => {
    const response = await request(app)
      .post('/students')
      .send({ name: 'Test Student', phone: '+1234567890' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('Test Student');
    studentId = response.body.id;
  });

  it('should get student by ID', async () => {
    const response = await request(app)
      .get(`/students/${studentId}`)
      .expect(200);

    expect(response.body.id).toBe(studentId);
  });

  it('should update student', async () => {
    const response = await request(app)
      .patch(`/students/${studentId}`)
      .send({ name: 'Updated Student' })
      .expect(200);

    expect(response.body.name).toBe('Updated Student');
  });

  it('should delete student', async () => {
    await request(app).delete(`/students/${studentId}`).expect(204);
  });
});
```

---

## Database Schema

### Students Table

```sql
CREATE TABLE students (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Student Assignments Table

```sql
CREATE TABLE student_assignments (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  class_section_code VARCHAR(8) NOT NULL,
  enrollment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (class_section_code) REFERENCES class_sections(code) ON DELETE RESTRICT,
  UNIQUE KEY unique_active_assignment (student_id, class_section_code, status)
);
```

### Student Enrollments Table

```sql
CREATE TABLE student_enrollments (
  id VARCHAR(36) PRIMARY KEY,
  student_id VARCHAR(36) NOT NULL,
  class_section_code VARCHAR(8) NOT NULL,
  roll_number VARCHAR(20) NOT NULL,
  enrollment_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'ENROLLED',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE RESTRICT,
  FOREIGN KEY (class_section_code) REFERENCES class_sections(code) ON DELETE RESTRICT,
  UNIQUE KEY unique_roll_number (class_section_code, roll_number),
  UNIQUE KEY unique_student_enrollment (student_id, class_section_code)
);
```

---

## Best Practices

### 1. Student ID Management

- Always use UUID for student identification
- Never expose internal database IDs in URLs
- Use UUID validation in API parameters

### 2. Assignment vs Enrollment

- **Assignment**: Links student to class section (can have multiple historical)
- **Enrollment**: Formal enrollment with roll number (one active per class)
- Create assignment first, then enrollment

### 3. Status Management

- Assignment Status: ACTIVE, INACTIVE
- Enrollment Status: ENROLLED, TRANSFERRED, GRADUATED, WITHDRAWN
- Always update status when student moves classes

### 4. Roll Number Uniqueness

- Roll numbers must be unique within class section
- Format: "001", "002", etc. (3-digit zero-padded recommended)
- Roll numbers can be reused across different class sections

---

## Summary

The **Students Module** provides comprehensive student lifecycle management with:

### ✅ Implemented Features

- Complete CRUD operations for students (UUID-based)
- Student assignment management (link to class sections)
- Enrollment system with roll numbers
- Active student tracking per class section
- Statistics and count endpoints
- Historical assignment tracking

### 🎯 Use Cases Covered

- Student admission and registration
- Class assignment and transfers
- Roll number management
- Class roster generation
- Student directory and search
- Enrollment status tracking

### 🔒 Data Integrity

- UUID-based student identification
- Unique roll numbers per class section
- Foreign key constraints to prevent orphaned data
- Status-based soft deletion
- Historical record preservation

This module serves as the foundation for student-centric operations in the school management system, enabling comprehensive tracking from admission through graduation.
