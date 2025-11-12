# CLASS SUBJECTS MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action                       | API Endpoint                          | Method | Step |
| ------------------------------- | ------------------------------------- | ------ | ---- |
| Create Class-Subject Assignment | `/class-subjects`                     | POST   | 1.1  |
| Bulk Assign Subjects            | `/class-subjects/bulk`                | POST   | 1.2  |
| View All Assignments (Filtered) | `/class-subjects`                     | GET    | 1.3  |
| Get Statistics                  | `/class-subjects/stats`               | GET    | 1.4  |
| Get Subjects for Class Section  | `/class-subjects/class-section/:code` | GET    | 2.1  |
| Get Class Sections by Subject   | `/class-subjects/subject/:code`       | GET    | 2.2  |
| Get Teacher's Assignments       | `/class-subjects/teacher/:id`         | GET    | 2.3  |
| View Assignment Details         | `/class-subjects/:id`                 | GET    | 3.1  |
| Update Assignment               | `/class-subjects/:id`                 | PATCH  | 3.2  |
| Delete Assignment               | `/class-subjects/:id`                 | DELETE | 3.3  |

---

## Overview

The **Class Subjects Module** manages the assignment of subjects to specific class sections with optional teacher assignments. It defines the curriculum structure for each class section in an academic year.

### Key Characteristics

1. **Curriculum Management**: Links subjects to class sections
2. **Teacher Assignment**: Optional teacher assignment per class-subject
3. **Status Management**: Active/Inactive status for subject assignments
4. **Unique Constraints**: One subject can be assigned only once per class section
5. **Bulk Operations**: Efficiently assign multiple subjects to a class section
6. **Academic Year Bound**: Assignments specific to class sections (which are year-bound)

### Entity Structure

```typescript
ClassSubject {
  id: UUID (PK)
  classSectionCode: string (FK → ClassSection)
  subjectCode: string (FK → Subject)
  teacherId: UUID | null (FK → Teacher, optional)
  status: enum (ACTIVE, INACTIVE)
  notes: string | null
  createdAt: Date
  updatedAt: Date

  // Unique constraint: (classSectionCode, subjectCode)
}
```

### Integration Points

- **ClassSection**: Every assignment belongs to a class section
- **Subject**: References which subject is taught
- **Teacher**: Optional teacher assignment for the subject
- **Timetable**: Timetable periods reference class-subject assignments
- **TeacherSpecialization**: Validates teacher qualifications

---

## STEP 1: Class Subject Assignment APIs

### STEP 1.1: Create Class-Subject Assignment

**Purpose**: Assign a subject to a class section, optionally with a teacher.

**API Endpoint**

```http
POST /class-subjects
```

**Request Body**

```json
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "ACTIVE",
  "notes": "Primary mathematics course"
}
```

**Validation Rules**

- `classSectionCode`: Required, must exist in ClassSection table
- `subjectCode`: Required, must exist in Subject table
- `teacherId`: Optional, must exist if provided
- `status`: Optional, defaults to ACTIVE
- `notes`: Optional, text
- **Uniqueness**: (classSectionCode, subjectCode) combination must be unique

**Sample Response** (201 Created)

```json
{
  "id": "cc0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "ACTIVE",
  "notes": "Primary mathematics course",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z"
}
```

**Error Responses**

**409 Conflict** - Duplicate Assignment

```json
{
  "statusCode": 409,
  "message": "Subject 'MATH' already assigned to class section '1A'",
  "error": "Conflict"
}
```

**404 Not Found** - Class Section Not Found

```json
{
  "statusCode": 404,
  "message": "Class section '1A' not found",
  "error": "Not Found"
}
```

**Use Cases**

- Assign subjects to new class section
- Add subject to existing class curriculum
- Assign teacher to teach a subject
- Define class section's curriculum

---

### STEP 1.2: Bulk Assign Multiple Subjects

**Purpose**: Assign multiple subjects to a class section in one operation.

**API Endpoint**

```http
POST /class-subjects/bulk
```

**Request Body**

