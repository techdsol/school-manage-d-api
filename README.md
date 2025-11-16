# School Management API

A comprehensive RESTful API built with NestJS and MySQL for managing school operations including students, teachers, classes, subjects, and attendance tracking.

## 🚀 Features

- **Student Management**: Complete CRUD operations for student records
- **Teacher Management**: Manage teacher information and specializations
- **Class Management**: Hierarchical class structure with types, classes, and sections
- **Academic Year Management**: Track and manage academic years
- **Subject Management**: Organize subjects and teacher-subject assignments
- **Student Assignments**: Assign students to class sections
- **Student Attendance**: Track daily attendance with multiple status types
- **Class Teacher Assignments**: Assign primary and secondary teachers to class sections
- **Health Checks**: Application health monitoring endpoints

## 📋 Table of Contents

- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Module Documentation](#module-documentation)
  - [Students Module](#students-module)
  - [Teachers Module](#teachers-module)
  - [Classes Module](#classes-module)
  - [Academic Years Module](#academic-years-module)
  - [Subjects Module](#subjects-module)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

## 🛠 Technology Stack

- **Framework**: NestJS v10.0.0
- **Runtime**: Node.js
- **Web Server**: Fastify
- **Database**: MySQL
- **ORM**: Sequelize
- **Documentation**: Swagger/OpenAPI
- **Validation**: class-validator
- **Language**: TypeScript

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/techdsol/school-manage-d-api.git

# Navigate to project directory
cd school-manage-d-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run the application
npm run start:dev
```

### Environment Variables

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=school_db
PORT=3000
```

### Access Points

- **API**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 📚 Module Documentation

### Students Module

The Students module handles all student-related operations including student records, class assignments, and attendance tracking.

#### Core Functionality

##### 1. Student Management (`/students`)

**Create Student**

- **Endpoint**: `POST /students`
- **Description**: Register a new student in the system
- **Features**:
  - Validates unique email and admission number
  - Stores personal information (name, email, phone, address)
  - Records admission date and guardian information
  - Supports optional profile photo URL

**Get All Students**

- **Endpoint**: `GET /students`
- **Description**: Retrieve paginated list of students
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search by name, email, or admission number
  - `status`: Filter by status (ACTIVE/INACTIVE)

**Get Student by ID**

- **Endpoint**: `GET /students/:id`
- **Description**: Get detailed student information including active assignments

**Update Student**

- **Endpoint**: `PATCH /students/:id`
- **Description**: Update student information
- **Updatable Fields**: name, email, phone, address, dateOfBirth, gender, guardianName, guardianPhone, guardianEmail, status, photo

**Delete Student**

- **Endpoint**: `DELETE /students/:id`
- **Description**: Soft delete a student record
- **Behavior**: Sets status to INACTIVE instead of removing from database

**Get Student Count**

- **Endpoint**: `GET /students/stats/count`
- **Description**: Get total count of students (active and inactive)

##### 2. Student Assignment Management (`/student-assignments`)

**Create Assignment**

- **Endpoint**: `POST /student-assignments`
- **Description**: Assign a student to a class section
- **Validations**:
  - Student must exist and be active
  - Class section must exist
  - No duplicate active assignments for same student-section combination
  - End date must be after start date

**Get All Assignments**

- **Endpoint**: `GET /student-assignments`
- **Description**: Retrieve student assignments with filters
- **Query Parameters**:
  - `studentId`: Filter by student
  - `classSectionCode`: Filter by class section
  - `status`: Filter by status (ACTIVE/INACTIVE)
  - `page`, `limit`: Pagination

**Get Active Assignments**

- **Endpoint**: `GET /student-assignments/active`
- **Description**: Get only active assignments
- **Includes**: Student details, class section information

**Get Assignment Statistics**

- **Endpoint**: `GET /student-assignments/stats`
- **Description**: Get assignment counts by status and class section
- **Query Parameters**: `classSectionCode` (optional)

**Get Assignments by Student**

- **Endpoint**: `GET /student-assignments/student/:studentId`
- **Description**: Get all assignments for a specific student
- **Includes**: Historical and current assignments

**Get Assignments by Class Section**

- **Endpoint**: `GET /student-assignments/class-section/:classSectionCode`
- **Description**: Get all students assigned to a class section
- **Use Case**: View class roster

**Update Assignment**

- **Endpoint**: `PATCH /student-assignments/:id`
- **Description**: Update assignment details
- **Updatable Fields**: assignmentEndDate, rollNumber, status, notes

**Delete Assignment**

- **Endpoint**: `DELETE /student-assignments/:id`
- **Description**: Remove student assignment
- **Cascade**: Also removes associated attendance records

##### 3. Student Attendance Management (`/students/attendance`)

**Mark Attendance**

- **Endpoint**: `POST /students/attendance`
- **Description**: Record attendance for a single student
- **Validations**:
  - Student assignment must exist and be active
  - Cannot mark attendance for future dates
  - No duplicate attendance for same date
- **Attendance Status Options**:
  - `PRESENT`: Student is present
  - `ABSENT`: Student is absent
  - `LATE`: Student arrived late
  - `EXCUSED`: Excused absence
  - `SICK`: Absent due to illness
  - `HALF_DAY`: Present for half day

**Bulk Mark Attendance**

- **Endpoint**: `POST /students/attendance/bulk`
- **Description**: Mark attendance for multiple students at once
- **Use Case**: Daily class attendance taking
- **Features**:
  - Validates all student assignments exist
  - Ensures no inactive assignments
  - Checks for existing attendance records
  - Single transaction for all records

**Get Attendance Records**

- **Endpoint**: `GET /students/attendance`
- **Description**: Retrieve attendance records with advanced filtering
- **Query Parameters**:
  - `studentAssignmentId`: Filter by assignment
  - `classSectionCode`: Filter by class section
  - `studentId`: Filter by student
  - `attendanceDate`: Specific date
  - `startDate`, `endDate`: Date range
  - `status`: Filter by attendance status
  - `page`, `limit`: Pagination
- **Response**: Includes student details, assignment info, and attendance data

**Get Attendance Statistics**

- **Endpoint**: `GET /students/attendance/stats`
- **Description**: Calculate attendance statistics
- **Query Parameters**:
  - `classSectionCode`: For specific class
  - `studentAssignmentId`: For specific student
  - `startDate`, `endDate`: Date range
- **Returns**:
  - Total attendance records
  - Count by status (present, absent, late, excused, sick, half-day)

**Get Monthly Attendance**

- **Endpoint**: `GET /students/attendance/monthly`
- **Description**: Get monthly attendance summary for a student
- **Query Parameters**:
  - `studentAssignmentId`: Required
  - `month`: Month (1-12)
  - `year`: Year
- **Returns**:
  - Total days recorded
  - Present days count
  - Absent days count
  - Attendance percentage
  - Individual attendance records

**Update Attendance**

- **Endpoint**: `PATCH /students/attendance/:id`
- **Description**: Modify existing attendance record
- **Updatable Fields**: status, checkInTime, checkOutTime, notes, markedBy

**Delete Attendance**

- **Endpoint**: `DELETE /students/attendance/:id`
- **Description**: Remove an attendance record

---

### Teachers Module

The Teachers module manages teacher information and their subject specializations.

#### Core Functionality

##### 1. Teacher Management (`/teachers`)

**Create Teacher**

- **Endpoint**: `POST /teachers`
- **Description**: Register a new teacher
- **Required Fields**: name, email, phone, qualification, dateOfJoining
- **Validations**:
  - Unique email
  - Valid phone number format
  - Valid date formats

**Get All Teachers**

- **Endpoint**: `GET /teachers`
- **Description**: Retrieve paginated teacher list
- **Query Parameters**:
  - `page`, `limit`: Pagination
  - `search`: Search by name, email, or phone
  - `status`: Filter by ACTIVE/INACTIVE

**Get Teacher by ID**

- **Endpoint**: `GET /teachers/:id`
- **Description**: Get detailed teacher information
- **Includes**: Subject specializations and class assignments

**Update Teacher**

- **Endpoint**: `PATCH /teachers/:id`
- **Description**: Update teacher information
- **Updatable Fields**: name, email, phone, address, qualification, dateOfJoining, department, status, photo

**Delete Teacher**

- **Endpoint**: `DELETE /teachers/:id`
- **Description**: Remove teacher record
- **Cascade**: Removes associated specializations

**Get Teacher Count**

- **Endpoint**: `GET /teachers/stats/count`
- **Description**: Get total teacher count

##### 2. Teacher Specialization Management (`/teacher-specializations`)

**Create Specialization**

- **Endpoint**: `POST /teacher-specializations`
- **Description**: Assign a subject to a teacher for a specific class
- **Validations**:
  - Teacher must exist
  - Class must exist
  - Subject must exist
  - No duplicate teacher-class-subject combinations

**Get All Specializations**

- **Endpoint**: `GET /teacher-specializations`
- **Description**: Retrieve all teacher-subject assignments
- **Query Parameters**: `page`, `limit`

**Get by Teacher**

- **Endpoint**: `GET /teacher-specializations/teacher/:teacherId`
- **Description**: Get all subjects taught by a teacher
- **Includes**: Class and subject details

**Get by Class**

- **Endpoint**: `GET /teacher-specializations/class/:classCode`
- **Description**: Get all teachers for a specific class

**Get by Subject**

- **Endpoint**: `GET /teacher-specializations/subject/:subjectCode`
- **Description**: Get all teachers teaching a specific subject

**Get by Class and Subject**

- **Endpoint**: `GET /teacher-specializations/class/:classCode/subject/:subjectCode`
- **Description**: Find teachers teaching a specific subject in a class

**Update Specialization**

- **Endpoint**: `PATCH /teacher-specializations/:id`
- **Description**: Update specialization details
- **Updatable Fields**: notes

**Delete Specialization**

- **Endpoint**: `DELETE /teacher-specializations/:id`
- **Description**: Remove subject assignment from teacher

---

### Classes Module

The Classes module handles the hierarchical structure of classes including class types, classes, sections, and teacher assignments.

#### Core Functionality

##### 1. Class Type Management (`/class-types`)

**Create Class Type**

- **Endpoint**: `POST /class-types`
- **Description**: Define a new class type (e.g., Pre-Primary, Primary, Secondary)
- **Auto-generates**: Unique code based on type name
- **Validation**: Unique type and code

**Get All Class Types**

- **Endpoint**: `GET /class-types`
- **Description**: List all class types with pagination

**Get Class Type by Code**

- **Endpoint**: `GET /class-types/:code`
- **Description**: Get specific class type details
- **Includes**: Associated classes

**Update Class Type**

- **Endpoint**: `PATCH /class-types/:code`
- **Description**: Update class type information
- **Updatable Fields**: type, description

**Delete Class Type**

- **Endpoint**: `DELETE /class-types/:code`
- **Description**: Remove class type
- **Cascade**: Removes associated classes

**Get Class Type Count**

- **Endpoint**: `GET /class-types/stats/count`

##### 2. Class Management (`/classes`)

**Create Class**

- **Endpoint**: `POST /classes`
- **Description**: Create a new class (e.g., Class 1, Class 2)
- **Auto-generates**: Code based on class type and name
- **Validations**:
  - Class type must exist
  - Unique code
  - Valid fee amount

**Get All Classes**

- **Endpoint**: `GET /classes`
- **Description**: Retrieve classes with filters
- **Query Parameters**:
  - `classTypeCode`: Filter by type
  - `page`, `limit`: Pagination

**Get Class by Code**

- **Endpoint**: `GET /classes/:code`
- **Description**: Get class details
- **Includes**: Class type and sections

**Update Class**

- **Endpoint**: `PATCH /classes/:code`
- **Description**: Update class information
- **Updatable Fields**: name, description, feeAmount

**Delete Class**

- **Endpoint**: `DELETE /classes/:code`
- **Description**: Remove class
- **Restriction**: Cannot delete if sections exist

**Get Class Count**

- **Endpoint**: `GET /classes/stats/count`

##### 3. Class Section Management (`/class-sections`)

**Create Section**

- **Endpoint**: `POST /class-sections`
- **Description**: Create a section for a class (e.g., Class 1-A)
- **Auto-generates**: Code combining class code, academic year, and section
- **Validations**:
  - Class must exist
  - Academic year must exist
  - Unique section code
  - Capacity must be positive

**Get All Sections**

- **Endpoint**: `GET /class-sections`
- **Description**: List all sections with filters
- **Query Parameters**:
  - `classCode`: Filter by class
  - `academicYearCode`: Filter by year
  - `status`: Filter by ACTIVE/INACTIVE

**Get Section by Code**

- **Endpoint**: `GET /class-sections/:code`
- **Description**: Get section details
- **Includes**: Class, academic year, students, teacher assignments

**Update Section**

- **Endpoint**: `PATCH /class-sections/:code`
- **Description**: Update section information
- **Updatable Fields**: name, section, capacity, roomNumber, status

**Delete Section**

- **Endpoint**: `DELETE /class-sections/:code`
- **Description**: Remove section
- **Cascade**: Removes student assignments and attendance

**Get Section Count**

- **Endpoint**: `GET /class-sections/stats/count`

##### 4. Class Teacher Assignment Management (`/class-sections/teacher-assignments`)

**Create Teacher Assignment**

- **Endpoint**: `POST /class-sections/teacher-assignments`
- **Description**: Assign a teacher to a class section as PRIMARY or SECONDARY
- **Features**:
  - Multiple teachers can be assigned (multiple PRIMARY and SECONDARY allowed)
  - Teachers can have multiple section assignments
  - Active/Inactive status tracking
  - Date range tracking (start and optional end date)
- **Validations**:
  - Teacher must exist and be active
  - Class section must exist
  - Assignment start date cannot be in the future
  - End date must be after start date
  - No duplicate active assignments for same teacher-section-role combination
- **Assignment Roles**:
  - `PRIMARY`: Main class teacher (homeroom teacher)
  - `SECONDARY`: Assistant/co-teacher

**Get All Teacher Assignments**

- **Endpoint**: `GET /class-sections/teacher-assignments`
- **Description**: Retrieve teacher assignments with filters
- **Query Parameters**:
  - `teacherId`: Filter by teacher
  - `classSectionCode`: Filter by section
  - `role`: Filter by PRIMARY or SECONDARY
  - `status`: Filter by ACTIVE or INACTIVE
  - `page`, `limit`: Pagination
- **Includes**: Teacher details, class section information

**Get Assignment by ID**

- **Endpoint**: `GET /class-sections/teacher-assignments/:id`
- **Description**: Get specific assignment details
- **Includes**: Full teacher and section information

**Update Teacher Assignment**

- **Endpoint**: `PATCH /class-sections/teacher-assignments/:id`
- **Description**: Update assignment details
- **Updatable Fields**:
  - `role`: Change between PRIMARY and SECONDARY
  - `status`: Change between ACTIVE and INACTIVE
  - `assignmentEndDate`: Set or update end date
  - `notes`: Update notes
- **Validations**:
  - End date must be after start date if provided
  - Cannot modify assignment if already inactive

**Delete Teacher Assignment**

- **Endpoint**: `DELETE /class-sections/teacher-assignments/:id`
- **Description**: Remove teacher assignment
- **Behavior**: Permanently removes the assignment record

**Use Cases**:

- Assign homeroom teacher to a class (PRIMARY role)
- Assign assistant teachers (SECONDARY role)
- Track teacher assignment history with start/end dates
- Multiple teachers can teach the same class
- View all classes assigned to a teacher
- View all teachers assigned to a section

---

### Academic Years Module

Manages academic year cycles for the school.

#### Core Functionality

##### Academic Year Management (`/academic-years`)

**Create Academic Year**

- **Endpoint**: `POST /academic-years`
- **Description**: Define a new academic year
- **Auto-generates**: Code based on year name
- **Required Fields**: name, startDate, endDate
- **Validations**:
  - Unique code
  - End date must be after start date

**Get All Academic Years**

- **Endpoint**: `GET /academic-years`
- **Description**: List all academic years

**Get Academic Year by Code**

- **Endpoint**: `GET /academic-years/:code`
- **Description**: Get specific year details
- **Includes**: Associated class sections

**Update Academic Year**

- **Endpoint**: `PATCH /academic-years/:code`
- **Description**: Update academic year information
- **Updatable Fields**: name, startDate, endDate, status

**Delete Academic Year**

- **Endpoint**: `DELETE /academic-years/:code`
- **Description**: Remove academic year
- **Restriction**: Cannot delete if sections exist

**Get Academic Year Count**

- **Endpoint**: `GET /academic-years/stats/count`

---

### Subjects Module

Handles subject definitions and management.

#### Core Functionality

##### Subject Management (`/subjects`)

**Create Subject**

- **Endpoint**: `POST /subjects`
- **Description**: Add a new subject
- **Auto-generates**: Code based on subject name
- **Optional Fields**: description, credits

**Get All Subjects**

- **Endpoint**: `GET /subjects`
- **Description**: List all subjects with pagination

**Get Subject by Code**

- **Endpoint**: `GET /subjects/:code`
- **Description**: Get subject details
- **Includes**: Teachers teaching this subject

**Update Subject**

- **Endpoint**: `PATCH /subjects/:code`
- **Description**: Update subject information
- **Updatable Fields**: name, description, credits

**Delete Subject**

- **Endpoint**: `DELETE /subjects/:code`
- **Description**: Remove subject
- **Cascade**: Removes teacher specializations

**Get Subject Count**

- **Endpoint**: `GET /subjects/stats/count`

---

## 📖 API Documentation

### Authentication

Currently, the API does not implement authentication. This should be added in production.

### Response Format

**Success Response:**

```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "status": "ACTIVE",
  "createdAt": "2025-11-08T00:00:00.000Z",
  "updatedAt": "2025-11-08T00:00:00.000Z"
}
```

**Paginated Response:**

```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

**Error Response:**

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### HTTP Status Codes

- `200 OK`: Successful GET, PATCH requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Validation errors
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate entry or business rule violation
- `500 Internal Server Error`: Server errors

### Common Query Parameters

- `page`: Page number for pagination (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Text search across relevant fields
- `status`: Filter by ACTIVE or INACTIVE

---

## 🗄️ Database Schema

### Key Tables

1. **students**: Student personal information
2. **teachers**: Teacher information
3. **class_types**: Class categories (Pre-Primary, Primary, etc.)
4. **classes**: Class definitions (Class 1, Class 2, etc.)
5. **academic_years**: Academic year definitions
6. **class_sections**: Specific class sections (Class 1-A, Class 2-B, etc.)
7. **subjects**: Subject definitions
8. **student_assignments**: Student-to-section assignments
9. **student_attendance**: Daily attendance records
10. **teacher_class_subjects**: Teacher subject specializations
11. **class_teacher_assignments**: Teacher-to-section assignments (homeroom teachers)

### Relationships

```
class_types (1) ──→ (N) classes
classes (1) ──→ (N) class_sections
academic_years (1) ──→ (N) class_sections
class_sections (1) ──→ (N) student_assignments
class_sections (1) ──→ (N) class_teacher_assignments
students (1) ──→ (N) student_assignments
student_assignments (1) ──→ (N) student_attendance
teachers (1) ──→ (N) teacher_class_subjects
teachers (1) ──→ (N) class_teacher_assignments
subjects (1) ──→ (N) teacher_class_subjects
classes (1) ──→ (N) teacher_class_subjects
```

### Unique Constraints

- Students: email, admissionNumber
- Teachers: email
- Class Types: code, type
- Classes: code
- Class Sections: code
- Academic Years: code
- Subjects: code
- Student Assignments: unique active assignment per student-section
- Student Attendance: unique attendance per student-assignment-date
- Class Teacher Assignments: unique active assignment per teacher-section-role

---

## 🔧 Development

### Running Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Code Style

```bash
# Lint code
npm run lint

# Format code
npm run format
```

### Building for Production

```bash
# Build
npm run build

# Start production server
npm run start:prod
```

---

## 📊 Database Sync

The application uses Sequelize with `alter: true` sync mode, which means:

- Tables are automatically created if they don't exist
- Existing tables are altered to match model definitions
- **Warning**: In production, use migrations instead of auto-sync

To disable auto-sync, modify `database.config.ts`:

```typescript
sync: { force: false, alter: false }
```

---

## 🔒 Security Considerations

**For Production Deployment:**

1. **Add Authentication**: Implement JWT or session-based authentication
2. **Add Authorization**: Role-based access control (Admin, Teacher, Student)
3. **Rate Limiting**: Prevent abuse with request rate limiting
4. **Input Sanitization**: Additional XSS and SQL injection prevention
5. **HTTPS**: Use SSL/TLS certificates
6. **Environment Variables**: Secure sensitive configuration
7. **Database Migrations**: Use Sequelize migrations instead of auto-sync
8. **Logging**: Implement comprehensive logging and monitoring
9. **CORS**: Configure CORS for allowed origins only

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Support

For issues and questions, please create an issue in the GitHub repository.

---

## 🗺️ Roadmap

**Planned Features:**

- [ ] Authentication & Authorization
- [ ] Exam Management
- [ ] Grade/Marks Management
- [ ] Fee Management
- [ ] Timetable Management
- [ ] Library Management
- [ ] Transport Management
- [ ] Notification System
- [ ] Report Generation
- [ ] Mobile App APIs
- [ ] Real-time Updates with WebSockets

---

**Built with ❤️ using NestJS**
