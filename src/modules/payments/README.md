# Payment System Module

This module implements a comprehensive payment system for managing student fees across both curricular (academic) and extra-curricular activities.

## Features

- ✅ Flexible fee type management (TUITION, TRANSPORT, LIBRARY, etc.)
- ✅ Fee structures at class level (shared across sections)
- ✅ Automatic fee transaction generation based on frequency
- ✅ Custom amount support (scholarships/discounts)
- ✅ Automatic payment allocation (oldest transaction first)
- ✅ Student payment history and outstanding balance tracking
- ✅ Support for multiple payment modes (CASH, UPI, CARD, etc.)

## Database Tables

### 1. fee_types

Master data for fee types.

| Column       | Type           | Description                           |
| ------------ | -------------- | ------------------------------------- |
| code         | VARCHAR(20) PK | Unique fee type code (e.g., TUITION)  |
| name         | VARCHAR(100)   | Display name                          |
| description  | VARCHAR(255)   | Description                           |
| applicableTo | ENUM           | CURRICULAR, EXTRA_CURRICULAR, or BOTH |
| isActive     | BOOLEAN        | Active status                         |

### 2. fee_structures

Fee configuration by class and type.

| Column       | Type           | Description                                       |
| ------------ | -------------- | ------------------------------------------------- |
| code         | VARCHAR(50) PK | Unique code (e.g., 10-TUITION)                    |
| feeTypeCode  | VARCHAR(20) FK | References fee_types.code                         |
| classCode    | VARCHAR(20) FK | References classes.code                           |
| frequency    | ENUM           | MONTHLY, QUARTERLY, HALF_YEARLY, ANNUAL, ONE_TIME |
| amount       | DECIMAL(10,2)  | Base fee amount                                   |
| academicYear | VARCHAR(20)    | Academic year (e.g., 2024-2025)                   |
| isActive     | BOOLEAN        | Active status                                     |

### 3. fee_transactions

Individual fee transactions for students.

| Column           | Type            | Description                                |
| ---------------- | --------------- | ------------------------------------------ |
| code             | VARCHAR(100) PK | Unique transaction code                    |
| studentId        | VARCHAR(20) FK  | References students.id                     |
| feeStructureCode | VARCHAR(50) FK  | References fee_structures.code             |
| dueDate          | DATE            | Due date for payment                       |
| baseAmount       | DECIMAL(10,2)   | Original amount from structure             |
| customAmount     | DECIMAL(10,2)   | Custom amount (if applicable)              |
| netAmount        | DECIMAL(10,2)   | Amount to pay (customAmount ?? baseAmount) |
| paidAmount       | DECIMAL(10,2)   | Amount paid so far                         |
| status           | ENUM            | PENDING, PARTIAL, PAID, CANCELLED          |
| remarks          | VARCHAR(500)    | Notes (e.g., scholarship reason)           |

### 4. payments

Payment records from students.

| Column          | Type           | Description                                        |
| --------------- | -------------- | -------------------------------------------------- |
| id              | INT PK AUTO    | Payment ID                                         |
| studentId       | VARCHAR(20) FK | References students.id                             |
| amount          | DECIMAL(10,2)  | Payment amount                                     |
| paymentDate     | DATE           | Date of payment                                    |
| paymentMode     | ENUM           | CASH, CHEQUE, UPI, CARD, NET_BANKING, DEMAND_DRAFT |
| referenceNumber | VARCHAR(100)   | Transaction/Cheque number                          |
| remarks         | VARCHAR(500)   | Payment notes                                      |

### 5. payment_allocations

Links payments to fee transactions.

| Column             | Type            | Description                          |
| ------------------ | --------------- | ------------------------------------ |
| id                 | INT PK AUTO     | Allocation ID                        |
| paymentId          | INT FK          | References payments.id               |
| feeTransactionCode | VARCHAR(100) FK | References fee_transactions.code     |
| allocatedAmount    | DECIMAL(10,2)   | Amount allocated to this transaction |
| allocationDate     | DATETIME        | When allocation was made             |

