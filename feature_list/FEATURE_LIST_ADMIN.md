# System Feature Implementation Matrix

> **Document Scope: ADMIN ROLE ONLY**  
> _Note: Features and API endpoints for TEACHER and STUDENT roles will be documented in separate subsequent sections._

---

## Executive Summary (Admin Role)

| Metric                                            | Count  | Percentage |
| :------------------------------------------------ | :----: | :--------: |
| **Total Admin-Relevant Backend Endpoints**        | **76** |    100%    |
| **Fully Implemented Features (API + Hooks + UI)** | **74** | **97.4%**  |
| **API Ready / Pending Dedicated UI**              | **0**  |  **0.0%**  |
| **Unimplemented / Backlog Features & APIs**       | **2**  |  **2.6%**  |

---

## 1. Implemented Admin Features & APIs

The following features have complete end-to-end implementation across the full stack (**API Client** $\rightarrow$ **TanStack Query Hooks** $\rightarrow$ **UI Components & Pages**).

### 1.1 Authentication & Administrative Session Management

- **Admin Authentication**: `POST /auth/login`
  - HttpOnly cookie token storage (`accessToken` & `refreshToken`).
  - Implemented in `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `/login`.
- **Silent Refresh & Re-queuing**: `POST /auth/refresh-token`
  - Automatic token refreshing via `ofetch` interceptor in `src/lib/api-client.ts`.
- **Session Logout**: `POST /auth/logout`
  - Complete cookie purging, broadcast sync via `BroadcastChannel`, and header menu action.
- **Current User Profile**: `GET /users/me`
  - Global user state hook `useCurrentUser()` in `src/hooks/use-auth.ts`.

### 1.2 User Registration & Staff Onboarding

- **Direct Student Registration**: `POST /auth/register-student`
  - Modal form in `/dashboard/admin/students` (`RegisterStudentDialog`).
  - Auto-provisions user credentials, personal metadata, and guardian contact details.
- **Teacher Staff Onboarding**: `POST /auth/register-teacher`
  - Modal form in `/dashboard/admin/teachers` (`RegisterTeacherDialog`).
  - Captures designation, subject specialization, educational qualifications, and joining date.

### 1.3 Student Admissions & Pending Approval State Machine

- **Pending Student Applications Queue**: `GET /auth/pending-students`
  - QueryBuilder-supported data table in `/dashboard/admin/students` (`PendingApplicationsQueue`).
- **Approve Student Application**: `PATCH /auth/pending-students/:pendingStudentId/approve`
  - Promotes public self-registered applicants to active student accounts.
- **Reject Student Application**: `PATCH /auth/pending-students/:pendingStudentId/reject`
  - Rejection dialog with optional administrative reason logging.

### 1.4 Directory Management, Status Lifecycle & Permission Delegation

- **Students & Teachers Directory Query**: `GET /users?role=STUDENT` & `GET /users?role=TEACHER`
  - Server-side search, status filtering, and pagination tables.
- **User Detail Inspection**: `GET /users/:userId`
  - Slide-out / modal inspector for student and teacher profiles.
- **User Status Lifecycle Toggle**: `PATCH /users/:userId/status`
  - Dynamic status transitions (`ACTIVE`, `INACTIVE`, `BLOCKED`) with instant cache invalidation.
- **Soft Delete User**: `DELETE /users/:userId`
  - Destructive confirmation dialogs for deactivating/purging accounts.
- **Update Teacher Profile Metadata**: `PATCH /users/teachers/:id`
  - Edit modal for designation, specialization, and qualification.
- **Granular Teacher Permission Delegation**: `PATCH /users/teachers/:id/permissions`
  - Dedicated delegation modal (`ManageTeacherPermissionsDialog`) in `/dashboard/admin/teachers`.
  - Grants/revokes scoped capabilities: `MANAGE_ATTENDANCE`, `MANAGE_EXAMS`, `MANAGE_ROUTINES`.

### 1.5 Academic Batches & Enrollment Workflows

- **Create Academic Batch**: `POST /batches`
  - Modal dialog (`CreateBatchDialog`) in `/dashboard/admin/batches`.
- **Batch Directory & Inspection**: `GET /batches` & `GET /batches/:batchId`
  - Batches grid/table with capacity, fee, schedule, and active student metrics.
- **Update Batch Configuration**: `PATCH /batches/:batchId`
  - Modify batch name, target grade level, monthly tuition fee, and schedule metadata.
- **Soft Delete Batch**: `DELETE /batches/:batchId`
  - Destructive confirmation dialog archiving inactive batches.
- **Pending Batch Enrollments Queue**: `GET /batches/enrollments/pending`
  - Queue table in `/dashboard/admin/batches` (`PendingEnrollmentsQueue`).
- **Approve Batch Enrollment**: `PATCH /batches/enrollments/:enrollmentId/approve`
  - Transitions student enrollment from `PENDING` to `ENROLLED`.
- **Reject Batch Enrollment**: `PATCH /batches/enrollments/:enrollmentId/reject`
  - Rejection with optional administrative feedback.
- **Direct Student Batch Enrollment**: `POST /batches/:batchId/students`
  - Modal dialog (`DirectEnrollDialog`) to instantly enroll students bypassing approval queue.
- **Batch Student Roster**: `GET /batches/:batchId/students`
  - Dedicated student roster view with quick contact cards and roll numbers.
- **Remove Student from Batch**: `DELETE /batches/:batchId/students/:userId`
  - Destructive action removing student enrollment from roster.

### 1.6 Class Routines & Timetable Scheduling

- **Create Timetable Slot**: `POST /routines`
  - Slot creation modal with teacher assignment, subject, room, day, and time boundaries.
- **Timetable Inspection & Query**: `GET /routines`, `GET /routines/:routineId`, `GET /routines/batch/:batchId`
  - Day-wise grouped timetable view (Saturday to Friday) in `/dashboard/admin/routines`.
- **Teacher Schedule View**: `GET /routines/teacher/:teacherUserId`
  - Conflict-free schedule inspector by teacher.
- **Update Routine Slot**: `PATCH /routines/:routineId`
  - Modify assigned teacher, room, timing, and subject.
- **Delete Routine Slot**: `DELETE /routines/:routineId`
  - Slot deletion with cache invalidation.
- **Batch Routine PDF Export**: `GET /routines/batches/:batchId/pdf`
  - Download & print button generating academic routine schedule PDF.

### 1.7 Daily Attendance Tracking (Students & Teachers)

- **Batch Daily Student Attendance Sheet**: `GET /attendance/batches/:batchId?date=YYYY-MM-DD`
  - Date-filtered daily attendance matrix in `/dashboard/admin/attendance`.
- **Bulk Submit Daily Student Attendance**: `POST /attendance/batches/:batchId`
  - Quick multi-status buttons (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`, `LEAVE`) with remarks.