```json
{
  "classSectionCode": "1A",
  "subjects": [
    {
      "subjectCode": "MATH",
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "notes": "Core subject"
    },
    {
      "subjectCode": "ENG",
      "teacherId": "660e8400-e29b-41d4-a716-446655440002",
      "notes": "Core subject"
    },
    {
      "subjectCode": "SCI",
      "teacherId": "660e8400-e29b-41d4-a716-446655440003",
      "notes": "Core subject"
    },
    {
      "subjectCode": "PE",
      "teacherId": null,
      "notes": "Physical education"
    }
  ]
}
```

**Sample Response** (201 Created)

```json
{
  "created": 4,
  "assignments": [
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440001",
      "classSectionCode": "1A",
      "subjectCode": "MATH",
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "status": "ACTIVE",
      "notes": "Core subject"
    },
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440002",
      "classSectionCode": "1A",
      "subjectCode": "ENG",
      "teacherId": "660e8400-e29b-41d4-a716-446655440002",
      "status": "ACTIVE",
      "notes": "Core subject"
    },
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440003",
      "classSectionCode": "1A",
      "subjectCode": "SCI",
      "teacherId": "660e8400-e29b-41d4-a716-446655440003",
      "status": "ACTIVE",
      "notes": "Core subject"
    },
    {
      "id": "cc0e8400-e29b-41d4-a716-446655440004",
      "classSectionCode": "1A",
      "subjectCode": "PE",
      "teacherId": null,
      "status": "ACTIVE",
      "notes": "Physical education"
    }
  ]
}
```

**Use Cases**

- Set up complete curriculum for new class section
- Quickly assign all subjects at once
- Bulk import curriculum data
- Academic year setup

---

### STEP 1.3: View All Class-Subject Assignments (Filtered)

**Purpose**: Retrieve class-subject assignments with optional filters.

**API Endpoint**

```http
GET /class-subjects?classSectionCode=1A&status=ACTIVE
```

**Query Parameters**

- `classSectionCode`: Filter by class section (optional)
- `subjectCode`: Filter by subject (optional)
- `teacherId`: Filter by teacher (optional)
- `status`: Filter by status (optional)

**Sample Response** (200 OK)

```json
[
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "notes": "Core subject",
    "classSection": {
      "code": "1A",
      "sectionName": "Section A",
      "className": "Class 1",
      "academicYear": "2024-2025"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    },
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson",
      "phone": "+91-98765-43210"
    }
  }
]
```

**Use Cases**

- View all subject assignments
- Filter by class section, subject, or teacher
- Audit curriculum assignments
- Check teacher workload

---

### STEP 1.4: Get Class-Subject Statistics

**Purpose**: Retrieve statistics about class-subject assignments.

**API Endpoint**

```http
GET /class-subjects/stats
```

**Sample Response** (200 OK)

```json
{
  "totalAssignments": 145,
  "activeAssignments": 132,
  "inactiveAssignments": 13,
  "assignmentsWithTeachers": 120,
  "assignmentsWithoutTeachers": 25,
  "byClassSection": [
    {
      "classSectionCode": "1A",
      "subjectCount": 8,
      "assignedTeachers": 7
    },
    {
      "classSectionCode": "2B",
      "subjectCount": 9,
      "assignedTeachers": 8
    }
  ],
  "bySubject": [
    {
      "subjectCode": "MATH",
      "classSectionCount": 15,
      "uniqueTeachers": 5
    },
    {
      "subjectCode": "ENG",
      "classSectionCount": 15,
      "uniqueTeachers": 4
    }
  ],
  "byTeacher": [
    {
      "teacherId": "660e8400-e29b-41d4-a716-446655440001",
      "teacherName": "Dr. Sarah Anderson",
      "assignmentCount": 3
    }
  ]
}
```

**Use Cases**

- Overview of curriculum coverage
- Identify gaps in teacher assignments
- Workload distribution analysis
- Academic planning

---

## STEP 2: Query APIs by Relationship

### STEP 2.1: Get All Subjects for a Class Section

**Purpose**: Retrieve all subjects assigned to a specific class section (the class curriculum).

**API Endpoint**

