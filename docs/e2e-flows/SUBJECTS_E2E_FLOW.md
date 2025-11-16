# SUBJECTS MODULE - E2E FLOW DOCUMENTATION

## Quick Reference

| UX Action | API Endpoint | Method | Step |
|-----------|-------------|--------|------|
| View All Subjects | `/subjects` | GET | 1.1 |
| Create New Subject | `/subjects` | POST | 1.2 |
| View Subject Details | `/subjects/:code` | GET | 1.3 |
| Update Subject | `/subjects/:code` | PATCH | 1.4 |
| Delete Subject | `/subjects/:code` | DELETE | 1.5 |
| Get Subjects Count | `/subjects/stats/count` | GET | 1.6 |

---

## Overview

The **Subjects Module** is a foundational component of the school management system that manages academic subjects. It provides a simple yet essential catalog of subjects that can be offered across different classes and academic years.

### Key Characteristics

1. **Master Data Management**: Subjects serve as master data referenced by multiple modules
2. **Simple Structure**: Code-based primary key with minimal fields
3. **Referenced Extensively**: Used by ClassSubject, TeacherClassSubject, Timetable, and TeacherSpecialization modules
4. **CRUD Operations**: Standard create, read, update, delete operations
5. **No Complex Hierarchy**: Flat structure without subject grouping or categorization

### Entity Structure

```typescript
Subject {
  code: string (PK, max 8 chars)
  name: string (max 100 chars)
  createdAt: Date
  updatedAt: Date
}
```

### Integration Points

- **ClassSubject**: Links subjects to class sections with assigned teachers
- **TeacherClassSubject**: Maps teachers to subjects they teach in specific classes
- **Timetable**: References subjects in class schedules
- **TeacherSpecialization**: Indicates which subjects teachers are specialized in

---

## STEP 1: Subject Management APIs

### STEP 1.1: View All Subjects

**Purpose**: Retrieve a list of all subjects in the system.

**API Endpoint**
```http
GET /subjects
```

**Request Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Sample Request**
```bash
curl -X GET http://localhost:3000/subjects \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)
```json
[
  {
    "code": "MATH101",
    "name": "Mathematics",
    "createdAt": "2024-01-15T08:00:00.000Z",
    "updatedAt": "2024-01-15T08:00:00.000Z"
  },
  {
    "code": "ENG101",
    "name": "English",
    "createdAt": "2024-01-15T08:05:00.000Z",
    "updatedAt": "2024-01-15T08:05:00.000Z"
  },
  {
    "code": "SCI101",
    "name": "Science",
    "createdAt": "2024-01-15T08:10:00.000Z",
    "updatedAt": "2024-01-15T08:10:00.000Z"
  },
  {
    "code": "HIST101",
    "name": "History",
    "createdAt": "2024-01-15T08:15:00.000Z",
    "updatedAt": "2024-01-15T08:15:00.000Z"
  }
]
```

**UX Flow**

**Screen**: Subjects List Page

```
┌─────────────────────────────────────────────────────┐
│ 📚 Subjects Management                   [+ Add]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Search: [________________]  🔍                      │
│                                                     │
│ ┌─────────┬───────────────┬─────────────────────┐ │
│ │ Code    │ Subject Name  │ Actions             │ │
│ ├─────────┼───────────────┼─────────────────────┤ │
│ │ MATH101 │ Mathematics   │ [View] [Edit] [Del] │ │
│ │ ENG101  │ English       │ [View] [Edit] [Del] │ │
│ │ SCI101  │ Science       │ [View] [Edit] [Del] │ │
│ │ HIST101 │ History       │ [View] [Edit] [Del] │ │
│ └─────────┴───────────────┴─────────────────────┘ │
│                                                     │
│ Showing 4 subjects                                  │
└─────────────────────────────────────────────────────┘
```

**Use Cases**
- Academic coordinator reviews all available subjects
- Admin checks existing subjects before adding new ones
- Teacher views subjects they can be assigned to teach
- System displays subject dropdown options during class setup

---

### STEP 1.2: Create New Subject

**Purpose**: Add a new subject to the system.

**API Endpoint**
```http
POST /subjects
```

**Request Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "code": "PHY101",
  "name": "Physics"
}
```

**Validation Rules**
- `code`: Required, string, max 8 characters, unique
- `name`: Required, string, max 100 characters

