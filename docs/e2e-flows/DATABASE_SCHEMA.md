# School Management System - Sample Data

This document shows sample data for the School Management System entities with real-world examples.

## System Overview

The system manages:

- **Academic Years** - Academic year periods (foundational)
- **Subjects** - Academic subjects (independent)
- **Class Types** - Types of classes (Curricular, Extra Curricular)
- **Classes** - Specific classes/grades (depends on class types)
- **Class Sections** - Specific sections within classes for academic years (depends on classes + academic years)
- **Teachers** - Teacher information (can be assigned to sections)
- **Students** - Student information (can be assigned to sections)
- **Student Assignments** - Assignment of students to specific class sections (depends on students + class sections)
- **Teacher Specializations** - Assignment of teachers to teach specific subjects in specific classes (depends on teachers + classes + subjects)
- **Class Teacher Assignments** - Assignment of teachers as primary/secondary class teachers for class sections (depends on teachers + class sections)
- **Class Subjects** - Assignment of subjects to class sections with optional teacher assignment (depends on class sections + subjects + teachers)
- **Student Attendance** - Daily attendance tracking for students (depends on student assignments + teachers)
- **Teacher Attendance** - Daily attendance tracking for teachers (depends on teachers)

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

## 7. Students

_Independent entity - can be enrolled in class sections_

| id                                   | name         | phone           | createdAt           | updatedAt           |
| ------------------------------------ | ------------ | --------------- | ------------------- | ------------------- |
| 550e8400-e29b-41d4-a716-446655440001 | Aarav Kumar  | +91-98765-55101 | 2024-01-15 09:00:00 | 2024-01-15 09:00:00 |
| 550e8400-e29b-41d4-a716-446655440002 | Diya Sharma  | +91-98765-55102 | 2024-01-15 09:15:00 | 2024-01-15 09:15:00 |
| 550e8400-e29b-41d4-a716-446655440003 | Arjun Patel  | +91-98765-55103 | 2024-01-15 09:30:00 | 2024-01-15 09:30:00 |
| 550e8400-e29b-41d4-a716-446655440004 | Ananya Singh | +91-98765-55104 | 2024-01-15 09:45:00 | 2024-01-15 09:45:00 |
| 550e8400-e29b-41d4-a716-446655440005 | Rohan Gupta  | +91-98765-55105 | 2024-01-15 10:00:00 | 2024-01-15 10:00:00 |

---

## 8. Student Assignments

_Junction entity linking Students to Class Sections - manages student assignment to specific class sections_

| id                                   | studentId                            | classSectionCode | status   | notes                 | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | ---------------- | -------- | --------------------- | ------------------- | ------------------- |
| 880e8400-e29b-41d4-a716-446655440001 | 550e8400-e29b-41d4-a716-446655440001 | 1A               | ACTIVE   | Regular assignment    | 2024-04-01 08:00:00 | 2024-04-01 08:00:00 |
| 880e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440002 | 1A               | ACTIVE   | Regular assignment    | 2024-04-01 08:15:00 | 2024-04-01 08:15:00 |
| 880e8400-e29b-41d4-a716-446655440003 | 550e8400-e29b-41d4-a716-446655440003 | 2B               | ACTIVE   | Promoted from Class 1 | 2024-04-01 08:30:00 | 2024-04-01 08:30:00 |
| 880e8400-e29b-41d4-a716-446655440004 | 550e8400-e29b-41d4-a716-446655440004 | LKGA             | ACTIVE   | New admission         | 2024-04-01 08:45:00 | 2024-04-01 08:45:00 |
| 880e8400-e29b-41d4-a716-446655440005 | 550e8400-e29b-41d4-a716-446655440005 | 10A              | INACTIVE | No longer enrolled    | 2024-04-01 09:00:00 | 2024-10-15 14:00:00 |

---

## 9. Teacher Specializations

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

## 10. Class Teacher Assignments

_Junction entity linking Teachers to Class Sections - defines which teacher is the primary/secondary class teacher for which class section_