- **Update Single Student Attendance**: `PATCH /attendance/:attendanceId`
  - Inline sheet status correction.
- **Student Attendance History**: `GET /attendance/students/:studentUserId`
  - Historical student attendance summary modal with calculated attendance percentage.
- **Teacher Daily Attendance Sheet**: `GET /attendance/teachers?date=YYYY-MM-DD`
  - Campus staff check-in tracking sheet.
- **Bulk Submit Teacher Attendance**: `POST /attendance/teachers/bulk`
  - Multi-teacher bulk attendance marking table (`TeacherAttendanceRosterTable`).
- **Update Single Teacher Attendance**: `PATCH /attendance/teachers/:teacherAttendanceId`
  - Single record update modal.
- **Teacher Attendance History Summary**: `GET /attendance/teachers/:teacherUserId/summary`
  - Monthly attendance history modal per teacher.

### 1.8 Exams, Grading & Merit Lists Pipeline

- **Create Academic Exam**: `POST /exams`
  - Modal form (`CreateExamDialog`) with title, batch, total marks, pass marks, and exam date.
- **Exams Directory & Details**: `GET /exams` & `GET /exams/:examId`
  - Central exam management table with status badges (`UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`).
- **Update Exam Metadata**: `PATCH /exams/:examId`
  - Modify exam title, dates, and grading thresholds.