**Sample Request**
```bash
curl -X POST http://localhost:3000/subjects \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "code": "PHY101",
    "name": "Physics"
  }'
```

**Sample Response** (201 Created)
```json
{
  "code": "PHY101",
  "name": "Physics",
  "createdAt": "2024-03-15T10:30:00.000Z",
  "updatedAt": "2024-03-15T10:30:00.000Z"
}
```

**Error Responses**

**400 Bad Request** - Invalid Data
```json
{
  "statusCode": 400,
  "message": [
    "Code is required",
    "Code must not exceed 8 characters",
    "Name is required"
  ],
  "error": "Bad Request"
}
```

**409 Conflict** - Duplicate Code
```json
{
  "statusCode": 409,
  "message": "Subject with code PHY101 already exists",
  "error": "Conflict"
}
```

**UX Flow**

**Screen**: Add New Subject Modal/Form

```
┌─────────────────────────────────────────┐
│ Add New Subject                    [X]  │
├─────────────────────────────────────────┤
│                                         │
│ Subject Code *                          │
│ ┌─────────────────────────────────────┐ │
│ │ PHY101                              │ │
│ └─────────────────────────────────────┘ │
│ Max 8 characters (e.g., MATH101)        │
│                                         │
│ Subject Name *                          │
│ ┌─────────────────────────────────────┐ │
│ │ Physics                             │ │
│ └─────────────────────────────────────┘ │
│ Max 100 characters                      │
│                                         │
│           [Cancel]  [Create Subject]    │
└─────────────────────────────────────────┘
```

**Use Cases**
- New subject introduced in curriculum
- Adding elective subjects for higher grades
- Creating subject entries before academic year setup
- Admin setting up initial subject catalog

**Business Rules**
1. Subject code must be unique across the system
2. Subject code should follow institutional naming convention
3. Once created, subject code cannot be changed (primary key)
4. Subject name should clearly identify the subject

---

### STEP 1.3: View Subject Details

**Purpose**: Retrieve detailed information about a specific subject.

**API Endpoint**
```http
GET /subjects/:code
```

**Path Parameters**
- `code` (string): Subject code (e.g., MATH101)

**Request Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Sample Request**
```bash
curl -X GET http://localhost:3000/subjects/MATH101 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)
```json
{
  "code": "MATH101",
  "name": "Mathematics",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-02-20T14:30:00.000Z"
}
```

**Error Responses**

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Subject with code INVALID not found",
  "error": "Not Found"
}
```

**UX Flow**

**Screen**: Subject Details Page

```
┌─────────────────────────────────────────────────────┐
│ ← Back to Subjects                                  │
├─────────────────────────────────────────────────────┤
│ 📚 Subject Details                    [Edit] [Delete]│
├─────────────────────────────────────────────────────┤
│                                                     │
│ Subject Code                                        │
│ MATH101                                             │
│                                                     │
│ Subject Name                                        │
│ Mathematics                                         │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ System Information                                  │
│ • Created: Jan 15, 2024 at 8:00 AM                 │
│ • Last Updated: Feb 20, 2024 at 2:30 PM            │
│                                                     │
│ ─────────────────────────────────────────────────  │
│                                                     │
│ 📊 Usage Statistics                                 │
│ • Assigned to 12 class sections                    │
│ • Taught by 5 teachers                             │
│ • Appears in 8 timetable slots                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Use Cases**
- View complete subject information
- Verify subject details before making changes
- Check when subject was created or last modified
- Review subject before deletion

---

### STEP 1.4: Update Subject

**Purpose**: Modify an existing subject's information.

**API Endpoint**
```http
PATCH /subjects/:code
```

**Path Parameters**
- `code` (string): Subject code (e.g., MATH101)

**Request Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**
```json
{
  "name": "Mathematics - Advanced"
}
```

**Validation Rules**
- `name`: Optional, string, max 100 characters
- `code`: Cannot be updated (primary key)

**Sample Request**
```bash
curl -X PATCH http://localhost:3000/subjects/MATH101 \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mathematics - Advanced"
  }'