| id                                   | teacherId                            | classSectionCode | role      | status   | assignmentStartDate | assignmentEndDate | notes                          | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | ---------------- | --------- | -------- | ------------------- | ----------------- | ------------------------------ | ------------------- | ------------------- |
| aa0e8400-e29b-41d4-a716-446655440001 | 660e8400-e29b-41d4-a716-446655440001 | 1A               | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | Primary class teacher AY2024   | 2024-04-01 08:00:00 | 2024-04-01 08:00:00 |
| aa0e8400-e29b-41d4-a716-446655440002 | 660e8400-e29b-41d4-a716-446655440002 | 1A               | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | Co-teacher for Class 1A        | 2024-04-01 08:05:00 | 2024-04-01 08:05:00 |
| aa0e8400-e29b-41d4-a716-446655440003 | 660e8400-e29b-41d4-a716-446655440003 | 1A               | SECONDARY | ACTIVE   | 2024-04-01          | NULL              | Assists with class activities  | 2024-04-01 08:10:00 | 2024-04-01 08:10:00 |
| aa0e8400-e29b-41d4-a716-446655440004 | 660e8400-e29b-41d4-a716-446655440003 | 2B               | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | Primary class teacher          | 2024-04-01 08:15:00 | 2024-04-01 08:15:00 |
| aa0e8400-e29b-41d4-a716-446655440005 | 660e8400-e29b-41d4-a716-446655440004 | 2B               | SECONDARY | ACTIVE   | 2024-04-01          | NULL              | Secondary support teacher      | 2024-04-01 08:20:00 | 2024-04-01 08:20:00 |
| aa0e8400-e29b-41d4-a716-446655440006 | 660e8400-e29b-41d4-a716-446655440005 | 2B               | SECONDARY | ACTIVE   | 2024-04-01          | NULL              | Additional support             | 2024-04-01 08:25:00 | 2024-04-01 08:25:00 |
| aa0e8400-e29b-41d4-a716-446655440007 | 660e8400-e29b-41d4-a716-446655440001 | LKGA             | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | LKG Section A primary teacher  | 2024-04-01 08:30:00 | 2024-04-01 08:30:00 |
| aa0e8400-e29b-41d4-a716-446655440008 | 660e8400-e29b-41d4-a716-446655440002 | 10A              | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | Class 10A homeroom teacher     | 2024-04-01 08:35:00 | 2024-04-01 08:35:00 |
| aa0e8400-e29b-41d4-a716-446655440009 | 660e8400-e29b-41d4-a716-446655440004 | 10A              | SECONDARY | INACTIVE | 2024-04-01          | 2024-09-30        | Transferred to another section | 2024-04-01 08:40:00 | 2024-09-30 15:00:00 |
| aa0e8400-e29b-41d4-a716-446655440010 | 660e8400-e29b-41d4-a716-446655440005 | ART1             | PRIMARY   | ACTIVE   | 2024-04-01          | NULL              | Arts group coordinator         | 2024-04-01 08:45:00 | 2024-04-01 08:45:00 |

---

## 11. Class Subjects

_Junction entity linking Class Sections to Subjects - defines which subjects are taught in which class sections with optional teacher assignment_

