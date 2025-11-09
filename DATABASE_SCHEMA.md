# School Management System - Sample Data

This document shows sample data for the School Management System entities with real-world examples.

## System Overview

The system manages:

- **Academic Years** - Academic year periods (foundational)
- **Subjects** - Academic subjects (independent)
- **Class Types** - Types of classes (Curricular, Extra Curricular)
- **Classes** - Specific classes/grades (depends on class types)
- **Class Sections** - Specific sections within classes for academic years (depends on classes + academic years)
- **Grades** - Grade/standard levels for academic progression (independent)
- **Teachers** - Teacher information (can be assigned to sections)
- **Students** - Student information (can be assigned to sections)
- **Student Assignments** - Assignment of students to specific class sections (depends on students + class sections)
- **Teacher Specializations** - Assignment of teachers to teach specific subjects in specific classes (depends on teachers + classes + subjects)
- **Attendance** - Daily attendance tracking for students (depends on student assignments + teachers)

---

## 1. Academic Years

_Foundation entity - defines the academic periods_

| code   | name                    | createdAt           | updatedAt           |
| ------ | ----------------------- | ------------------- | ------------------- |
| AY2023 | Academic Year 2023-2024 | 2023-06-01 10:00:00 | 2023-06-01 10:00:00 |
| AY2024 | Academic Year 2024-2025 | 2024-06-01 10:00:00 | 2024-06-01 10:00:00 |
| AY2025 | Academic Year 2025-2026 | 2025-06-01 10:00:00 | 2025-06-01 10:00:00 |

---

## 2. Subjects

_Independent entity - academic subjects that can be taught_

| code  | name               | createdAt           | updatedAt           |
| ----- | ------------------ | ------------------- | ------------------- |
| MATH  | Mathematics        | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| ENG   | English            | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| SCI   | Science            | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| SST   | Social Studies     | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| HINDI | Hindi              | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| SANS  | Sanskrit           | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| ART   | Arts & Crafts      | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| PE    | Physical Education | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| MUS   | Music              | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| COMP  | Computer Science   | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| BIO   | Biology            | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| CHEM  | Chemistry          | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| PHYS  | Physics            | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GEOG  | Geography          | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| HIST  | History            | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |

---

## 3. Class Types

_Foundation entity - defines curriculum types_

| code | type             | createdAt           | updatedAt           |
| ---- | ---------------- | ------------------- | ------------------- |
| CURR | Curricular       | 2024-01-01 08:00:00 | 2024-01-01 08:00:00 |
| EXTR | Extra Curricular | 2024-01-01 08:00:00 | 2024-01-01 08:00:00 |

---

## 4. Classes

_Depends on Class Types - specific grades within curriculum types_

| code | name               | classTypeCode | createdAt           | updatedAt           |
| ---- | ------------------ | ------------- | ------------------- | ------------------- |
| LKG  | Lower Kindergarten | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| UKG  | Upper Kindergarten | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 1    | Class 1            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 2    | Class 2            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 3    | Class 3            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 4    | Class 4            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 5    | Class 5            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 6    | Class 6            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 7    | Class 7            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 8    | Class 8            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 9    | Class 9            | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 10   | Class 10           | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 11   | Class 11           | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| 12   | Class 12           | CURR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| ARTS | Arts & Crafts      | EXTR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |
| SPRT | Sports             | EXTR          | 2024-01-02 09:00:00 | 2024-01-02 09:00:00 |

---

## 5. Class Sections

_Depends on Classes + Academic Years - specific sections of classes for academic periods_