- **Bulk Marks Entry**: `POST /exams/:examId/marks`
  - Specialized marks entry sheet (`BulkMarksEntryModal`) with automatic letter grade and GPA computation ($A+, A, B, \dots$).
- **Update Single Student Mark**: `PATCH /exams/:examId/marks/:targetUserId`
  - Inline score correction.
- **Publish Exam Results**: `PATCH /exams/:examId/publish`
  - Transitions results from `DRAFT` to `PUBLISHED`, releasing scores to students.
- **Unpublish Exam Results**: `PATCH /exams/:examId/unpublish`
  - Revokes public view for corrections/re-grading.
- **Batch Merit List & Analytics**: `GET /exams/:examId/results`
  - Merit List modal (`MeritListModal`) displaying student ranks, highest mark, lowest mark, and pass rate.
- **Delete Exam**: `DELETE /exams/:examId`
  - Soft-delete exam and corresponding result records.
- **Student Exam Report Card PDF**: `GET /exams/:examId/students/:studentId/report-card/pdf`
  - Direct preview and download of official academic report card PDF.
- **Email Report Card Dispatch**: `POST /exams/:examId/students/:studentId/send-report-card`
  - Automated dispatch of report card PDF to student and guardian email addresses.

### 1.9 Financial Management & Monthly Fee Collection

- **Monthly Revenue & Collection Statistics**: `GET /payments/monthly-stats?month=M&year=YYYY`
  - Top statistics ribbon (`PaymentStatsRibbon`) in `/dashboard/admin/payments` (Expected Revenue, Total Collected, Total Due, Collection Rate %).
- **Monthly Payment Sheet Roster**: `GET /payments/monthly-sheet?month=M&year=YYYY`
  - Aggregated student fee ledger (`MonthlyPaymentSheetTable`) with monthly fee, previous debt arrears, total payable, paid amount, and due balance.
- **Manual Offline Payment Collection**: `POST /payments/manual-collect`
  - Modal dialog (`ManualCollectDialog`) supporting `CASH`, `BKASH`, `NAGAD`, `ROCKET`, `BANK_TRANSFER`.
- **Payment Transactions Ledger**: `GET /payments/transactions`
  - Searchable transaction ledger table (`PaymentTransactionsTable`) with channel and status filtering.
- **Digital Payment Receipt PDF**: `GET /payments/transactions/:id/pdf`
  - Preview & download buttons for signed PDF transaction receipts.

### 1.10 Institution Profile & White-Label Management

- **Get Institution Profile & Operational Stats**: `GET /api/v1/institution`
  - Fetches institutional metadata, official contacts, and live operational stats (`totalStudents`, `totalTeachers`, `totalBatches`).
  - Implemented in `src/api/institution.ts`, `src/hooks/use-institution.ts`, and `/dashboard/admin/settings`.
- **Update Institution Profile**: `PATCH /api/v1/institution`
  - Interactive form in `/dashboard/admin/settings` allowing Admin to edit institution name, tagline, official contact email, support phone, physical address, and administrator in-charge contact details.
  - Implemented with validation in `src/validators/institution-validator.ts` and mutation in `src/hooks/use-institution.ts`.

### 1.11 System Audit Logging & Security Explorer

- **All Audit Logs Explorer**: `GET /api/v1/audit-logs?page=1&limit=20`
  - Explores system-wide immutable activity logs with server-side filters for action, entity, status, and client IP tracking.
  - Broadened Action selector organized into 10 distinct domain groups with Base UI dividers (no emojis) and generous popup width (`w-[320px] sm:w-[380px]`).
  - Unified Timeframe selector dropdown with 0ms deterministic in-memory calculation (`Today`, `Last 7 Days`, `Last 30 Days`, `All Time`).
  - Active filter badges with instant removal and one-click "Reset Filters" action.
  - Implemented in `src/api/audit-logs.ts`, `src/hooks/use-audit-logs.ts`, and `/dashboard/admin/audit-logs`.