| id                                   | classSectionCode | subjectCode | teacherId                            | status   | notes                         | createdAt           | updatedAt           |
| ------------------------------------ | ---------------- | ----------- | ------------------------------------ | -------- | ----------------------------- | ------------------- | ------------------- |
| cc0e8400-e29b-41d4-a716-446655440001 | 1A               | MATH        | 660e8400-e29b-41d4-a716-446655440001 | ACTIVE   | NULL                          | 2024-04-02 09:00:00 | 2024-04-02 09:00:00 |
| cc0e8400-e29b-41d4-a716-446655440002 | 1A               | ENG         | 660e8400-e29b-41d4-a716-446655440002 | ACTIVE   | NULL                          | 2024-04-02 09:05:00 | 2024-04-02 09:05:00 |
| cc0e8400-e29b-41d4-a716-446655440003 | 1A               | HINDI       | 660e8400-e29b-41d4-a716-446655440003 | ACTIVE   | NULL                          | 2024-04-02 09:10:00 | 2024-04-02 09:10:00 |
| cc0e8400-e29b-41d4-a716-446655440004 | 1A               | PE          | 660e8400-e29b-41d4-a716-446655440005 | ACTIVE   | Physical education classes    | 2024-04-02 09:15:00 | 2024-04-02 09:15:00 |
| cc0e8400-e29b-41d4-a716-446655440005 | 2B               | MATH        | 660e8400-e29b-41d4-a716-446655440001 | ACTIVE   | NULL                          | 2024-04-02 09:20:00 | 2024-04-02 09:20:00 |
| cc0e8400-e29b-41d4-a716-446655440006 | 2B               | ENG         | 660e8400-e29b-41d4-a716-446655440002 | ACTIVE   | NULL                          | 2024-04-02 09:25:00 | 2024-04-02 09:25:00 |
| cc0e8400-e29b-41d4-a716-446655440007 | 2B               | SCI         | NULL                                 | ACTIVE   | Teacher not assigned yet      | 2024-04-02 09:30:00 | 2024-04-02 09:30:00 |
| cc0e8400-e29b-41d4-a716-446655440008 | LKGA             | ART         | 660e8400-e29b-41d4-a716-446655440005 | ACTIVE   | Arts and crafts for LKG       | 2024-04-02 09:35:00 | 2024-04-02 09:35:00 |
| cc0e8400-e29b-41d4-a716-446655440009 | LKGA             | MUS         | NULL                                 | ACTIVE   | Music classes                 | 2024-04-02 09:40:00 | 2024-04-02 09:40:00 |
| cc0e8400-e29b-41d4-a716-446655440010 | 10A              | MATH        | 660e8400-e29b-41d4-a716-446655440001 | ACTIVE   | Advanced mathematics          | 2024-04-02 09:45:00 | 2024-04-02 09:45:00 |
| cc0e8400-e29b-41d4-a716-446655440011 | 10A              | PHYS        | 660e8400-e29b-41d4-a716-446655440004 | ACTIVE   | Physics board preparation     | 2024-04-02 09:50:00 | 2024-04-02 09:50:00 |
| cc0e8400-e29b-41d4-a716-446655440012 | 10A              | CHEM        | NULL                                 | ACTIVE   | Chemistry - teacher pending   | 2024-04-02 09:55:00 | 2024-04-02 09:55:00 |
| cc0e8400-e29b-41d4-a716-446655440013 | 10A              | ENG         | 660e8400-e29b-41d4-a716-446655440002 | ACTIVE   | English literature            | 2024-04-02 10:00:00 | 2024-04-02 10:00:00 |
| cc0e8400-e29b-41d4-a716-446655440014 | ART1             | ART         | 660e8400-e29b-41d4-a716-446655440005 | ACTIVE   | Extra-curricular arts program | 2024-04-02 10:05:00 | 2024-04-02 10:05:00 |
| cc0e8400-e29b-41d4-a716-446655440015 | 6A               | COMP        | 660e8400-e29b-41d4-a716-446655440002 | INACTIVE | Program discontinued          | 2024-04-02 10:10:00 | 2024-09-15 14:00:00 |

---

## 12. Timetable

_Defines the weekly schedule for class sections - period-based scheduling that allows flexible class timings across different days_