```http
GET /class-subjects/class-section/1A
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    },
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson"
    }
  },
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440002",
    "classSectionCode": "1A",
    "subjectCode": "ENG",
    "teacherId": "660e8400-e29b-41d4-a716-446655440002",
    "status": "ACTIVE",
    "subject": {
      "code": "ENG",
      "name": "English"
    },
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Mr. John Smith"
    }
  }
]
```

**UX Flow**

**Screen**: Class 1A Curriculum

```
┌───────────────────────────────────────────────────────┐
│ 📚 Class 1A - Subjects (2024-2025)                    │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ┌──────────────┬─────────────────┬────────────────┐  │
│ │ Subject      │ Teacher         │ Status         │  │
│ ├──────────────┼─────────────────┼────────────────┤  │
│ │ Mathematics  │ Dr. S. Anderson │ ● Active      │  │
│ │ English      │ Mr. J. Smith    │ ● Active      │  │
│ │ Science      │ Ms. E. Davis    │ ● Active      │  │
│ │ History      │ Unassigned      │ ⚠ No Teacher  │  │
│ │ Art          │ Dr. R. Lee      │ ● Active      │  │
│ └──────────────┴─────────────────┴────────────────┘  │
│                                                       │
│ Total: 5 subjects | Teachers: 4/5 assigned           │
│                                                       │
│ [Add Subject] [Assign Teachers] [Export]             │
└───────────────────────────────────────────────────────┘
```

**Use Cases**

- View class curriculum
- Check subject coverage for a class
- Identify subjects without teachers
- Plan teacher assignments

---

### STEP 2.2: Get All Class Sections Teaching a Subject

**Purpose**: Find all class sections where a specific subject is taught.

**API Endpoint**

```http
GET /class-subjects/subject/MATH
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "classSection": {
      "code": "1A",
      "sectionName": "Section A",
      "className": "Class 1"
    },
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson"
    }
  },
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440010",
    "classSectionCode": "2B",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "classSection": {
      "code": "2B",
      "sectionName": "Section B",
      "className": "Class 2"
    },
    "teacher": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Dr. Sarah Anderson"
    }
  }
]
```

**Use Cases**

- See where a subject is taught across the school
- Check teacher assignment for a subject
- Plan subject department meetings
- Assess subject coverage

---

### STEP 2.3: Get Teacher's Class-Subject Assignments

**Purpose**: Retrieve all class-subject assignments for a specific teacher.

**API Endpoint**

```http
GET /class-subjects/teacher/660e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (200 OK)

```json
[
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440001",
    "classSectionCode": "1A",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "classSection": {
      "code": "1A",
      "sectionName": "Section A",
      "className": "Class 1"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    }
  },
  {
    "id": "cc0e8400-e29b-41d4-a716-446655440010",
    "classSectionCode": "2B",
    "subjectCode": "MATH",
    "teacherId": "660e8400-e29b-41d4-a716-446655440001",
    "status": "ACTIVE",
    "classSection": {
      "code": "2B",
      "sectionName": "Section B",
      "className": "Class 2"
    },
    "subject": {
      "code": "MATH",
      "name": "Mathematics"
    }
  }
]
```

**UX Flow**

**Screen**: Teacher Workload - Dr. Sarah Anderson

```
┌───────────────────────────────────────────────────────┐
│ 👩‍🏫 Dr. Sarah Anderson - Teaching Load                │
├───────────────────────────────────────────────────────┤
│                                                       │
│ ┌─────────────┬──────────────┬───────────────────┐   │
│ │ Class       │ Subject      │ Status            │   │
│ ├─────────────┼──────────────┼───────────────────┤   │
│ │ Class 1A    │ Mathematics  │ Active            │   │
│ │ Class 2B    │ Mathematics  │ Active            │   │
│ │ Class 3C    │ Mathematics  │ Active            │   │
│ └─────────────┴──────────────┴───────────────────┘   │
│                                                       │
│ Total Classes: 3                                     │
│ Total Subjects: 1 (Mathematics)                      │
│                                                       │
│ [View Timetable] [Workload Report]                   │
└───────────────────────────────────────────────────────┘
```

**Use Cases**

- View teacher's teaching load
- Check teacher's class assignments
- Workload balancing
- Teacher performance review

---

## STEP 3: Individual Assignment Management

### STEP 3.1: Get Class-Subject Assignment by ID

**Purpose**: Retrieve detailed information about a specific assignment.

**API Endpoint**

```http
GET /class-subjects/cc0e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (200 OK)