- **Audit Activity Statistics & Overview**: `GET /api/v1/audit-logs/stats`
  - High-level security and operational metrics (Total Audit Events, System Integrity 100%, Active Operators, Failed Operations).
  - Implemented in `src/components/modules/audit-logs/audit-log-stats-cards.tsx` and `useAuditLogStats`.
- **Audit Log Deep Inspection**: `GET /api/v1/audit-logs/:auditLogId`
  - Slide-out sheet inspector (`AuditLogDetailDrawer`) displaying complete log details, operator profile, client network info (IP, User-Agent), and formatted JSON payload with copy capabilities.
  - Implemented in `src/components/modules/audit-logs/audit-log-detail-drawer.tsx` and `useAuditLogDetail`.
- **Suspense-First Loading Architecture**:
  - Full React 19 `<Suspense fallback={<AuditLogsTableSkeleton />}>` integration complying with Section 5.7 standard in `AGENTS.md` and route streaming skeleton in `loading.tsx`.

### 1.12 User Media & Avatar Management (Admin & All Roles)

- **Upload/Replace My Profile Avatar**: `PATCH /api/v1/users/me/avatar`
  - Uploads or replaces authenticated user's personal avatar image on Cloudinary via `FormData`.
  - Implemented in `src/api/media.ts`, `src/hooks/use-media.ts`, and `AdminAvatarCard` on `/dashboard/admin/settings`.
- **Delete My Profile Avatar**: `DELETE /api/v1/users/me/avatar`
  - Purges authenticated user's avatar asset from Cloudinary and clears `avatarUrl`.
  - Implemented in `src/api/media.ts`, `src/hooks/use-media.ts`, and `AdminAvatarCard`.
- **Administrative User Avatar Assignment**: `POST /api/v1/uploads/users/:targetUserId/avatar`
  - Admin assigns or updates the profile avatar of any student or teacher account.
  - Implemented with interactive dropzone preview modal (`UserAvatarUploadDialog`) in `src/components/modules/media/`, accessible directly from Student Directory, Student Details Inspector, Teacher Directory, and Teacher Profile Inspector.
- **Cross-Application Avatar Presentation**:
  - Integrated Base UI `<Avatar>` primitives across Dashboard Header, Sidebar Footer, Student Management Table, and Teacher Management Table.

### 1.13 Admin Main Overview Dashboard Analytics & Business Intelligence

- **Today's Operational Snapshot**: `GET /api/v1/dashboard/today`
  - Real-time today metrics: cash collected, transaction count, student attendance rate % (with total marked and present/late breakdown), teacher check-ins vs total active teachers, and pending action counts (student applications + enrollment requests).
  - Includes today's last 5 transactions feed with student name, batch, payment method badges, and formatted timestamps.
  - Implemented in `src/api/dashboard.ts`, `src/hooks/use-dashboard.ts`, `DashboardKpiCards`, `RecentTransactionsCard`, and `PendingActionsCard`.
- **Monthly Financial & Academic Summary**: `GET /api/v1/dashboard/monthly-summary`
  - Full-month business health snapshot: expected revenue, collected revenue, outstanding arrears due, collection rate %, paid/partial/unpaid student counts, monthly exam count, and published result status.
  - Implemented in `src/api/dashboard.ts`, `src/hooks/use-dashboard.ts`, `DashboardKpiCards`, and `CollectionDonutChart`.
- **Month-by-Month Revenue Trend (Shadcn Charts)**: `GET /api/v1/payments/revenue-trend?months=6`
  - Interactive multi-bar chart comparing collected revenue vs outstanding dues across the last 6 months with custom Taka tooltips (`৳ X,XXX`) and Y-axis currency formatting.
  - Implemented with Recharts + Shadcn `ChartContainer` in `src/components/modules/dashboard/revenue-trend-chart.tsx`.