## API Endpoints

### Fee Types

#### Create Fee Type

```http
POST /fee-types
Content-Type: application/json

{
  "code": "TUITION",
  "name": "Tuition Fee",
  "description": "Academic or activity tuition",
  "applicableTo": "BOTH",
  "isActive": true
}
```

#### Get All Fee Types

```http
GET /fee-types
```

#### Get Fee Type by Code

```http
GET /fee-types/:code
```

#### Update Fee Type

```http
PATCH /fee-types/:code
Content-Type: application/json

{
  "name": "Updated Tuition Fee",
  "isActive": false
}
```

#### Delete Fee Type

```http
DELETE /fee-types/:code
```

---

### Fee Structures

#### Create Fee Structure

```http
POST /fee-structures
Content-Type: application/json

{
  "code": "10-TUITION",
  "feeTypeCode": "TUITION",
  "classCode": "10",
  "frequency": "MONTHLY",
  "amount": 5000.00,
  "academicYear": "2024-2025",
  "isActive": true
}
```

#### Get All Fee Structures (with filters)

```http
GET /fee-structures?classCode=10&academicYear=2024-2025&isActive=true
```

#### Get Fee Structure by Code

```http
GET /fee-structures/:code
```

#### Update Fee Structure

```http
PATCH /fee-structures/:code
Content-Type: application/json

{
  "amount": 5500.00
}
```

#### Delete Fee Structure

```http
DELETE /fee-structures/:code
```

---

### Fee Transactions

#### Generate Transactions for Student

```http
POST /fee-transactions/generate
Content-Type: application/json

{
  "studentId": "STU001",
  "month": "2024-04",
  "academicYear": "2024-2025"
}
```

**Response:**

```json
[
  {
    "code": "TXN-STU001-202404-10-TUITION",
    "studentId": "STU001",
    "feeStructureCode": "10-TUITION",
    "dueDate": "2024-04-10",
    "baseAmount": 5000.0,
    "customAmount": null,
    "netAmount": 5000.0,
    "paidAmount": 0,
    "status": "PENDING",
    "remarks": null
  }
]
```

#### Get All Transactions (with filters)

```http
GET /fee-transactions?studentId=STU001&status=PENDING&fromDate=2024-04-01&toDate=2024-04-30
```

#### Get Transaction by Code

```http
GET /fee-transactions/:code
```

#### Get Student Outstanding Balance

```http
GET /fee-transactions/student/:studentId/outstanding
```

**Response:**

```json
{
  "totalDue": 14500.00,
  "totalPaid": 0,
  "outstanding": 14500.00,
  "transactions": [...]
}
```

#### Update Custom Amount (Apply Discount/Scholarship)

```http
PATCH /fee-transactions/:code/custom-amount
Content-Type: application/json

{
  "customAmount": 4000.00,
  "remarks": "20% merit scholarship"
}
```

---

### Payments

#### Create Payment (Auto-allocates to transactions)

```http
POST /payments
Content-Type: application/json

{
  "studentId": "STU001",
  "amount": 10000.00,
  "paymentDate": "2024-04-05",
  "paymentMode": "UPI",
  "referenceNumber": "UPI123456789",
  "remarks": "Partial payment"
}
```

**Response:**

```json
{
  "id": 1,
  "studentId": "STU001",
  "amount": 10000.0,
  "paymentDate": "2024-04-05",
  "paymentMode": "UPI",
  "referenceNumber": "UPI123456789",
  "remarks": "Partial payment",
  "allocations": [
    {
      "id": 1,
      "paymentId": 1,
      "feeTransactionCode": "TXN-STU001-202404-10-TUITION",
      "allocatedAmount": 4000.0,
      "allocationDate": "2024-04-05T10:30:00.000Z"
    },
    {
      "id": 2,
      "paymentId": 1,
      "feeTransactionCode": "TXN-STU001-202404-DANCE-BEG-TUITION",
      "allocatedAmount": 2000.0,
      "allocationDate": "2024-04-05T10:30:00.000Z"
    }
  ]
}
```