```json
{
  "id": "cc0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "660e8400-e29b-41d4-a716-446655440001",
  "status": "ACTIVE",
  "notes": "Primary mathematics course",
  "createdAt": "2024-04-01T08:00:00.000Z",
  "updatedAt": "2024-04-01T08:00:00.000Z",
  "classSection": {
    "code": "1A",
    "sectionName": "Section A",
    "className": "Class 1",
    "academicYear": "2024-2025"
  },
  "subject": {
    "code": "MATH",
    "name": "Mathematics"
  },
  "teacher": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Dr. Sarah Anderson",
    "phone": "+91-98765-43210"
  }
}
```

---

### STEP 3.2: Update Class-Subject Assignment

**Purpose**: Modify an existing assignment (change teacher, status, or notes).

**API Endpoint**

```http
PATCH /class-subjects/cc0e8400-e29b-41d4-a716-446655440001
```

**Request Body** (Partial Update)

```json
{
  "teacherId": "660e8400-e29b-41d4-a716-446655440002",
  "notes": "Teacher changed due to department reorganization"
}
```

**Sample Response** (200 OK)

```json
{
  "id": "cc0e8400-e29b-41d4-a716-446655440001",
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "660e8400-e29b-41d4-a716-446655440002",
  "status": "ACTIVE",
  "notes": "Teacher changed due to department reorganization",
  "updatedAt": "2024-04-15T14:30:00.000Z"
}
```

**Use Cases**

- Reassign teacher for a subject
- Mark subject as inactive
- Update assignment notes
- Modify curriculum details

---

### STEP 3.3: Delete Class-Subject Assignment

**Purpose**: Remove a subject from a class section's curriculum.

**API Endpoint**

```http
DELETE /class-subjects/cc0e8400-e29b-41d4-a716-446655440001
```

**Sample Response** (204 No Content)

```
(Empty response body)
```

**Use Cases**

- Remove subject from class curriculum
- Delete incorrect assignments
- Clean up after academic year changes
- Curriculum restructuring

---

## Complete Workflow Examples

### Workflow 1: Set Up Complete Curriculum for New Class Section

**Scenario**: New Class 1A section for 2024-2025. Need to assign all subjects with teachers.

**Steps**:

1. **Create Class Section** (prerequisite)

```bash
POST /class-sections
{
  "code": "1A",
  "classCode": "1",
  "academicYear": "2024-2025",
  "sectionName": "Section A"
}
```

2. **Bulk Assign All Subjects**

```bash
POST /class-subjects/bulk
{
  "classSectionCode": "1A",
  "subjects": [
    { "subjectCode": "MATH", "teacherId": "teacher-id-1" },
    { "subjectCode": "ENG", "teacherId": "teacher-id-2" },
    { "subjectCode": "SCI", "teacherId": "teacher-id-3" },
    { "subjectCode": "HIST", "teacherId": null },
    { "subjectCode": "GEO", "teacherId": null }
  ]
}
```

3. **Verify Curriculum**

```bash
GET /class-subjects/class-section/1A
```

4. **Assign Teachers to Unassigned Subjects**

```bash
PATCH /class-subjects/{assignment-id}
{
  "teacherId": "teacher-id-4"
}
```

---

### Workflow 2: Find and Assign Qualified Teacher

**Scenario**: Class 5B needs a Science teacher. Find qualified teachers and assign.

**Steps**:

1. **Find Teachers Qualified for Class 5 Science**

```bash
GET /teacher-specializations/class/5/subject/SCI
# Returns list of qualified teachers
```

2. **Check Each Teacher's Current Workload**