```

**Sample Response** (200 OK)
```json
{
  "code": "MATH101",
  "name": "Mathematics - Advanced",
  "createdAt": "2024-01-15T08:00:00.000Z",
  "updatedAt": "2024-03-15T11:45:00.000Z"
}
```

**Error Responses**

**404 Not Found**
```json
{
  "statusCode": 404,
  "message": "Subject with code INVALID not found",
  "error": "Not Found"
}
```

**400 Bad Request**
```json
{
  "statusCode": 400,
  "message": [
    "Name must not exceed 100 characters"
  ],
  "error": "Bad Request"
}
```

**UX Flow**

**Screen**: Edit Subject Form

```
┌─────────────────────────────────────────┐
│ Edit Subject                       [X]  │
├─────────────────────────────────────────┤
│                                         │
│ Subject Code (Cannot be changed)        │
│ ┌─────────────────────────────────────┐ │
│ │ MATH101                   [Disabled]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Subject Name *                          │
│ ┌─────────────────────────────────────┐ │
│ │ Mathematics - Advanced              │ │
│ └─────────────────────────────────────┘ │
│ Max 100 characters                      │
│                                         │
│          [Cancel]  [Update Subject]     │
└─────────────────────────────────────────┘
```

**Use Cases**
- Correct spelling mistakes in subject name
- Update subject name to be more descriptive
- Rebrand subject names according to new curriculum
- Add specialization indicators to subject names

**Business Rules**
1. Subject code (primary key) cannot be modified
2. Name updates reflect immediately across all references
3. Historical records maintain the updated name
4. Name changes don't break existing relationships

---

### STEP 1.5: Delete Subject

**Purpose**: Remove a subject from the system.

**API Endpoint**
```http
DELETE /subjects/:code
```

**Path Parameters**
- `code` (string): Subject code (e.g., MATH101)

**Request Headers**
```
Authorization: Bearer <token>
```

**Sample Request**
```bash
curl -X DELETE http://localhost:3000/subjects/OLD101 \
  -H "Authorization: Bearer eyJhbGc..."
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
  "message": "Subject with code OLD101 not found",
  "error": "Not Found"
}
```

**409 Conflict** - Subject in Use
```json
{
  "statusCode": 409,
  "message": "Cannot delete subject. It is referenced by existing class subjects, timetables, or teacher assignments",
  "error": "Conflict"
}
```

**UX Flow**

**Screen**: Delete Confirmation Dialog

```
┌─────────────────────────────────────────┐
│ ⚠️  Confirm Deletion                    │
├─────────────────────────────────────────┤
│                                         │
│ Are you sure you want to delete this    │
│ subject?                                │
│                                         │
│ Subject Code: OLD101                    │
│ Subject Name: Obsolete Subject          │
│                                         │
│ ⚠️ Warning:                             │
│ This action cannot be undone.           │
│                                         │
│ This subject will be permanently        │
│ removed from the system. Ensure it is   │
│ not assigned to any classes or teachers.│
│                                         │
│          [Cancel]  [Delete Subject]     │
│                                ^^^^^^   │
│                              (Red btn)  │
└─────────────────────────────────────────┘
```

**Use Cases**
- Remove subjects no longer offered
- Clean up test/duplicate subjects
- Delete incorrectly created subjects
- Archive discontinued curriculum subjects

**Business Rules**
1. Cannot delete if subject is referenced in ClassSubject
2. Cannot delete if subject is in Timetable
3. Cannot delete if subject is in TeacherClassSubject
4. Cannot delete if subject is in TeacherSpecialization
5. Deletion is permanent and cannot be undone
6. Consider soft delete if historical data needs preservation

**Pre-deletion Checklist**
- [ ] No active class-subject assignments
- [ ] No timetable entries
- [ ] No teacher assignments
- [ ] No teacher specializations
- [ ] Backup data if needed for records

---

### STEP 1.6: Get Subjects Count

**Purpose**: Retrieve the total number of subjects in the system.

**API Endpoint**
```http
GET /subjects/stats/count
```

**Request Headers**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Sample Request**
```bash
curl -X GET http://localhost:3000/subjects/stats/count \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json"
```

**Sample Response** (200 OK)
```json
{
  "count": 15
}
```

**UX Flow**

**Screen**: Dashboard Statistics Card

```
┌─────────────────────────────────────────┐
│ 📚 Subjects Overview                    │
├─────────────────────────────────────────┤
│                                         │
│         15                              │
│     Total Subjects                      │
│                                         │
│  [View All Subjects →]                  │
│                                         │
└─────────────────────────────────────────┘
```

**Use Cases**
- Display statistics on dashboard
- Show subject count in reports
- Monitor growth of subject catalog
- Quick overview for administrators

---

## STEP 2: Integration with Other Modules

### 2.1 Integration with ClassSubject Module

The Subjects module integrates tightly with the ClassSubject module to assign subjects to specific class sections.

**Flow**: Assign Subject to Class Section

```http
# Step 1: Verify subject exists
GET /subjects/MATH101