- **Student Payment Status Donut Chart (Shadcn Charts)**:
  - Interactive radial donut chart displaying student fee status breakdown (Paid, Partial, Unpaid) with center collection rate percentage and legend metrics.
  - Implemented in `src/components/modules/dashboard/collection-donut-chart.tsx`.
- **Quick Actions Bar & Unified Suspense Architecture**:
  - One-click navigation shortcuts to admit student, register teacher, create batch, and collect manual payment (`QuickActionsBar`).
  - Suspense-first loading architecture with `DashboardPageSkeleton` and route-level streaming skeleton in `/dashboard/admin/loading.tsx`.

### 1.14 Account Security, Password Management & Active Sessions

- **Change Account Password**: `PATCH /api/v1/users/change-password`
  - Allows authenticated administrators to update their account password with Zod schema validation (minimum 6 characters, confirmation match, current password verification).
  - Features show/hide password toggle controls and an inline security requirements checklist.
  - Implemented in `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `ChangePasswordCard` on `/dashboard/admin/settings`.
- **Active Login Sessions Inspector**: `GET /api/v1/auth/sessions`
  - Real-time device monitoring displaying active sessions, detected browser/OS metadata, IP address, and connection creation timestamp.
  - Identifies and highlights the current device session with an active status badge.
  - Implemented in `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `ActiveSessionsCard` on `/dashboard/admin/settings`.
- **Terminate All Sessions / Logout All Devices**: `POST /api/v1/auth/logout-all`
  - Revokes all active authenticated sessions across all browsers and devices with an interactive confirmation dialog.
  - Purges local session tokens and redirects securely to the login portal.
  - Implemented in `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `ActiveSessionsCard`.
- **Personal Admin Profile Editing**: `PATCH /api/v1/users/me`
  - Update administrator personal name, contact phone, and gender independently from institutional in-charge metadata.
  - Implemented in `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `AdminProfileCard` on `/dashboard/admin/settings`.

---

## 2. Unimplemented / Backlog Admin Features & APIs

The following endpoints exist in the Backend API Postman collection or architectural roadmap, but have **not yet been connected or built** in the Admin frontend portal.

### 2.1 Student Profile Editing

_Backend Endpoints:_

- `PATCH /api/v1/users/students/:id` — Admin updates student personal details, roll number, class level, guardian name/phone.

_Current Status & Gap:_

- Admin can modify user status and soft-delete students, but cannot edit student profile metadata (`rollNumber`, `classLevel`, `guardianName`).
- **To Implement**: "Edit Student Profile" modal on `/dashboard/admin/students`.

### 2.2 System Health Monitoring

_Backend Endpoints:_

- `GET /health` — Root system health check.
- `GET /api/v1/health` — API v1 database and Redis connectivity health.

_Current Status & Gap:_

- No frontend indicator for backend server status or uptime.
- **To Implement**: Optional status widget in sidebar or settings page showing API connectivity status.

---

## 3. Comprehensive Admin Endpoints Traceability Table

