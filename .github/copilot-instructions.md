# School Management API - AI Coding Assistant Instructions

## 🏗️ Architecture Overview

This is a **NestJS + MySQL** school management system using **Fastify** and **Sequelize ORM**. The system manages educational entities (students, teachers, classes, subjects) with hierarchical relationships and payment processing.

### Core Technology Stack

- **Framework**: NestJS v10 with Fastify adapter (not Express)
- **Database**: MySQL with Sequelize ORM and sequelize-typescript
- **Validation**: class-validator with `@Body(ValidationPipe)` pattern
- **Documentation**: Swagger with extensive `@ApiProperty` decorators
- **Architecture**: Modular structure with strict separation of concerns

## 📁 Module Structure Pattern

Every module follows this **exact** structure - maintain consistency:

```
src/modules/{module-name}/
├── {module-name}.module.ts     # NestJS module with SequelizeModule.forFeature
├── index.ts                    # Barrel exports (entities, DTOs, services, controllers)
├── controllers/                # REST controllers with full Swagger docs
├── dto/                       # create-*.dto.ts and update-*.dto.ts
├── entities/                  # Sequelize models with @Table decorators
└── services/                  # Business logic with @Injectable
```

### Key Conventions

- **Entity IDs**: Use `UUID` for students/teachers, `code` strings for lookup entities (class-types, subjects, academic-years)
- **Controller Pattern**: Always use `@Body(ValidationPipe)` for POST/PATCH operations
- **Service Pattern**: Inject models with `@InjectModel(Entity)` and use `typeof Entity`
- **Barrel Exports**: All modules expose entities, DTOs, services, controllers via index.ts

## 🔧 Development Workflows

### Running the Application

```bash
npm run start:dev          # Development with auto-reload
npm run build             # Production build
npm run start:prod        # Production mode
```

### Database Management

- **Auto-sync**: `synchronize: true` in database config (development)
- **Migrations**: Located in `src/database/migrations/` for schema changes
- **Sample Data**: Reference `DATABASE_SCHEMA.md` for realistic test data

### Testing

```bash
npm run test              # Unit tests
npm run test:e2e         # E2E tests (see test/e2e/ for patterns)
npm run test:cov         # Coverage reports
```

## 🎯 Entity Relationships & Business Logic

### Hierarchical Structure

1. **Academic Years** (AY2024) → Foundation entity
2. **Class Types** (PRI, SEC) → Class categories
3. **Classes** (CLASS1A, CLASS5B) → Specific grade levels
4. **Class Sections** → Academic year + class combinations
5. **Student/Teacher Assignments** → Link people to sections

### Critical Patterns

- **Fee System**: Complex payment allocation with `fee_types`, `fee_structures`, `fee_transactions`
- **Attendance Tracking**: Links to student assignments and timetables
- **Cross-Module Dependencies**: Students module imports Class entities for assignments

## ⚡ Code Patterns & Best Practices

### Validation & DTOs

```typescript
export class CreateStudentDto {
  @ApiProperty({ description: 'Full name', example: 'John Doe' })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  name: string;
}
```

### Entity Definitions

```typescript
@Table({ tableName: 'students', timestamps: true })
export class Student extends Model<Student> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @HasMany(() => StudentAssignment, 'studentId')
  assignments: StudentAssignment[];
}
```

### Service Error Handling

```typescript
async findOne(id: string): Promise<Student> {
  const student = await this.studentRepository.findByPk(id);
  if (!student) {
    throw new NotFoundException(`Student with ID ${id} not found`);
  }
  return student;
}
```

### Controller Swagger Documentation

Always include comprehensive API documentation:

```typescript
@Post()
@ApiOperation({ summary: 'Create a new student' })
@ApiResponse({ status: HttpStatus.CREATED, type: Student })
@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data' })
create(@Body(ValidationPipe) dto: CreateStudentDto): Promise<Student> {
  return this.service.create(dto);
}
```

## 📚 Key Files for Context

- **Module Structure**: `src/modules/students/` - Reference implementation
- **Database Config**: `src/config/database.config.ts` - MySQL connection setup
- **Entity Relationships**: `DATABASE_SCHEMA.md` - Complete data model
- **API Flows**: `docs/e2e-flows/` - Real-world usage scenarios
- **Payment System**: `src/modules/payments/` - Complex business logic example

## 🚨 Common Gotchas

1. **Fastify vs Express**: This project uses Fastify adapter - middleware and request handling differs
2. **Sequelize Relationships**: Use `@ForeignKey` and `@BelongsTo`/`@HasMany` decorators properly
3. **Validation**: Always use `ValidationPipe` in controllers, not global validation
4. **Cross-Module Imports**: Import entities from other modules in your module's `SequelizeModule.forFeature`
5. **E2E Testing**: Use `NestFastifyApplication` not `INestApplication` in tests

## 🎨 Swagger & API Documentation

Access live API docs at `http://localhost:3000/api` in development. Every endpoint must include:

- Complete `@ApiOperation` with summary
- `@ApiResponse` for success and error cases
- `@ApiParam` for path parameters with examples
- `@ApiBody` referencing DTO types