| code | classCode | section | name                      | academicYearCode | createdAt           | updatedAt           |
| ---- | --------- | ------- | ------------------------- | ---------------- | ------------------- | ------------------- |
| LKGA | LKG       | A       | LKG Section A - 2024      | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| LKGB | LKG       | B       | LKG Section B - 2024      | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| UKGA | UKG       | A       | UKG Section A - 2024      | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| UKGB | UKG       | B       | UKG Section B - 2024      | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 1A   | 1         | A       | Class 1 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 1B   | 1         | B       | Class 1 Section B - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 2A   | 2         | A       | Class 2 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 2B   | 2         | B       | Class 2 Section B - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 3A   | 3         | A       | Class 3 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 4A   | 4         | A       | Class 4 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 5A   | 5         | A       | Class 5 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 6A   | 6         | A       | Class 6 Section A - 2024  | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 10A  | 10        | A       | Class 10 Section A - 2024 | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| 12A  | 12        | A       | Class 12 Section A - 2024 | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| ART1 | ARTS      | 1       | Arts Group 1 - 2024       | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |
| SPT1 | SPRT      | 1       | Sports Group 1 - 2024     | AY2024           | 2024-01-03 09:00:00 | 2024-01-03 09:00:00 |

---

## 6. Teachers

_Independent entity - can be assigned to teach class sections_

| id                                   | name               | phone           | createdAt           | updatedAt           |
| ------------------------------------ | ------------------ | --------------- | ------------------- | ------------------- |
| 660e8400-e29b-41d4-a716-446655440001 | Dr. Sarah Anderson | +91-98765-43210 | 2024-01-10 08:00:00 | 2024-01-10 08:00:00 |
| 660e8400-e29b-41d4-a716-446655440002 | Prof. James Miller | +91-98765-43211 | 2024-01-10 08:15:00 | 2024-01-10 08:15:00 |
| 660e8400-e29b-41d4-a716-446655440003 | Ms. Priya Sharma   | +91-98765-43212 | 2024-01-10 08:30:00 | 2024-01-10 08:30:00 |
| 660e8400-e29b-41d4-a716-446655440004 | Mr. Rajesh Kumar   | +91-98765-43213 | 2024-01-10 08:45:00 | 2024-01-10 08:45:00 |
| 660e8400-e29b-41d4-a716-446655440005 | Dr. Sunita Patel   | +91-98765-43214 | 2024-01-10 09:00:00 | 2024-01-10 09:00:00 |

---

## 6. Grades

_Independent entity - grade/standard levels for academic progression_

| code | name     | createdAt           | updatedAt           |
| ---- | -------- | ------------------- | ------------------- |
| GR1  | Grade 1  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR2  | Grade 2  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR3  | Grade 3  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR4  | Grade 4  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR5  | Grade 5  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR6  | Grade 6  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR7  | Grade 7  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR8  | Grade 8  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR9  | Grade 9  | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR10 | Grade 10 | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR11 | Grade 11 | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |
| GR12 | Grade 12 | 2024-01-01 10:00:00 | 2024-01-01 10:00:00 |

---

## 7. Teachers

_Independent entity - can be assigned to teach class sections_

| id                                   | name               | phone           | createdAt           | updatedAt           |
| ------------------------------------ | ------------------ | --------------- | ------------------- | ------------------- |
| 660e8400-e29b-41d4-a716-446655440001 | Dr. Sarah Anderson | +91-98765-43210 | 2024-01-10 08:00:00 | 2024-01-10 08:00:00 |
| 660e8400-e29b-41d4-a716-446655440002 | Prof. James Miller | +91-98765-43211 | 2024-01-10 08:15:00 | 2024-01-10 08:15:00 |
| 660e8400-e29b-41d4-a716-446655440003 | Ms. Priya Sharma   | +91-98765-43212 | 2024-01-10 08:30:00 | 2024-01-10 08:30:00 |
| 660e8400-e29b-41d4-a716-446655440004 | Mr. Rajesh Kumar   | +91-98765-43213 | 2024-01-10 08:45:00 | 2024-01-10 08:45:00 |
| 660e8400-e29b-41d4-a716-446655440005 | Dr. Sunita Patel   | +91-98765-43214 | 2024-01-10 09:00:00 | 2024-01-10 09:00:00 |

---

## 8. Students

_Independent entity - can be enrolled in class sections_