| id                                   | classSectionCode | subjectCode | teacherId                            | dayOfWeek | startTime | endTime  | periodNumber | periodType | academicYear | room | status | requiresAttendance | notes                      | createdAt           | updatedAt           |
| ------------------------------------ | ---------------- | ----------- | ------------------------------------ | --------- | --------- | -------- | ------------ | ---------- | ------------ | ---- | ------ | ------------------ | -------------------------- | ------------------- | ------------------- |
| tt0e8400-e29b-41d4-a716-446655440001 | 1A               | NULL        | NULL                                 | MONDAY    | 08:00:00  | 08:30:00 | 0            | ASSEMBLY   | 2024-2025    | HALL | ACTIVE | true               | Morning assembly           | 2024-04-01 10:00:00 | 2024-04-01 10:00:00 |
| tt0e8400-e29b-41d4-a716-446655440002 | 1A               | MATH        | 660e8400-e29b-41d4-a716-446655440001 | MONDAY    | 08:30:00  | 09:30:00 | 1            | TEACHING   | 2024-2025    | 101  | ACTIVE | true               | First period mathematics   | 2024-04-01 10:01:00 | 2024-04-01 10:01:00 |
| tt0e8400-e29b-41d4-a716-446655440003 | 1A               | ENG         | 660e8400-e29b-41d4-a716-446655440002 | MONDAY    | 09:30:00  | 10:30:00 | 2            | TEACHING   | 2024-2025    | 101  | ACTIVE | false              | English language           | 2024-04-01 10:02:00 | 2024-04-01 10:02:00 |
| tt0e8400-e29b-41d4-a716-446655440004 | 1A               | NULL        | NULL                                 | MONDAY    | 10:30:00  | 10:45:00 | NULL         | BREAK      | 2024-2025    | NULL | ACTIVE | false              | Morning break              | 2024-04-01 10:03:00 | 2024-04-01 10:03:00 |
| tt0e8400-e29b-41d4-a716-446655440005 | 1A               | HINDI       | 660e8400-e29b-41d4-a716-446655440003 | MONDAY    | 10:45:00  | 11:45:00 | 3            | TEACHING   | 2024-2025    | 101  | ACTIVE | false              | Hindi class                | 2024-04-01 10:04:00 | 2024-04-01 10:04:00 |
| tt0e8400-e29b-41d4-a716-446655440006 | 1A               | PE          | 660e8400-e29b-41d4-a716-446655440005 | MONDAY    | 11:45:00  | 12:45:00 | 4            | TEACHING   | 2024-2025    | GYM  | ACTIVE | false              | Physical education         | 2024-04-01 10:05:00 | 2024-04-01 10:05:00 |
| tt0e8400-e29b-41d4-a716-446655440007 | 1A               | NULL        | NULL                                 | MONDAY    | 12:45:00  | 13:30:00 | NULL         | LUNCH      | 2024-2025    | NULL | ACTIVE | false              | Lunch break                | 2024-04-01 10:06:00 | 2024-04-01 10:06:00 |
| tt0e8400-e29b-41d4-a716-446655440008 | 1A               | MATH        | 660e8400-e29b-41d4-a716-446655440001 | TUESDAY   | 08:00:00  | 09:00:00 | 1            | TEACHING   | 2024-2025    | 101  | ACTIVE | true               | Tuesday first period       | 2024-04-01 10:07:00 | 2024-04-01 10:07:00 |
| tt0e8400-e29b-41d4-a716-446655440009 | 1A               | ENG         | 660e8400-e29b-41d4-a716-446655440002 | WEDNESDAY | 09:00:00  | 10:00:00 | 2            | TEACHING   | 2024-2025    | 101  | ACTIVE | false              | Different time on Wed      | 2024-04-01 10:08:00 | 2024-04-01 10:08:00 |
| tt0e8400-e29b-41d4-a716-446655440010 | 2B               | MATH        | 660e8400-e29b-41d4-a716-446655440001 | MONDAY    | 08:30:00  | 09:30:00 | 1            | TEACHING   | 2024-2025    | 201  | ACTIVE | true               | Class 2B mathematics       | 2024-04-01 10:09:00 | 2024-04-01 10:09:00 |
| tt0e8400-e29b-41d4-a716-446655440011 | 10A              | PHYS        | 660e8400-e29b-41d4-a716-446655440004 | MONDAY    | 08:30:00  | 09:30:00 | 1            | TEACHING   | 2024-2025    | LAB1 | ACTIVE | true               | Physics laboratory session | 2024-04-01 10:10:00 | 2024-04-01 10:10:00 |
| tt0e8400-e29b-41d4-a716-446655440012 | ART1             | ART         | 660e8400-e29b-41d4-a716-446655440005 | SATURDAY  | 10:00:00  | 12:00:00 | NULL         | SPECIAL    | 2024-2025    | ART  | ACTIVE | true               | Weekend arts club          | 2024-04-01 10:11:00 | 2024-04-01 10:11:00 |
| tt0e8400-e29b-41d4-a716-446655440013 | SPT1             | PE          | 660e8400-e29b-41d4-a716-446655440005 | SATURDAY  | 14:00:00  | 16:00:00 | NULL         | SPORTS     | 2024-2025    | FILD | ACTIVE | true               | Sports practice session    | 2024-04-01 10:12:00 | 2024-04-01 10:12:00 |