# Step 2: Create class-subject assignment
POST /class-subjects
{
  "classSectionCode": "10-A-2024",
  "subjectCode": "MATH101",
  "teacherId": "uuid-teacher-123",
  "status": "ACTIVE"
}
```

**Example Response**
```json
{
  "id": "uuid-class-subject-456",
  "classSectionCode": "10-A-2024",
  "subjectCode": "MATH101",
  "teacherId": "uuid-teacher-123",
  "status": "ACTIVE",
  "notes": null,
  "createdAt": "2024-03-15T12:00:00.000Z",
  "updatedAt": "2024-03-15T12:00:00.000Z"
}
```

**Database Relationship**
```sql
-- class_subjects table has FK to subjects
ALTER TABLE class_subjects
  ADD CONSTRAINT fk_class_subject_subject
  FOREIGN KEY (subjectCode)
  REFERENCES subjects(code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
```

---

### 2.2 Integration with Timetable Module

Subjects are referenced in timetable entries to schedule classes.

**Flow**: Create Timetable Entry with Subject

```http
# Step 1: Get subject details
GET /subjects/ENG101

# Step 2: Create timetable slot
POST /timetables
{
  "classSectionCode": "10-A-2024",
  "subjectCode": "ENG101",
  "teacherId": "uuid-teacher-456",
  "dayOfWeek": "MONDAY",
  "periodNumber": 1,
  "startTime": "08:00:00",
  "endTime": "08:45:00",
  "roomNumber": "R-201"
}
```

**UX Integration**

```
┌─────────────────────────────────────────────────────┐
│ 🗓️  Class 10-A Timetable - Monday                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Period 1: 08:00 - 08:45                            │
│ Subject: [English ▼]  (from subjects list)         │
│ Teacher: [Ms. Smith ▼]                             │
│ Room: R-201                                         │
│                                                     │
│ Period 2: 08:45 - 09:30                            │
│ Subject: [Mathematics ▼]  (from subjects list)     │
│ Teacher: [Mr. Kumar ▼]                             │
│ Room: R-105                                         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### 2.3 Integration with TeacherSpecialization Module

Subjects are linked to teachers' specializations.

**Flow**: Assign Subject Specialization to Teacher

```http
# Step 1: Verify subject
GET /subjects/SCI101

# Step 2: Create teacher specialization
POST /teacher-specializations
{
  "teacherId": "uuid-teacher-789",
  "subjectCode": "SCI101",
  "proficiencyLevel": "EXPERT",
  "yearsOfExperience": 10
}
```

**Use Case**
- Track which subjects each teacher is qualified to teach
- Match teachers to subjects based on expertise
- Plan teacher assignments for new academic year
- Identify subject coverage gaps in teaching staff

---

## STEP 3: Complete Workflows

### Workflow 1: Setting Up Subjects for New Academic Year

**Timeline**: Before academic year starts (March/April)

**Steps:**

1. **Review Current Subjects**
   ```http
   GET /subjects
   ```

2. **Add New Subjects** (if curriculum changed)
   ```http
   POST /subjects
   {
     "code": "AI101",
     "name": "Artificial Intelligence Basics"
   }
   ```

3. **Update Subject Names** (if rebranding)
   ```http
   PATCH /subjects/COMP101
   {
     "name": "Computer Science - Updated Curriculum"
   }
   ```

4. **Verify Subject Count**
   ```http
   GET /subjects/stats/count
   ```

5. **Assign Subjects to Class Sections**
   ```http
   POST /class-subjects
   {
     "classSectionCode": "11-A-2025",
     "subjectCode": "AI101",
     "status": "ACTIVE"
   }
   ```

**Success Criteria**
- All required subjects created
- Subject names are clear and descriptive
- Subjects assigned to appropriate class sections
- No orphaned or unused subjects

---

### Workflow 2: Mid-Year Subject Management

**Scenario**: Adding an elective subject mid-year

**Steps:**

1. **Create New Elective Subject**
   ```http
   POST /subjects
   {
     "code": "ELECT01",
     "name": "Advanced Robotics"
   }
   ```

2. **Assign to Specific Sections**
   ```http
   POST /class-subjects
   {
     "classSectionCode": "12-A-2024",
     "subjectCode": "ELECT01",
     "teacherId": "uuid-teacher-robotics",
     "status": "ACTIVE"
   }
   ```

3. **Add to Timetable**
   ```http
   POST /timetables
   {
     "classSectionCode": "12-A-2024",
     "subjectCode": "ELECT01",
     "dayOfWeek": "FRIDAY",
     "periodNumber": 7,
     "startTime": "14:00:00",
     "endTime": "15:00:00"
   }
   ```

4. **Verify Setup**
   ```http
   GET /subjects/ELECT01
   GET /class-subjects?subjectCode=ELECT01
   ```

---

### Workflow 3: Subject Cleanup and Archival

**Timeline**: End of academic year

**Steps:**

1. **Identify Unused Subjects**
   ```http
   GET /subjects
   # Manually check which are not assigned
   ```

2. **Check Dependencies** (Before deletion)
   ```http
   GET /class-subjects?subjectCode=OLD101
   GET /timetables?subjectCode=OLD101
   ```

3. **Remove Assignments** (if any)
   ```http
   DELETE /class-subjects/:id
   DELETE /timetables/:id
   ```

4. **Delete Obsolete Subject**
   ```http
   DELETE /subjects/OLD101
   ```

5. **Verify Deletion**
   ```http
   GET /subjects
   # Confirm OLD101 is removed
   ```

**Caution**
- Always check for dependencies before deletion
- Consider keeping subjects for historical records
- Document reason for deletion
- Backup data before bulk deletions

---

## STEP 4: Error Handling & Edge Cases

### Error Scenario 1: Creating Duplicate Subject

**Request**
```http
POST /subjects
{
  "code": "MATH101",
  "name": "Mathematics"
}
```

**Error Response** (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "Subject with code MATH101 already exists",
  "error": "Conflict"
}
```

**UX Handling**
```
┌─────────────────────────────────────────┐
│ ❌ Error                                │
├─────────────────────────────────────────┤
│                                         │
│ A subject with code "MATH101" already  │
│ exists in the system.                   │
│                                         │
│ Please use a different subject code or  │
│ update the existing subject instead.    │
│                                         │
│ [View Existing Subject] [Change Code]   │
└─────────────────────────────────────────┘
```

---

### Error Scenario 2: Deleting Subject with Dependencies

**Request**
```http
DELETE /subjects/MATH101
```

**Error Response** (409 Conflict)
```json
{
  "statusCode": 409,
  "message": "Cannot delete subject MATH101. It is currently assigned to 5 class sections and appears in 12 timetable entries.",
  "error": "Conflict",
  "details": {
    "classSubjectCount": 5,
    "timetableCount": 12,
    "teacherSpecializationCount": 3
  }
}
```

**UX Handling**
```
┌─────────────────────────────────────────┐
│ ⚠️  Cannot Delete Subject               │
├─────────────────────────────────────────┤
│                                         │
│ Subject "MATH101 - Mathematics" cannot  │
│ be deleted because it is currently in   │
│ use:                                    │
│                                         │
│ • Assigned to 5 class sections          │
│ • Referenced in 12 timetable entries    │
│ • Linked to 3 teacher specializations   │
│                                         │
│ Please remove all dependencies before   │
│ deleting this subject.                  │
│                                         │
│ [View Dependencies] [Cancel]            │
└─────────────────────────────────────────┘
```

**Resolution Steps**
1. Remove class-subject assignments
2. Delete timetable entries
3. Remove teacher specializations
4. Retry subject deletion

---

### Error Scenario 3: Invalid Subject Code Format

**Request**
```http
POST /subjects
{
  "code": "MATHEMATICS-ADVANCED-2024",
  "name": "Mathematics"
}
```

**Error Response** (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "Code must not exceed 8 characters"
  ],
  "error": "Bad Request"
}
```

**UX Handling**
```
┌─────────────────────────────────────────┐
│ Add New Subject                    [X]  │
├─────────────────────────────────────────┤
│                                         │
│ Subject Code *                          │
│ ┌─────────────────────────────────────┐ │
│ │ MATHEMATICS-ADVANCED-2024           │ │
│ └─────────────────────────────────────┘ │
│ ❌ Code must not exceed 8 characters    │
│                                         │
│ Suggestion: Use "MATHAD24" or "ADV-M24" │
│                                         │
└─────────────────────────────────────────┘
```

---

### Error Scenario 4: Subject Not Found

**Request**
```http
GET /subjects/INVALID
```

**Error Response** (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Subject with code INVALID not found",
  "error": "Not Found"
}
```

**UX Handling**
```
┌─────────────────────────────────────────┐
│ 🔍 Subject Not Found                    │
├─────────────────────────────────────────┤
│                                         │
│ The subject with code "INVALID" does    │
│ not exist in the system.                │
│                                         │
│ • It may have been deleted              │
│ • The code might be incorrect           │
│ • You may need to create it first       │
│                                         │
│ [Search All Subjects] [Create Subject]  │
└─────────────────────────────────────────┘
```

---

## STEP 5: Testing Scenarios

### Test Case 1: Complete CRUD Operations

```javascript
describe('Subjects Module - CRUD Operations', () => {
  let subjectCode: string;

  it('should create a new subject', async () => {
    const createDto = {
      code: 'TEST001',
      name: 'Test Subject'
    };

    const response = await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(201);

    expect(response.body.code).toBe('TEST001');
    expect(response.body.name).toBe('Test Subject');
    subjectCode = response.body.code;
  });

  it('should retrieve all subjects', async () => {
    const response = await request(app)
      .get('/subjects')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should retrieve subject by code', async () => {
    const response = await request(app)
      .get(`/subjects/${subjectCode}`)
      .expect(200);

    expect(response.body.code).toBe(subjectCode);
    expect(response.body.name).toBe('Test Subject');
  });

  it('should update subject', async () => {
    const updateDto = {
      name: 'Test Subject - Updated'
    };

    const response = await request(app)
      .patch(`/subjects/${subjectCode}`)
      .send(updateDto)
      .expect(200);

    expect(response.body.name).toBe('Test Subject - Updated');
  });

  it('should delete subject', async () => {
    await request(app)
      .delete(`/subjects/${subjectCode}`)
      .expect(204);

    await request(app)
      .get(`/subjects/${subjectCode}`)
      .expect(404);
  });
});
```

---

### Test Case 2: Validation Testing

```javascript
describe('Subjects Module - Validation', () => {
  it('should reject subject with missing code', async () => {
    const createDto = {
      name: 'Test Subject'
    };

    const response = await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(400);

    expect(response.body.message).toContain('Code is required');
  });

  it('should reject subject with code exceeding max length', async () => {
    const createDto = {
      code: 'VERYLONGCODE123',
      name: 'Test Subject'
    };

    const response = await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(400);

    expect(response.body.message).toContain('Code must not exceed 8 characters');
  });

  it('should reject subject with missing name', async () => {
    const createDto = {
      code: 'TEST001'
    };

    const response = await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(400);

    expect(response.body.message).toContain('Name is required');
  });

  it('should reject duplicate subject code', async () => {
    const createDto = {
      code: 'DUP001',
      name: 'Duplicate Test'
    };

    await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(201);

    const response = await request(app)
      .post('/subjects')
      .send(createDto)
      .expect(409);

    expect(response.body.message).toContain('already exists');
  });
});
```

---

### Test Case 3: Integration Testing

```javascript
describe('Subjects Module - Integration with ClassSubject', () => {
  let subjectCode: string;
  let classSectionCode: string;

  beforeAll(async () => {
    // Create test subject
    const subject = await request(app)
      .post('/subjects')
      .send({ code: 'INT001', name: 'Integration Test Subject' })
      .expect(201);

    subjectCode = subject.body.code;

    // Create test class section
    const classSection = await request(app)
      .post('/class-sections')
      .send({
        code: 'TEST-A',
        academicYearCode: 'AY2024',
        classCode: '10',
        sectionCode: 'A',
        capacity: 40
      })
      .expect(201);

    classSectionCode = classSection.body.code;
  });

  it('should assign subject to class section', async () => {
    const response = await request(app)
      .post('/class-subjects')
      .send({
        classSectionCode,
        subjectCode,
        status: 'ACTIVE'
      })
      .expect(201);

    expect(response.body.subjectCode).toBe(subjectCode);
    expect(response.body.classSectionCode).toBe(classSectionCode);
  });

  it('should prevent deletion of subject with class assignments', async () => {
    const response = await request(app)
      .delete(`/subjects/${subjectCode}`)
      .expect(409);

    expect(response.body.message).toContain('cannot delete');
  });

  afterAll(async () => {
    // Clean up test data
    await request(app).delete(`/class-subjects`);
    await request(app).delete(`/subjects/${subjectCode}`);
    await request(app).delete(`/class-sections/${classSectionCode}`);
  });
});
```

---

### Test Case 4: Statistics Endpoint

```javascript
describe('Subjects Module - Statistics', () => {
  it('should return subjects count', async () => {
    const response = await request(app)
      .get('/subjects/stats/count')
      .expect(200);

    expect(response.body).toHaveProperty('count');
    expect(typeof response.body.count).toBe('number');
    expect(response.body.count).toBeGreaterThanOrEqual(0);
  });

  it('should update count after creating subject', async () => {
    const initialCount = await request(app)
      .get('/subjects/stats/count')
      .expect(200);

    await request(app)
      .post('/subjects')
      .send({ code: 'CNT001', name: 'Count Test' })
      .expect(201);

    const newCount = await request(app)
      .get('/subjects/stats/count')
      .expect(200);

    expect(newCount.body.count).toBe(initialCount.body.count + 1);

    // Cleanup
    await request(app).delete('/subjects/CNT001');
  });
});
```

---

## STEP 6: Database Schema

### Subjects Table

```sql
CREATE TABLE subjects (
  code VARCHAR(8) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_subjects_name ON subjects(name);
CREATE INDEX idx_subjects_created_at ON subjects(created_at);
```

### Sample Data Migration

```sql
-- Insert common subjects
INSERT INTO subjects (code, name) VALUES
  ('MATH101', 'Mathematics'),
  ('ENG101', 'English'),
  ('SCI101', 'Science'),
  ('HIST101', 'History'),
  ('GEO101', 'Geography'),
  ('PHY101', 'Physics'),
  ('CHEM101', 'Chemistry'),
  ('BIO101', 'Biology'),
  ('COMP101', 'Computer Science'),
  ('ART101', 'Arts'),
  ('PE101', 'Physical Education'),
  ('MUS101', 'Music');
```

### Foreign Key Relationships

```sql
-- ClassSubject references Subject
ALTER TABLE class_subjects
  ADD CONSTRAINT fk_class_subject_subject
  FOREIGN KEY (subjectCode)
  REFERENCES subjects(code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Timetable references Subject
ALTER TABLE timetables
  ADD CONSTRAINT fk_timetable_subject
  FOREIGN KEY (subjectCode)
  REFERENCES subjects(code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- TeacherSpecialization references Subject
ALTER TABLE teacher_specializations
  ADD CONSTRAINT fk_teacher_specialization_subject
  FOREIGN KEY (subjectCode)
  REFERENCES subjects(code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- TeacherClassSubject references Subject
ALTER TABLE teacher_class_subjects
  ADD CONSTRAINT fk_teacher_class_subject_subject
  FOREIGN KEY (subjectCode)
  REFERENCES subjects(code)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;
```

---

## STEP 7: Best Practices

### 1. Subject Code Naming Conventions

**Recommended Format**: `[DOMAIN][LEVEL][SEQUENCE]`

Examples:
- `MATH101` - Mathematics, Level 1, Sequence 01
- `ENG201` - English, Level 2, Sequence 01
- `SCI301` - Science, Level 3, Sequence 01
- `ELECT01` - Elective, Sequence 01

**Guidelines**:
- Keep codes short (max 8 characters)
- Use uppercase letters and numbers
- Be consistent across subjects
- Make codes intuitive and meaningful
- Avoid special characters except hyphens

---

### 2. Subject Name Guidelines

**Good Examples**:
- ✅ "Mathematics - Advanced"
- ✅ "English Language & Literature"
- ✅ "Physical Education"
- ✅ "Computer Science Fundamentals"

**Bad Examples**:
- ❌ "Math" (too vague)
- ❌ "Subject 101" (not descriptive)
- ❌ "Mr. Kumar's Class" (teacher-specific)
- ❌ "MATHEMATICS ADVANCED LEVEL TWO SEMESTER ONE" (too long)

---

### 3. Deletion Safety

**Before Deleting a Subject**:

1. **Check Dependencies**
   ```sql
   SELECT COUNT(*) FROM class_subjects WHERE subjectCode = 'SUBJ001';
   SELECT COUNT(*) FROM timetables WHERE subjectCode = 'SUBJ001';
   SELECT COUNT(*) FROM teacher_specializations WHERE subjectCode = 'SUBJ001';
   ```

2. **Alternative: Soft Delete** (if needed)
   ```typescript
   // Add isActive field to entity
   @Column({
     type: DataType.BOOLEAN,
     defaultValue: true
   })
   isActive: boolean;

   // Update instead of delete
   await subject.update({ isActive: false });
   ```

3. **Archive Data**
   ```sql
   -- Create archive table
   CREATE TABLE subjects_archive AS SELECT * FROM subjects WHERE code = 'OLD001';
   ```

---

### 4. Performance Optimization

**Caching Strategy**:
```typescript
// Cache subjects list (rarely changes)
@Cacheable('subjects-list', 3600) // Cache for 1 hour
async findAll(): Promise<Subject[]> {
  return this.subjectRepository.findAll();
}
```

**Batch Operations**:
```typescript
// Create multiple subjects efficiently
async createBatch(subjects: CreateSubjectDto[]): Promise<Subject[]> {
  return this.subjectRepository.bulkCreate(subjects);
}
```

---

### 5. Security Considerations

**Role-Based Access**:
```typescript
@Post()
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN', 'ACADEMIC_COORDINATOR')
async create(@Body() dto: CreateSubjectDto) {
  // Only admins and coordinators can create subjects
}

@Delete(':code')
@UseGuards(AuthGuard, RolesGuard)
@Roles('ADMIN')
async remove(@Param('code') code: string) {
  // Only admins can delete subjects
}
```

**Audit Logging**:
```typescript
async create(dto: CreateSubjectDto): Promise<Subject> {
  const subject = await this.subjectRepository.create(dto);
  
  await this.auditService.log({
    action: 'SUBJECT_CREATED',
    entityType: 'SUBJECT',
    entityId: subject.code,
    userId: this.currentUser.id,
    details: { code: subject.code, name: subject.name }
  });
  
  return subject;
}
```

---

## STEP 8: UX Flows Coverage

### Coverage Matrix

| UX Flow | API Endpoint | Status |
|---------|--------------|--------|
| List all subjects | GET /subjects | ✅ |
| Search subjects | GET /subjects (with client filter) | ✅ |
| View subject details | GET /subjects/:code | ✅ |
| Create new subject | POST /subjects | ✅ |
| Edit subject | PATCH /subjects/:code | ✅ |
| Delete subject | DELETE /subjects/:code | ✅ |
| View subject count | GET /subjects/stats/count | ✅ |
| Assign to class section | POST /class-subjects | ✅ |

**Coverage**: 8/8 flows (100%)

---

## Summary

The **Subjects Module** provides a simple yet essential foundation for managing academic subjects in the school management system. Key highlights:

### ✅ Implemented Features
- Complete CRUD operations for subjects
- Code-based primary key system (max 8 chars)
- Integration with ClassSubject, Timetable, and TeacherSpecialization modules
- Subject count statistics endpoint
- Comprehensive validation and error handling
- Foreign key constraints preventing orphaned data

### 🎯 Use Cases Covered
- Academic year setup with subject catalog
- Subject assignment to class sections
- Timetable planning with subjects
- Teacher specialization tracking
- Subject-based reporting and statistics

### 🔒 Data Integrity
- Unique subject codes
- Foreign key constraints on dependent tables
- Deletion restrictions for referenced subjects
- Audit trail via timestamps

### 📊 Business Value
- Centralized subject management
- Consistent subject references across modules
- Easy maintenance and updates
- Clear separation of subject master data

This module serves as the backbone for curriculum management, enabling the school to maintain a standardized catalog of subjects that can be consistently referenced across class sections, timetables, and teacher assignments.