| id                                   | name         | phone           | createdAt           | updatedAt           |
| ------------------------------------ | ------------ | --------------- | ------------------- | ------------------- |
| 550e8400-e29b-41d4-a716-446655440001 | Aarav Kumar  | +91-98765-55101 | 2024-01-15 09:00:00 | 2024-01-15 09:00:00 |
| 550e8400-e29b-41d4-a716-446655440002 | Diya Sharma  | +91-98765-55102 | 2024-01-15 09:15:00 | 2024-01-15 09:15:00 |
| 550e8400-e29b-41d4-a716-446655440003 | Arjun Patel  | +91-98765-55103 | 2024-01-15 09:30:00 | 2024-01-15 09:30:00 |
| 550e8400-e29b-41d4-a716-446655440004 | Ananya Singh | +91-98765-55104 | 2024-01-15 09:45:00 | 2024-01-15 09:45:00 |
| 550e8400-e29b-41d4-a716-446655440005 | Rohan Gupta  | +91-98765-55105 | 2024-01-15 10:00:00 | 2024-01-15 10:00:00 |

---

## 9. Student Assignments

_Junction entity linking Students to Class Sections - manages student assignment to specific class sections_

| id                                   | studentId                            | classSectionCode | status   | notes                 | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | ---------------- | -------- | --------------------- | ------------------- | ------------------- |
| 880e8400-e29b-41d4-a716-446655440001 | 550e8400-e29b-41d4-a716-446655440001 | 1A               | ACTIVE   | Regular assignment    | 2024-04-01 08:00:00 | 2024-04-01 08:00:00 |
| 880e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440002 | 1A               | ACTIVE   | Regular assignment    | 2024-04-01 08:15:00 | 2024-04-01 08:15:00 |
| 880e8400-e29b-41d4-a716-446655440003 | 550e8400-e29b-41d4-a716-446655440003 | 2B               | ACTIVE   | Promoted from Grade 1 | 2024-04-01 08:30:00 | 2024-04-01 08:30:00 |
| 880e8400-e29b-41d4-a716-446655440004 | 550e8400-e29b-41d4-a716-446655440004 | LKGA             | ACTIVE   | New admission         | 2024-04-01 08:45:00 | 2024-04-01 08:45:00 |
| 880e8400-e29b-41d4-a716-446655440005 | 550e8400-e29b-41d4-a716-446655440005 | 10A              | INACTIVE | No longer enrolled    | 2024-04-01 09:00:00 | 2024-10-15 14:00:00 |

---

## 10. Teacher Specializations

_Junction entity linking Teachers, Classes, and Subjects - defines which teacher teaches which subject in which class_

| id                                   | teacherId                            | classCode | subjectCode | notes                 | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | --------- | ----------- | --------------------- | ------------------- | ------------------- |
| 770e8400-e29b-41d4-a716-446655440001 | 660e8400-e29b-41d4-a716-446655440001 | 1         | MATH        | Primary Math Teacher  | 2024-01-20 10:00:00 | 2024-01-20 10:00:00 |
| 770e8400-e29b-41d4-a716-446655440002 | 660e8400-e29b-41d4-a716-446655440001 | 2         | MATH        | Advanced Math Topics  | 2024-01-20 10:05:00 | 2024-01-20 10:05:00 |
| 770e8400-e29b-41d4-a716-446655440003 | 660e8400-e29b-41d4-a716-446655440002 | 1         | ENG         | Basic English         | 2024-01-20 10:10:00 | 2024-01-20 10:10:00 |
| 770e8400-e29b-41d4-a716-446655440004 | 660e8400-e29b-41d4-a716-446655440003 | LKG       | HINDI       | Native Language       | 2024-01-20 10:15:00 | 2024-01-20 10:15:00 |
| 770e8400-e29b-41d4-a716-446655440005 | 660e8400-e29b-41d4-a716-446655440003 | UKG       | HINDI       | Early Language Skills | 2024-01-20 10:20:00 | 2024-01-20 10:20:00 |
| 770e8400-e29b-41d4-a716-446655440006 | 660e8400-e29b-41d4-a716-446655440004 | 10        | SCI         | Science Foundation    | 2024-01-20 10:25:00 | 2024-01-20 10:25:00 |
| 770e8400-e29b-41d4-a716-446655440007 | 660e8400-e29b-41d4-a716-446655440004 | 12        | PHYS        | Advanced Physics      | 2024-01-20 10:30:00 | 2024-01-20 10:30:00 |
| 770e8400-e29b-41d4-a716-446655440008 | 660e8400-e29b-41d4-a716-446655440005 | ARTS      | ART         | Creative Arts Program | 2024-01-20 10:35:00 | 2024-01-20 10:35:00 |
| 770e8400-e29b-41d4-a716-446655440009 | 660e8400-e29b-41d4-a716-446655440005 | SPRT      | PE          | Sports & Physical Ed  | 2024-01-20 10:40:00 | 2024-01-20 10:40:00 |
| 770e8400-e29b-41d4-a716-446655440010 | 660e8400-e29b-41d4-a716-446655440002 | 6         | COMP        | Computer Basics       | 2024-01-20 10:45:00 | 2024-01-20 10:45:00 |