#### Get All Payments (with filters)

```http
GET /payments?studentId=STU001&fromDate=2024-04-01&toDate=2024-04-30
```

#### Get Payment by ID

```http
GET /payments/:id
```

#### Get Student Payment History

```http
GET /payments/student/:studentId/history
```

## Workflows

### 1. Initial Setup (One-time)

```bash
# 1. Create fee types
POST /fee-types
{
  "code": "TUITION",
  "name": "Tuition Fee",
  "applicableTo": "BOTH"
}

# 2. Create fee structures for classes
POST /fee-structures
{
  "code": "10-TUITION",
  "feeTypeCode": "TUITION",
  "classCode": "10",
  "frequency": "MONTHLY",
  "amount": 5000.00,
  "academicYear": "2024-2025"
}
```

### 2. Generate Monthly Transactions

```bash
# Generate transactions for all students (typically run via scheduled job)
POST /fee-transactions/generate
{
  "studentId": "STU001",
  "month": "2024-04",
  "academicYear": "2024-2025"
}
```

### 3. Apply Custom Amounts (Scholarships)

```bash
# Apply discount to a specific transaction
PATCH /fee-transactions/TXN-STU001-202404-10-TUITION/custom-amount
{
  "customAmount": 4000.00,
  "remarks": "20% merit scholarship"
}
```

### 4. Collect Payment

```bash
# Record payment (auto-allocates to pending transactions)
POST /payments
{
  "studentId": "STU001",
  "amount": 10000.00,
  "paymentDate": "2024-04-05",
  "paymentMode": "UPI",
  "referenceNumber": "UPI123456789"
}
```

### 5. Check Outstanding Balance

```bash
# Get student's outstanding balance
GET /fee-transactions/student/STU001/outstanding
```

## Business Logic

### Transaction Generation

- Queries `student_assignments` to get active enrollments
- Gets `class_sections` to determine `classCode`
- Finds applicable `fee_structures` for those classes
- Generates transactions based on frequency:
  - **MONTHLY**: Every month
  - **QUARTERLY**: April, July, October, January
  - **HALF_YEARLY**: April, October
  - **ANNUAL**: April only
  - **ONE_TIME**: April only (first year)

### Payment Allocation

When a payment is received:

1. Find all PENDING/PARTIAL transactions for the student
2. Sort by `dueDate` ASC (oldest first)
3. Allocate payment amount sequentially:
   - If payment >= transaction outstanding: Mark PAID
   - If payment < transaction outstanding: Mark PARTIAL
4. Create `payment_allocations` records
5. Update `paidAmount` and `status` on transactions

### Custom Amount Logic

- `baseAmount`: Original amount from fee structure
- `customAmount`: Optional custom amount (scholarship/discount)
- `netAmount`: Calculated as `customAmount ?? baseAmount`
- If customAmount is set, netAmount is updated automatically via hook

## Migration

To create the database tables, run:

```bash
npm run migration:run
```

This will execute the migration file: `20241110000000-create-payment-tables.ts`

To rollback:

```bash
npm run migration:revert
```

## Example Use Case

See `PAYMENT_SYSTEM_E2E_FLOW.md` for a complete end-to-end example with Rahul Kumar (STU001) enrolled in:

- Class 10-A (Academic)
- Dance Beginner (Activity)
- Music Intermediate (Activity)

With detailed step-by-step workflow showing:

- Fee structure setup
- Transaction generation
- Custom amount application
- Payment collection
- Outstanding balance tracking

## Notes

- Fees are defined at **CLASS level** (not section level)
  - Example: `10-TUITION` applies to all sections (10-A, 10-B, 10-C)
- Uses existing `student_assignments` table (no separate fee assignments)
- Payment allocation is **automatic** (oldest transaction first)
- All monetary values use `DECIMAL(10,2)` for precision
- Soft deletes enabled (`paranoid: true`) for audit trail