|   #    | Backend Postman Endpoint                              | HTTP Method | Implementation Status | Frontend Code Location                                                                  |
| :----: | :---------------------------------------------------- | :---------: | :-------------------: | :-------------------------------------------------------------------------------------- |
| **1**  | `/api/v1/auth/login`                                  |   `POST`    |   ✅ **COMPLETED**    | `src/api/auth.ts` / `src/app/(public)/(auth)/login`                                     |
| **2**  | `/api/v1/auth/refresh-token`                          |   `POST`    |   ✅ **COMPLETED**    | `src/lib/api-client.ts` (Automatic silent loop)                                         |
| **3**  | `/api/v1/auth/logout`                                 |   `POST`    |   ✅ **COMPLETED**    | `src/api/auth.ts` / User menu dropdown                                                  |
| **4**  | `/api/v1/auth/logout-all`                             |   `POST`    |   ✅ **COMPLETED**    | `src/api/auth.ts` / `src/hooks/use-auth.ts` / `ActiveSessionsCard`                      |
| **5**  | `/api/v1/auth/sessions`                               |    `GET`    |   ✅ **COMPLETED**    | `src/api/auth.ts` / `src/hooks/use-auth.ts` / `ActiveSessionsCard`                      |
| **6**  | `/api/v1/auth/register-student`                       |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/students/register-student-dialog.tsx`                           |
| **7**  | `/api/v1/auth/register-teacher`                       |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/teachers/register-teacher-dialog.tsx`                           |
| **8**  | `/api/v1/auth/pending-students`                       |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/students/pending-applications-queue.tsx`                        |
| **9**  | `/api/v1/auth/pending-students/:id/approve`           |   `PATCH`   |   ✅ **COMPLETED**    | `src/components/modules/students/pending-applications-queue.tsx`                        |
| **10** | `/api/v1/auth/pending-students/:id/reject`            |   `PATCH`   |   ✅ **COMPLETED**    | `src/components/modules/students/reject-application-dialog.tsx`                         |
| **11** | `/api/v1/institution`                                 |    `GET`    |   ✅ **COMPLETED**    | `src/api/institution.ts` / `src/hooks/use-institution.ts` / `/dashboard/admin/settings` |
| **12** | `/api/v1/institution`                                 |   `PATCH`   |   ✅ **COMPLETED**    | `src/api/institution.ts` / `src/hooks/use-institution.ts` / `/dashboard/admin/settings` |
| **13** | `/api/v1/users/me`                                    |    `GET`    |   ✅ **COMPLETED**    | `src/hooks/use-auth.ts` (`useCurrentUser`)                                              |
| **14** | `/api/v1/users/me`                                    |   `PATCH`   |   ✅ **COMPLETED**    | `src/api/auth.ts` / `src/hooks/use-auth.ts` / `AdminProfileCard`                        |
| **15** | `/api/v1/users/change-password`                       |   `PATCH`   |   ✅ **COMPLETED**    | `src/api/auth.ts` / `src/hooks/use-auth.ts` / `ChangePasswordCard`                      |
| **16** | `/api/v1/users` (QueryBuilder)                        |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/students` & `teachers` tables                                   |
| **17** | `/api/v1/users/:userId`                               |    `GET`    |   ✅ **COMPLETED**    | `src/api/students.ts`, `src/api/teachers.ts`                                            |
| **18** | `/api/v1/users/students/:id`                          |   `PATCH`   | ❌ **UNIMPLEMENTED**  | Pending Student Edit Profile Modal                                                      |
| **19** | `/api/v1/users/teachers/:id`                          |   `PATCH`   |   ✅ **COMPLETED**    | `src/components/modules/teachers/edit-teacher-dialog.tsx`                               |
| **20** | `/api/v1/users/:userId/status`                        |   `PATCH`   |   ✅ **COMPLETED**    | Student & Teacher status toggle switches                                                |
| **21** | `/api/v1/users/:userId` (Soft Delete)                 |  `DELETE`   |   ✅ **COMPLETED**    | Student & Teacher delete confirmation dialogs                                           |
| **22** | `/api/v1/users/teachers/:id/permissions`              |   `PATCH`   |   ✅ **COMPLETED**    | `src/components/modules/teachers/manage-teacher-permissions-dialog.tsx`                 |
| **23** | `/api/v1/batches`                                     |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/batches/create-batch-dialog.tsx`                                |
| **24** | `/api/v1/batches`                                     |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/batches/batches-management-view.tsx`                            |
| **25** | `/api/v1/batches/:batchId`                            |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/batches/batch-detail-view.tsx`                                  |
| **26** | `/api/v1/batches/:batchId`                            |   `PATCH`   |   ✅ **COMPLETED**    | Batch edit dialog                                                                       |
| **27** | `/api/v1/batches/:batchId`                            |  `DELETE`   |   ✅ **COMPLETED**    | Batch delete confirmation dialog                                                        |
| **28** | `/api/v1/batches/enrollments/pending`                 |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/batches/pending-enrollments-queue.tsx`                          |
| **29** | `/api/v1/batches/enrollments/:id/approve`             |   `PATCH`   |   ✅ **COMPLETED**    | Pending enrollments table action                                                        |
| **30** | `/api/v1/batches/enrollments/:id/reject`              |   `PATCH`   |   ✅ **COMPLETED**    | Pending enrollments table action                                                        |
| **31** | `/api/v1/batches/:batchId/students`                   |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/batches/direct-enroll-dialog.tsx`                               |
| **32** | `/api/v1/batches/:batchId/students`                   |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/batches/batch-student-roster.tsx`                               |
| **33** | `/api/v1/batches/:batchId/students/:userId`           |  `DELETE`   |   ✅ **COMPLETED**    | Roster student removal action                                                           |
| **34** | `/api/v1/routines`                                    |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/routines/create-routine-dialog.tsx`                             |
| **35** | `/api/v1/routines`                                    |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/routines/admin-routines-view.tsx`                               |
| **36** | `/api/v1/routines/:routineId`                         |    `GET`    |   ✅ **COMPLETED**    | `src/api/routines.ts`                                                                   |
| **37** | `/api/v1/routines/batch/:batchId`                     |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/routines/batch-routine-table.tsx`                               |
| **38** | `/api/v1/routines/teacher/:teacherUserId`             |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/routines/teacher-routine-view.tsx`                              |
| **39** | `/api/v1/routines/:routineId`                         |   `PATCH`   |   ✅ **COMPLETED**    | Edit routine slot dialog                                                                |
| **40** | `/api/v1/routines/:routineId`                         |  `DELETE`   |   ✅ **COMPLETED**    | Delete routine slot action                                                              |
| **41** | `/api/v1/routines/batches/:batchId/pdf`               |    `GET`    |   ✅ **COMPLETED**    | PDF Export action button                                                                |
| **42** | `/api/v1/attendance/batches/:batchId`                 |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/attendance/batch-attendance-sheet.tsx`                          |
| **43** | `/api/v1/attendance/batches/:batchId`                 |    `GET`    |   ✅ **COMPLETED**    | Daily student attendance matrix                                                         |
| **44** | `/api/v1/attendance/:attendanceId`                    |   `PATCH`   |   ✅ **COMPLETED**    | Single student attendance status correction                                             |
| **45** | `/api/v1/attendance/students/:studentUserId`          |    `GET`    |   ✅ **COMPLETED**    | Student attendance longitudinal history modal                                           |
| **46** | `/api/v1/attendance/teachers/bulk`                    |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/attendance/teacher-attendance-sheet.tsx`                        |
| **47** | `/api/v1/attendance/teachers`                         |    `GET`    |   ✅ **COMPLETED**    | Daily teacher attendance sheet                                                          |
| **48** | `/api/v1/attendance/teachers/:teacherId/summary`      |    `GET`    |   ✅ **COMPLETED**    | Teacher attendance summary modal                                                        |
| **49** | `/api/v1/attendance/teachers/:teacherAttendanceId`    |   `PATCH`   |   ✅ **COMPLETED**    | Teacher attendance record update                                                        |
| **50** | `/api/v1/exams`                                       |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/exams/create-exam-dialog.tsx`                                   |
| **51** | `/api/v1/exams`                                       |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/exams/admin-exams-view.tsx`                                     |
| **52** | `/api/v1/exams/:examId`                               |    `GET`    |   ✅ **COMPLETED**    | `src/api/exam.ts`                                                                       |
| **53** | `/api/v1/exams/:examId`                               |   `PATCH`   |   ✅ **COMPLETED**    | Edit exam metadata modal                                                                |
| **54** | `/api/v1/exams/:examId/marks`                         |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/exams/bulk-marks-entry-modal.tsx`                               |
| **55** | `/api/v1/exams/:examId/marks/:userId`                 |   `PATCH`   |   ✅ **COMPLETED**    | Inline single mark update                                                               |
| **56** | `/api/v1/exams/:examId/publish`                       |   `PATCH`   |   ✅ **COMPLETED**    | Publish results action                                                                  |
| **57** | `/api/v1/exams/:examId/results`                       |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/exams/merit-list-modal.tsx`                                     |
| **58** | `/api/v1/exams/:examId/unpublish`                     |   `PATCH`   |   ✅ **COMPLETED**    | Unpublish results action                                                                |
| **59** | `/api/v1/exams/:examId`                               |  `DELETE`   |   ✅ **COMPLETED**    | Delete exam confirmation dialog                                                         |
| **60** | `/api/v1/exams/:examId/students/:id/report-card/pdf`  |    `GET`    |   ✅ **COMPLETED**    | Student report card PDF preview & download                                              |
| **61** | `/api/v1/exams/:examId/students/:id/send-report-card` |   `POST`    |   ✅ **COMPLETED**    | Dispatch report card PDF via email                                                      |
| **62** | `/api/v1/uploads/users/:targetUserId/avatar`          |   `POST`    |   ✅ **COMPLETED**    | `src/api/media.ts` / `src/hooks/use-media.ts` / `UserAvatarUploadDialog`                |
| **63** | `/api/v1/users/me/avatar`                             |   `PATCH`   |   ✅ **COMPLETED**    | `src/api/media.ts` / `src/hooks/use-media.ts` / `AdminAvatarCard`                       |
| **64** | `/api/v1/users/me/avatar`                             |  `DELETE`   |   ✅ **COMPLETED**    | `src/api/media.ts` / `src/hooks/use-media.ts` / `AdminAvatarCard`                       |
| **65** | `/api/v1/payments/monthly-sheet`                      |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/payments/monthly-payment-sheet-table.tsx`                       |
| **66** | `/api/v1/payments/monthly-stats`                      |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/payments/payment-stats-ribbon.tsx`                              |
| **67** | `/api/v1/payments/manual-collect`                     |   `POST`    |   ✅ **COMPLETED**    | `src/components/modules/payments/manual-collect-dialog.tsx`                             |
| **68** | `/api/v1/payments/transactions`                       |    `GET`    |   ✅ **COMPLETED**    | `src/components/modules/payments/payment-transactions-table.tsx`                        |
| **69** | `/api/v1/payments/transactions/:id/pdf`               |    `GET`    |   ✅ **COMPLETED**    | Digital PDF payment receipt preview & download                                          |
| **70** | `/api/v1/audit-logs`                                  |    `GET`    |   ✅ **COMPLETED**    | `src/api/audit-logs.ts` / `src/hooks/use-audit-logs.ts` / `/dashboard/admin/audit-logs` |
| **71** | `/api/v1/audit-logs/stats`                            |    `GET`    |   ✅ **COMPLETED**    | `src/api/audit-logs.ts` / `src/hooks/use-audit-logs.ts` / `/dashboard/admin/audit-logs` |
| **72** | `/api/v1/audit-logs/:auditLogId`                      |    `GET`    |   ✅ **COMPLETED**    | `src/api/audit-logs.ts` / `src/hooks/use-audit-logs.ts` / `AuditLogDetailDrawer`        |
| **73** | `/health` / `/api/v1/health`                          |    `GET`    | ❌ **UNIMPLEMENTED**  | Pending System Status Indicator                                                         |
| **74** | `/api/v1/dashboard/today`                             |    `GET`    |   ✅ **COMPLETED**    | `src/api/dashboard.ts` / `src/hooks/use-dashboard.ts` / `/dashboard/admin`              |
| **75** | `/api/v1/dashboard/monthly-summary`                   |    `GET`    |   ✅ **COMPLETED**    | `src/api/dashboard.ts` / `src/hooks/use-dashboard.ts` / `/dashboard/admin`              |
| **76** | `/api/v1/payments/revenue-trend`                      |    `GET`    |   ✅ **COMPLETED**    | `src/api/dashboard.ts` / `src/hooks/use-dashboard.ts` / `RevenueTrendChart`             |