---

## 13. Student Attendance

_Tracks attendance for students based on scheduled timetable entries - supports both curricular (one per day) and extra-curricular (multiple per day) attendance_

| id                                   | timetableId                          | studentId                            | attendanceDate | status   | checkInTime | checkOutTime | notes                      | markedBy                             | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | -------------- | -------- | ----------- | ------------ | -------------------------- | ------------------------------------ | ------------------- | ------------------- |
| 990e8400-e29b-41d4-a716-446655440001 | tt0e8400-e29b-41d4-a716-446655440001 | 550e8400-e29b-41d4-a716-446655440001 | 2024-11-01     | PRESENT  | 08:00:00    | 08:30:00     | Assembly attendance        | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:00:00 | 2024-11-01 08:00:00 |
| 990e8400-e29b-41d4-a716-446655440002 | tt0e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440001 | 2024-11-01     | PRESENT  | 08:30:00    | 09:30:00     | Math period present        | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:30:00 | 2024-11-01 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440003 | tt0e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440002 | 2024-11-01     | LATE     | 08:45:00    | 09:30:00     | Arrived 15 mins late       | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:45:00 | 2024-11-01 08:45:00 |
| 990e8400-e29b-41d4-a716-446655440004 | tt0e8400-e29b-41d4-a716-446655440008 | 550e8400-e29b-41d4-a716-446655440001 | 2024-11-05     | PRESENT  | 08:00:00    | 09:00:00     | Tuesday class              | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:00:00 | 2024-11-05 08:00:00 |
| 990e8400-e29b-41d4-a716-446655440005 | tt0e8400-e29b-41d4-a716-446655440010 | 550e8400-e29b-41d4-a716-446655440003 | 2024-11-04     | PRESENT  | 08:30:00    | 09:30:00     | Class 2B attendance        | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:30:00 | 2024-11-04 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440006 | tt0e8400-e29b-41d4-a716-446655440011 | 550e8400-e29b-41d4-a716-446655440005 | 2024-11-04     | PRESENT  | 08:30:00    | 09:30:00     | Class 10A physics lab      | 660e8400-e29b-41d4-a716-446655440004 | 2024-11-04 08:30:00 | 2024-11-04 08:30:00 |
| 990e8400-e29b-41d4-a716-446655440007 | tt0e8400-e29b-41d4-a716-446655440012 | 550e8400-e29b-41d4-a716-446655440002 | 2024-11-09     | PRESENT  | 10:00:00    | 12:00:00     | Extra-curricular arts      | 660e8400-e29b-41d4-a716-446655440005 | 2024-11-09 10:00:00 | 2024-11-09 10:00:00 |
| 990e8400-e29b-41d4-a716-446655440008 | tt0e8400-e29b-41d4-a716-446655440013 | 550e8400-e29b-41d4-a716-446655440002 | 2024-11-09     | PRESENT  | 14:00:00    | 16:00:00     | Extra-curricular sports    | 660e8400-e29b-41d4-a716-446655440005 | 2024-11-09 14:00:00 | 2024-11-09 14:00:00 |
| 990e8400-e29b-41d4-a716-446655440009 | tt0e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440001 | 2024-11-06     | SICK     | NULL        | NULL         | Absent due to illness      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-06 09:00:00 | 2024-11-06 09:00:00 |
| 990e8400-e29b-41d4-a716-446655440010 | tt0e8400-e29b-41d4-a716-446655440002 | 550e8400-e29b-41d4-a716-446655440003 | 2024-11-07     | EXCUSED  | NULL        | NULL         | Family emergency           | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-07 10:00:00 | 2024-11-07 10:00:00 |
| 990e8400-e29b-41d4-a716-446655440011 | tt0e8400-e29b-41d4-a716-446655440008 | 550e8400-e29b-41d4-a716-446655440004 | 2024-11-08     | HALF_DAY | 08:00:00    | 11:00:00     | Left early - medical visit | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-08 08:00:00 | 2024-11-08 11:00:00 |