---

## 11. Attendance

_Tracks daily attendance for students in their assigned class sections_

| id                                   | studentAssignmentId                  | attendanceDate | status   | checkInTime | checkOutTime | notes                  | markedBy                             | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | -------------- | -------- | ----------- | ------------ | ---------------------- | ------------------------------------ | ------------------- | ------------------- |
| 990e8400-e29b-41d4-a716-446655440001 | 880e8400-e29b-41d4-a716-446655440001 | 2024-11-01     | PRESENT  | 08:30:00    | 15:00:00     | On time                | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:30:00 | 2024-11-01 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440002 | 880e8400-e29b-41d4-a716-446655440002 | 2024-11-01     | LATE     | 09:15:00    | 15:00:00     | Arrived 45 mins late   | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 09:15:00 | 2024-11-01 09:15:00 |
| 990e8400-e29b-41d4-a716-446655440003 | 880e8400-e29b-41d4-a716-446655440003 | 2024-11-01     | PRESENT  | 08:25:00    | 15:00:00     | Early arrival          | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-01 08:25:00 | 2024-11-01 08:25:00 |
| 990e8400-e29b-41d4-a716-446655440004 | 880e8400-e29b-41d4-a716-446655440004 | 2024-11-01     | PRESENT  | 08:30:00    | 15:00:00     | Regular attendance     | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-01 08:30:00 | 2024-11-01 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440005 | 880e8400-e29b-41d4-a716-446655440001 | 2024-11-04     | SICK     | NULL        | NULL         | Medical certificate    | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 10:00:00 | 2024-11-04 10:00:00 |
| 990e8400-e29b-41d4-a716-446655440006 | 880e8400-e29b-41d4-a716-446655440002 | 2024-11-04     | PRESENT  | 08:30:00    | 15:00:00     | NULL                   | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:30:00 | 2024-11-04 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440007 | 880e8400-e29b-41d4-a716-446655440003 | 2024-11-04     | ABSENT   | NULL        | NULL         | No notification        | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-04 16:00:00 | 2024-11-04 16:00:00 |
| 990e8400-e29b-41d4-a716-446655440008 | 880e8400-e29b-41d4-a716-446655440004 | 2024-11-04     | HALF_DAY | 08:30:00    | 12:00:00     | Left early - doctor    | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-04 08:30:00 | 2024-11-04 12:00:00 |
| 990e8400-e29b-41d4-a716-446655440009 | 880e8400-e29b-41d4-a716-446655440001 | 2024-11-05     | PRESENT  | 08:30:00    | 15:00:00     | NULL                   | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:30:00 | 2024-11-05 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440010 | 880e8400-e29b-41d4-a716-446655440002 | 2024-11-05     | PRESENT  | 08:30:00    | 15:00:00     | NULL                   | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:30:00 | 2024-11-05 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440011 | 880e8400-e29b-41d4-a716-446655440003 | 2024-11-05     | EXCUSED  | NULL        | NULL         | Family emergency       | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-05 09:00:00 | 2024-11-05 09:00:00 |
| 990e8400-e29b-41d4-a716-446655440012 | 880e8400-e29b-41d4-a716-446655440004 | 2024-11-05     | PRESENT  | 08:30:00    | 15:00:00     | NULL                   | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-05 08:30:00 | 2024-11-05 08:30:00 |