```bash
GET /class-subjects/teacher/{teacherId}
# Check how many classes they're already teaching
```

3. **Assign Least Loaded Qualified Teacher**

```bash
POST /class-subjects
{
  "classSectionCode": "5B",
  "subjectCode": "SCI",
  "teacherId": "selected-teacher-id",
  "notes": "Assigned based on workload balance"
}
```

---

### Workflow 3: Academic Year Transition - Copy Curriculum

**Scenario**: New academic year starting. Copy previous year's curriculum structure.

**Steps**:

1. **Get Previous Year's Assignments for Each Class**

```bash
GET /class-subjects?classSectionCode=1A
# Note: 1A from 2023-2024
```

2. **Create New Class Section for New Year**

```bash
POST /class-sections
{
  "code": "1A_2024",
  "classCode": "1",
  "academicYear": "2024-2025",
  "sectionName": "Section A"
}
```

3. **Bulk Assign Same Subjects**

```bash
POST /class-subjects/bulk
{
  "classSectionCode": "1A_2024",
  "subjects": [
    // Same subjects from previous year
  ]
}
```

4. **Review and Adjust Teacher Assignments**

```bash
PATCH /class-subjects/{assignment-id}
{
  "teacherId": "new-or-updated-teacher-id"
}
```

---

## Integration Examples

### Integration 1: Class Subjects + Timetable

Before creating timetable periods, verify subject is assigned to class:

```bash
# Check if subject assigned
GET /class-subjects/class-section/1A

# If MATH is in list, create timetable period
POST /timetable
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "teacher-from-class-subject",
  ...
}
```

---

### Integration 2: Class Subjects + Teacher Specializations

Validate teacher qualifications before assignment:

```bash
# Check if teacher qualified
GET /teacher-specializations/class/1/subject/MATH

# If teacher in list, assign to class-subject
POST /class-subjects
{
  "classSectionCode": "1A",
  "subjectCode": "MATH",
  "teacherId": "qualified-teacher-id"
}
```

---

## Best Practices

### 1. Always Use Bulk Operations for New Class Sections

```typescript
// Instead of multiple POST requests
await Promise.all(
  subjects.map((sub) =>
    createClassSubject({ classSectionCode, subjectCode: sub.code }),
  ),
);

// Use bulk operation
await bulkCreateClassSubjects({
  classSectionCode,
  subjects: subjects.map((sub) => ({ subjectCode: sub.code })),
});
```

### 2. Validate Teacher Qualifications

```typescript
// Before assigning teacher, check specialization
const specializations = await getTeacherSpecializations(teacherId);
const isQualified = specializations.some(
  (s) => s.classCode === classCode && s.subjectCode === subjectCode,
);

if (!isQualified) {
  throw new Error('Teacher not qualified for this subject');
}
```

### 3. Check for Existing Assignments

```typescript
// Before creating, check if already exists
const existing = await findClassSubjects({
  classSectionCode,
  subjectCode,
});

if (existing.length > 0) {
  // Update instead of create
  await updateClassSubject(existing[0].id, updateDto);
}
```

---

## Summary

### ✅ Features Covered

**10 API Endpoints** documented:

- Create single assignment
- Bulk create multiple assignments
- Query with filters
- Get statistics
- Find by class section
- Find by subject
- Find by teacher
- Get, Update, Delete individual assignments

### 🎯 Use Cases Supported

- Complete curriculum management
- Teacher workload balancing
- Subject coverage tracking
- Academic year transitions
- Curriculum planning and analysis
- Teacher assignment optimization
- Integration with timetable creation

### 🔒 Data Integrity

- Unique constraint: (classSectionCode, subjectCode)
- Foreign key constraints to ClassSection, Subject, Teacher
- Status-based lifecycle (ACTIVE/INACTIVE)
- Cascade delete handling
- Optional teacher assignment
- Comprehensive indexing for performance

**Total APIs: 10**

This module serves as the bridge between curriculum planning (subjects) and class organization (class sections), enabling structured academic program management.

**Last Updated**: November 12, 2024  
**Version**: 1.0  
**Status**: ✅ Complete