---

## 14. Teacher Attendance

_Tracks daily attendance for teachers_

| id                                   | teacherId                            | attendanceDate | status       | checkInTime | checkOutTime | notes                     | markedBy                             | createdAt           | updatedAt           |
| ------------------------------------ | ------------------------------------ | -------------- | ------------ | ----------- | ------------ | ------------------------- | ------------------------------------ | ------------------- | ------------------- |
| bb0e8400-e29b-41d4-a716-446655440001 | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01     | PRESENT      | 08:00:00    | 16:30:00     | On time                   | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:00:00 | 2024-11-01 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440002 | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-01     | PRESENT      | 07:55:00    | 16:35:00     | Early arrival             | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 07:55:00 | 2024-11-01 07:55:00 |
| bb0e8400-e29b-41d4-a716-446655440003 | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-01     | LATE         | 08:35:00    | 16:30:00     | Traffic delay             | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:35:00 | 2024-11-01 08:35:00 |
| bb0e8400-e29b-41d4-a716-446655440004 | 660e8400-e29b-41d4-a716-446655440004 | 2024-11-01     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:00:00 | 2024-11-01 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440005 | 660e8400-e29b-41d4-a716-446655440005 | 2024-11-01     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-01 08:00:00 | 2024-11-01 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440006 | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:00:00 | 2024-11-04 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440007 | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-04     | SICK_LEAVE   | NULL        | NULL         | Medical certificate       | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 09:00:00 | 2024-11-04 09:00:00 |
| bb0e8400-e29b-41d4-a716-446655440008 | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-04     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:00:00 | 2024-11-04 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440009 | 660e8400-e29b-41d4-a716-446655440004 | 2024-11-04     | CASUAL_LEAVE | NULL        | NULL         | Personal work             | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:00:00 | 2024-11-04 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440010 | 660e8400-e29b-41d4-a716-446655440005 | 2024-11-04     | HALF_DAY     | 08:00:00    | 12:30:00     | Left early - appointment  | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-04 08:00:00 | 2024-11-04 12:30:00 |
| bb0e8400-e29b-41d4-a716-446655440011 | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:00:00 | 2024-11-05 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440012 | 660e8400-e29b-41d4-a716-446655440002 | 2024-11-05     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:00:00 | 2024-11-05 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440013 | 660e8400-e29b-41d4-a716-446655440003 | 2024-11-05     | ON_LEAVE     | NULL        | NULL         | Official training program | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:00:00 | 2024-11-05 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440014 | 660e8400-e29b-41d4-a716-446655440004 | 2024-11-05     | PRESENT      | 08:00:00    | 16:30:00     | NULL                      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 08:00:00 | 2024-11-05 08:00:00 |
| bb0e8400-e29b-41d4-a716-446655440015 | 660e8400-e29b-41d4-a716-446655440005 | 2024-11-05     | ABSENT       | NULL        | NULL         | Unauthorized absence      | 660e8400-e29b-41d4-a716-446655440001 | 2024-11-05 17:00:00 | 2024-11-05 17:00:00 |
