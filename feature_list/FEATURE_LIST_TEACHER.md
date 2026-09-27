# System Feature Implementation Matrix: Teacher Role

> **Document Scope: TEACHER ROLE ONLY**  
> **Source of Truth: Postman Collection (`Coaching Center Management System API.postman_collection.json`)**  
> _Note: Administrative features are documented in `FEATURE_LIST_ADMIN.md`, and Student features will be documented in `FEATURE_LIST_STUDENT.md`._

---

## Executive Summary (Teacher Role)

| Metric                                                         | Count  | Percentage |
| :------------------------------------------------------------- | :----: | :--------: |
| **Total Teacher-Relevant Endpoints in Postman Collection**     | **44** |    100%    |
| **Fully Implemented Features (API + Hooks + UI)**              | **31** | **70.5%**  |
| **API Ready / Component Ready (Pending Dedicated Teacher UI)** | **7**  | **15.9%**  |
| **Fully Implemented Features (API + Hooks + UI)**              | **38** | **86.4%**  |
| **API Ready / Component Ready (Pending Dedicated Teacher UI)** | **0**  |   **0%**   |
| **Unimplemented / Backlog Features & APIs**                    | **6**  | **13.6%**  |

---

## 1. Domain Architecture & Granular Delegation Model

The Teacher Portal operates on a **Granular Permission Delegation Model** governed by the institution administrator:

```mermaid
flowchart TD
    subgraph Core["1. Core Teacher Capabilities (All Active Teachers)"]
        Auth["Session Auth & HttpOnly Cookies"]
        Profile["Teacher Profile & Personal Details"]
        Security["Password Change & Active Sessions"]
        Avatar["Profile Avatar Management"]
        CheckIn["Daily Campus Check-In (POST /attendance/teachers/check-in)"]
        MySummary["My Attendance Summary (GET /attendance/teachers/my/summary)"]
        MyBatches["Assigned Batches & Student Rosters"]
        Schedule["My Teaching Schedule (GET /routines/my/teacher-schedule)"]
    end

    subgraph Delegated["2. Delegated Administrative Permissions"]
        MANAGE_ATTENDANCE["MANAGE_ATTENDANCE\n(Record & Modify Daily Student Attendance)"]
        MANAGE_EXAMS["MANAGE_EXAMS\n(Create Exams, Bulk Marks Entry, Publish Results)"]
        MANAGE_ROUTINES["MANAGE_ROUTINES\n(Add, Edit & Delete Weekly Routine Slots)"]
    end

    Core --> Dashboard["Teacher Smart Gateway & Dashboard\n(/dashboard/teacher)"]
    MANAGE_ATTENDANCE --> AttendancePage["/dashboard/teacher/attendance"]
    MANAGE_EXAMS --> ExamsPage["/dashboard/teacher/exams"]
    MANAGE_ROUTINES --> RoutinesPage["/dashboard/teacher/routines"]
```

---

## 2. Implemented Features & Endpoints (Teacher Role)

The following capabilities are actively functional in the Teacher workspace (**API Client** $\rightarrow$ **TanStack Query Hooks** $\rightarrow$ **UI Components & Pages**).

### 2.1 Authentication & Session Management

- **Teacher Authentication**: `POST /api/v1/auth/login`
  - HttpOnly cookie token management (`accessToken` & `refreshToken`).
  - Handled via `src/api/auth.ts`, `src/hooks/use-auth.ts`, and `/login`.
- **Silent Token Refresh**: `POST /api/v1/auth/refresh-token`
  - Automatic refreshing via `ofetch` interceptor in `src/lib/api-client.ts`.
- **Session Logout**: `POST /api/v1/auth/logout`
  - Purges cookies, broadcasts cross-tab logout via `BroadcastChannel`, and updates UI state.
- **Current Teacher Profile Query**: `GET /api/v1/users/me`
  - Retrieves authenticated user profile, designation, qualification, specialization, joining date, and delegated permissions.

### 2.2 Daily Campus Attendance & Check-In

- **Daily Campus Check-in**: `POST /api/v1/attendance/teachers/check-in`
  - Self check-in notification strip (`TeacherSelfCheckInCard`) on `/dashboard/teacher`.
  - Records teacher attendance as `PRESENT` or `LATE` in Bangladesh Standard Time (BST).
  - Optimistic local state caching, deduplication guard, and friendly formatted check-in time (`h:mm a`).
- **My Attendance Summary**: `GET /api/v1/attendance/teachers/my/summary`
  - Integrated into `/dashboard/teacher` check-in verification and `useTeacherDashboardAttendanceSummary`.
  - Determines today's recorded check-in status, arrival time, and monthly attendance performance.

### 2.3 Batch Student Attendance Management (Guarded by `MANAGE_ATTENDANCE`)

- **Query Batch Daily Attendance Sheet**: `GET /api/v1/attendance/batches/:batchId`
  - Daily attendance grid filtered by batch and date on `/dashboard/teacher/attendance`.
- **Bulk Submit Daily Attendance**: `POST /api/v1/attendance/batches/:batchId`
  - Records student statuses: `PRESENT`, `ABSENT`, `LATE`, `EXCUSED`, `LEAVE` with individual remarks.
- **Update Single Student Record**: `PATCH /api/v1/attendance/:attendanceId`
  - Instant status corrections with real-time optimistic cache invalidation.
- **Student Longitudinal Attendance Inspection**: `GET /api/v1/attendance/students/:studentUserId`
  - View individual student attendance track record across batches.

### 2.4 Exams, Bulk Marks Entry & Grading (Guarded by `MANAGE_EXAMS`)

- **Exams Directory**: `GET /api/v1/exams`
  - Filter and inspect scheduled/ongoing/completed exams for assigned batches on `/dashboard/teacher/exams`.
- **Create Batch Exam**: `POST /api/v1/exams`
  - Creation dialog specifying title, batch, total marks, pass marks, and exam date.
- **Exam Details Inspection**: `GET /api/v1/exams/:examId`
- **Edit Exam Metadata**: `PATCH /api/v1/exams/:examId`
- **Delete Exam**: `DELETE /api/v1/exams/:examId`
- **Bulk Marks Entry**: `POST /api/v1/exams/:examId/marks`
  - Bulk grid modal for fast marks recording across all enrolled students in the batch.
- **Inline Single Mark Correction**: `PATCH /api/v1/exams/:examId/marks/:userId`
- **Publish Results**: `PATCH /api/v1/exams/:examId/publish`
  - Promotes draft marks to published results accessible by students and parents.
- **Unpublish Results**: `PATCH /api/v1/exams/:examId/unpublish`
- **Batch Merit List & Grade Analytics**: `GET /api/v1/exams/:examId/results`
  - Detailed merit list with rank, letter grade (`A+`, `A`, etc.), GPA (`5.00`), class average, and pass percentage.
- **Student Report Card PDF Preview & Download**: `GET /api/v1/exams/:examId/students/:id/report-card/pdf`
- **Dispatch Report Card PDF via Email**: `POST /api/v1/exams/:examId/students/:id/send-report-card`

### 2.5 My Batches & Student Rosters (`/dashboard/teacher/batches`)

- **Batches Directory**: `GET /api/v1/batches`
  - Interactive grid and table views with live debounced search and status filtering on `/dashboard/teacher/batches`.
  - Displays batch enrollment counters, fee badges, and weekly routine slots summary.
- **Batch Details & Statistics**: `GET /api/v1/batches/:batchId`
  - Overview cards displaying total students, tuition fee, and scheduled lecture counts on `/dashboard/teacher/batches/:batchId`.
- **Enrolled Student Roster**: `GET /api/v1/batches/:batchId/students`
  - Detailed roster table with Student Roll Number, Class Level, Institution Name, and clickable Guardian Phone (`tel:...`).
  - Longitudinal attendance history modal trigger (`StudentAttendanceHistoryModal`).

### 2.6 Class Routines & Weekly Schedule (`/dashboard/teacher/routines`) — ✅ COMPLETED

- **My Schedule (Default for All Teachers)**: `GET /api/v1/routines/my/teacher-schedule`
  - All faculty members can access `/dashboard/teacher/routines` without restrictions to view their personal weekly timetable.
- **Teacher Schedule View**: `GET /api/v1/routines/teacher/:teacherUserId`
  - Day-wise grouped timetable (Saturday to Friday) with room, subject, and batch metadata.
- **Batch Timetable View**: `GET /api/v1/routines/batch/:batchId`
  - Day-wise grouped schedule for any selected batch.
- **Full Admin Equivalence for Routine Managers (`MANAGE_ROUTINES`)**:
  - Teachers with `MANAGE_ROUTINES` receive complete parity with Admin:
    - Master "All Classes" view across all batches and teachers.
    - View mode switchers ("All Classes", "By Batch", "By Teacher").
    - Slot scheduling (`POST /api/v1/routines`), slot updating (`PATCH /api/v1/routines/:routineId`), and slot deletion (`DELETE /api/v1/routines/:routineId`).
- **Teacher Name Resolution & Pinned (You) Badge**:
  - `combinedTeachers` memo synthesizes `/users?role=TEACHER`, routine slot metadata, and the authenticated user profile, ensuring teacher names and designations are always displayed (eliminating raw UUID fallbacks).
- **Print & PDF Export**: `GET /api/v1/routines/batches/:batchId/pdf`
  - A4 landscape print styling and direct PDF download.

### 2.7 Faculty Settings, Profile & Security (`/dashboard/teacher/settings`) — ✅ COMPLETED

- **Faculty Profile & Academic Credentials**:
  - Personal contact details update: `PATCH /api/v1/users/me` (`name`, `phone`, `gender`).
  - Professional credentials inspection: Designation, educational qualification, subject specialization, joining date, and active delegation status badges (`MANAGE_ATTENDANCE`, `MANAGE_EXAMS`, `MANAGE_ROUTINES`).
- **Profile Avatar Management**:
  - Upload avatar: `PATCH /api/v1/users/me/avatar`.
  - Delete avatar: `DELETE /api/v1/users/me/avatar`.
- **Security & Device Management**:
  - Change password: `PATCH /api/v1/users/change-password` with strength meter.
  - Active login sessions: `GET /api/v1/auth/sessions` with device and browser detection.
  - Revoke all other sessions: `POST /api/v1/auth/logout-all`.
- **Personal Monthly Attendance Log**:
  - `GET /api/v1/attendance/teachers/my/summary` with monthly working days, on-time, late, absent, leave, and attendance rate %, plus chronological check-in table.
- **Campus & Institution Details**:
  - `GET /api/v1/institution` — Read-only coaching center branding, campus address, helpline phone, and email.
- **Unified Reusable Architecture**:
  - Directly reuses `AdminAvatarCard`, `ChangePasswordCard`, and `ActiveSessionsCard` from `@/components/modules/settings`, maintaining 100% design and component consistency with Admin.

---

## 3. API Ready / Component Ready (Pending Dedicated Teacher Pages)

The API endpoints, TanStack Query hooks, and shared UI primitives already exist in the codebase, but need **dedicated pages or integration inside the `/dashboard/teacher/*` route tree**.
_All component-ready features have been integrated into dedicated pages. Zero pending features in this tier._

### 3.1 Teacher Account Settings & Security (`/dashboard/teacher/settings`)

_Existing Assets_: `ChangePasswordCard`, `ActiveSessionsCard`, `AdminProfileCard`, `AdminAvatarCard` in `src/components/modules/settings/`.

- `PATCH /api/v1/users/change-password` — Change teacher password.
- `GET /api/v1/auth/sessions` — View active login sessions/devices.
- `POST /api/v1/auth/logout-all` — Terminate all other sessions across devices.
- `PATCH /api/v1/users/me` — Update personal name and phone.
- `PATCH /api/v1/users/me/avatar` — Upload or update personal avatar.
- `DELETE /api/v1/users/me/avatar` — Remove profile avatar.

### 3.2 Institution Information

- `GET /api/v1/institution` — View coaching center branding, campus address, and official contact information.

---

## 4. Backlog / Unimplemented Features (Teacher Role)

The following features require frontend implementation to complete the Teacher role experience:

### 4.1 Live Teacher Dashboard Overview (`/dashboard/teacher`) — ✅ COMPLETED

- **State**: Implemented with Suspense-first architecture.
- **Components Built**:
  - `TeacherKpiCards`: Live metrics for Assigned Batches, Classes Today, Upcoming Exams, and Attendance Rate.
  - `TeacherTodayScheduleCard`: Real-time routine slots filtered for today's weekday with chronologically sorted lectures and active/next badges.
  - `TeacherPermissionsCard`: Visual authorization badges for `MANAGE_ATTENDANCE`, `MANAGE_EXAMS`, and `MANAGE_ROUTINES`.
  - `TeacherQuickActionsBar`: Direct one-click navigation guarded by delegated permissions.
  - `TeacherDashboardPageSkeleton`: Dedicated Suspense fallbacks for all cards.

### 4.2 Routine Modification Permissions (Guarded by `MANAGE_ROUTINES`) — ✅ COMPLETED

- `POST /api/v1/routines` — Add routine slot for assigned batches.
- `PATCH /api/v1/routines/:routineId` — Edit routine slot time/room/subject.
- `DELETE /api/v1/routines/:routineId` — Remove routine slot.
- **Implemented**: `canManageRoutines` check seamlessly controls the "Schedule Class" toolbar action, individual slot edit/delete dropdown items, and the `RoutineSlotDialog` & delete confirmation dialogs. Unprivileged teachers see a clean read-only schedule view with full print capability.

### 4.3 Teacher Personal Attendance History

- `GET /api/v1/attendance/teachers/my/summary?page=1&limit=20`
- **Current State**: Actively integrated for daily check-in verification and monthly attendance KPI calculation on `/dashboard/teacher`.
- **Pending Enhancement**: Monthly check-in attendance calendar card or history table showing teacher's historical on-time, late, and absent days in `/dashboard/teacher/settings`.

### 4.4 Faculty Attendance Management (Delegated to Authorized Teacher)

- `POST /api/v1/attendance/teachers/bulk` — Record bulk teacher attendance.
- `GET /api/v1/attendance/teachers` — View daily faculty attendance sheet.
- `PATCH /api/v1/attendance/teachers/:teacherAttendanceId` — Update faculty attendance record.
- `GET /api/v1/attendance/teachers/:teacherUserId/summary` — Inspect specific teacher attendance history.

### 4.5 Password Recovery Flow

- `POST /api/v1/auth/forgot-password` — Request password reset email.
- `POST /api/v1/auth/reset-password` — Complete password reset with email token.

---

## 5. Comprehensive Teacher Endpoints Traceability Table (Postman Aligned)

|   #    | Postman Endpoint Name                               | Endpoint URL                                                 |  Method  | Required Permission |        Status        | Frontend Code Location                                                   |
| :----: | :-------------------------------------------------- | :----------------------------------------------------------- | :------: | :-----------------: | :------------------: | :----------------------------------------------------------------------- |
| **1**  | `Login — Teacher`                                   | `/api/v1/auth/login`                                         |  `POST`  |        None         |   ✅ **COMPLETED**   | `src/app/(public)/(auth)/login`                                          |
| **2**  | `Refresh Access Token`                              | `/api/v1/auth/refresh-token`                                 |  `POST`  |        None         |   ✅ **COMPLETED**   | `src/lib/api-client.ts` (Automatic silent loop)                          |
| **3**  | `Logout`                                            | `/api/v1/auth/logout`                                        |  `POST`  |        None         |   ✅ **COMPLETED**   | Header User Menu Dropdown                                                |
| **4**  | `Logout from All Devices`                           | `/api/v1/auth/logout-all`                                    |  `POST`  |        None         |   ✅ **COMPLETED**   | `ActiveSessionsCard` on `/dashboard/teacher/settings`                    |
| **5**  | `List Active Login Sessions`                        | `/api/v1/auth/sessions`                                      |  `GET`   |        None         |   ✅ **COMPLETED**   | `ActiveSessionsCard` on `/dashboard/teacher/settings`                    |
| **6**  | `Forgot Password`                                   | `/api/v1/auth/forgot-password`                               |  `POST`  |        None         | ❌ **UNIMPLEMENTED** | `src/app/(public)/(auth)/forgot-password`                                |
| **7**  | `Reset Password`                                    | `/api/v1/auth/reset-password`                                |  `POST`  |        None         | ❌ **UNIMPLEMENTED** | Pending Reset Password Page                                              |
| **8**  | `Get Current User Profile (/me)`                    | `/api/v1/users/me`                                           |  `GET`   |        None         |   ✅ **COMPLETED**   | `useCurrentUser()` in `src/hooks/use-auth.ts`                            |
| **9**  | `Update Current User Profile (/me)`                 | `/api/v1/users/me`                                           | `PATCH`  |        None         |   ✅ **COMPLETED**   | `TeacherProfileCard` on `/dashboard/teacher/settings`                    |
| **10** | `Change Password`                                   | `/api/v1/users/change-password`                              | `PATCH`  |        None         |   ✅ **COMPLETED**   | `ChangePasswordCard` on `/dashboard/teacher/settings`                    |
| **11** | `Upload My Avatar`                                  | `/api/v1/users/me/avatar`                                    | `PATCH`  |        None         |   ✅ **COMPLETED**   | `AdminAvatarCard` on `/dashboard/teacher/settings`                       |
| **12** | `Delete My Avatar`                                  | `/api/v1/users/me/avatar`                                    | `DELETE` |        None         |   ✅ **COMPLETED**   | `AdminAvatarCard` on `/dashboard/teacher/settings`                       |
| **13** | `Teacher Self Check-In`                             | `/api/v1/attendance/teachers/check-in`                       |  `POST`  |        None         |   ✅ **COMPLETED**   | `TeacherSelfCheckInCard` on `/dashboard/teacher`                         |
| **14** | `Get My Teacher Attendance Summary`                 | `/api/v1/attendance/teachers/my/summary`                     |  `GET`   |        None         |   ✅ **COMPLETED**   | `TeacherSelfCheckInCard` & `useTeacherDashboardAttendanceSummary`        |
| **15** | `Get All Batches (QueryBuilder)`                    | `/api/v1/batches`                                            |  `GET`   |        None         |   ✅ **COMPLETED**   | `TeacherBatchesView` on `/dashboard/teacher/batches`                     |
| **16** | `Get Batch Details by ID`                           | `/api/v1/batches/:batchId`                                   |  `GET`   |        None         |   ✅ **COMPLETED**   | `TeacherBatchDetailView` on `/dashboard/teacher/batches/:batchId`        |
| **17** | `Get Batch Student Roster (Admin & Teacher)`        | `/api/v1/batches/:batchId/students`                          |  `GET`   |        None         |   ✅ **COMPLETED**   | `TeacherBatchRosterTable` on `/dashboard/teacher/batches/:batchId`       |
| **18** | `Get My Teaching Schedule (Teacher Only)`           | `/api/v1/routines/my/teacher-schedule`                       |  `GET`   |        None         |   ✅ **COMPLETED**   | `RoutinesManagementView` on `/dashboard/teacher/routines`                |
| **19** | `Get Teacher Teaching Schedule`                     | `/api/v1/routines/teacher/:teacherUserId`                    |  `GET`   |        None         |   ✅ **COMPLETED**   | `RoutinesManagementView` on `/dashboard/teacher/routines`                |
| **20** | `Get Batch Timetable (Day-Wise Grouped)`            | `/api/v1/routines/batch/:batchId`                            |  `GET`   |        None         |   ✅ **COMPLETED**   | `RoutinesManagementView` on `/dashboard/teacher/routines`                |
| **21** | `Download/Preview Batch Routine Schedule PDF`       | `/api/v1/routines/batches/:batchId/pdf`                      |  `GET`   |        None         |   ✅ **COMPLETED**   | `RoutinesManagementView` Print & PDF export                              |
| **22** | `Create Routine Slot (Admin or Authorized Teacher)` | `/api/v1/routines`                                           |  `POST`  |  `MANAGE_ROUTINES`  |   ✅ **COMPLETED**   | `RoutineSlotDialog` on `/dashboard/teacher/routines`                     |
| **23** | `Update Routine Slot (Admin or Authorized Teacher)` | `/api/v1/routines/:routineId`                                | `PATCH`  |  `MANAGE_ROUTINES`  |   ✅ **COMPLETED**   | `RoutineSlotDialog` edit on `/dashboard/teacher/routines`                |
| **24** | `Delete Routine Slot (Admin or Authorized Teacher)` | `/api/v1/routines/:routineId`                                | `DELETE` |  `MANAGE_ROUTINES`  |   ✅ **COMPLETED**   | Delete slot modal on `/dashboard/teacher/routines`                       |
| **25** | `Get Batch Attendance Sheet`                        | `/api/v1/attendance/batches/:batchId`                        |  `GET`   | `MANAGE_ATTENDANCE` |   ✅ **COMPLETED**   | `src/app/dashboard/teacher/attendance/page.tsx`                          |
| **26** | `Mark Bulk Daily Attendance`                        | `/api/v1/attendance/batches/:batchId`                        |  `POST`  | `MANAGE_ATTENDANCE` |   ✅ **COMPLETED**   | `BatchAttendanceSheet` on `/dashboard/teacher/attendance`                |
| **27** | `Update Single Attendance Record`                   | `/api/v1/attendance/:attendanceId`                           | `PATCH`  | `MANAGE_ATTENDANCE` |   ✅ **COMPLETED**   | Single student attendance update on `/dashboard/teacher/attendance`      |
| **28** | `Get Student Attendance History`                    | `/api/v1/attendance/students/:studentUserId`                 |  `GET`   | `MANAGE_ATTENDANCE` |   ✅ **COMPLETED**   | Student attendance history modal on `/dashboard/teacher/attendance`      |
| **29** | `Mark Bulk Teacher Attendance`                      | `/api/v1/attendance/teachers/bulk`                           |  `POST`  | `MANAGE_ATTENDANCE` | ❌ **UNIMPLEMENTED** | Pending Faculty Attendance Delegation on `/dashboard/teacher/attendance` |
| **30** | `Get Teacher Attendance Sheet`                      | `/api/v1/attendance/teachers`                                |  `GET`   | `MANAGE_ATTENDANCE` | ❌ **UNIMPLEMENTED** | Pending Faculty Attendance Sheet on `/dashboard/teacher/attendance`      |
| **31** | `Get Specific Teacher Attendance Summary`           | `/api/v1/attendance/teachers/:teacherUserId/summary`         |  `GET`   | `MANAGE_ATTENDANCE` | ❌ **UNIMPLEMENTED** | Pending Faculty Attendance History on `/dashboard/teacher/attendance`    |
| **32** | `Update Single Teacher Attendance Record`           | `/api/v1/attendance/teachers/:teacherAttendanceId`           | `PATCH`  | `MANAGE_ATTENDANCE` | ❌ **UNIMPLEMENTED** | Pending Faculty Attendance Correction on `/dashboard/teacher/attendance` |
| **33** | `Get Exams List (All Roles)`                        | `/api/v1/exams`                                              |  `GET`   |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | `src/app/dashboard/teacher/exams/page.tsx`                               |
| **34** | `Create Exam (Admin or Authorized Teacher)`         | `/api/v1/exams`                                              |  `POST`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | `CreateExamDialog` on `/dashboard/teacher/exams`                         |
| **35** | `Get Single Exam Details (All Roles)`               | `/api/v1/exams/:examId`                                      |  `GET`   |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | `src/api/exam.ts`                                                        |
| **36** | `Update Exam Metadata`                              | `/api/v1/exams/:examId`                                      | `PATCH`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Edit exam modal on `/dashboard/teacher/exams`                            |
| **37** | `Delete Exam`                                       | `/api/v1/exams/:examId`                                      | `DELETE` |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Delete exam confirmation on `/dashboard/teacher/exams`                   |
| **38** | `Bulk Marks Entry`                                  | `/api/v1/exams/:examId/marks`                                |  `POST`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | `BulkMarksEntryModal` on `/dashboard/teacher/exams`                      |
| **39** | `Update Single Student Mark`                        | `/api/v1/exams/:examId/marks/:targetUserId`                  | `PATCH`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Single mark inline correction on `/dashboard/teacher/exams`              |
| **40** | `Publish Exam Results`                              | `/api/v1/exams/:examId/publish`                              | `PATCH`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Publish exam results on `/dashboard/teacher/exams`                       |
| **41** | `Get Batch Exam Results / Merit List`               | `/api/v1/exams/:examId/results`                              |  `GET`   |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | `MeritListModal` on `/dashboard/teacher/exams`                           |
| **42** | `Download/Preview Student Exam Report Card PDF`     | `/api/v1/exams/:examId/students/:studentId/report-card/pdf`  |  `GET`   |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Student report card PDF preview on `/dashboard/teacher/exams`            |
| **43** | `Dispatch Student Report Card PDF via Email`        | `/api/v1/exams/:examId/students/:studentId/send-report-card` |  `POST`  |   `MANAGE_EXAMS`    |   ✅ **COMPLETED**   | Dispatch report card email on `/dashboard/teacher/exams`                 |
| **44** | `Get Institution Profile & Stats (Public)`          | `/api/v1/institution`                                        |  `GET`   |        None         |   ✅ **COMPLETED**   | `TeacherInstitutionCard` on `/dashboard/teacher/settings`                |

---

## 6. Implementation Action Plan for Teacher Role

To bring the Teacher role to 100% completion aligned with the Postman collection:

### Phase 1: Live Teacher Dashboard Overview (`/dashboard/teacher`) — ✅ COMPLETED

1. **Live Metric Cards**: `TeacherKpiCards` with Suspense-first data fetching via TanStack Query (`useTeacherDashboardBatches`, `useTeacherDashboardSchedule`, `useTeacherDashboardExams`, `useTeacherDashboardAttendanceSummary`).
2. **Dynamic Today's Class Schedule**: `TeacherTodayScheduleCard` dynamically filtering today's weekday routine slots with chronological sorting and status badges (`In Progress`, `Up Next`, `Completed`).
3. **Delegated Permission Triggers**: `TeacherPermissionsCard` and `TeacherQuickActionsBar` reflecting actual teacher permissions (`MANAGE_ATTENDANCE`, `MANAGE_EXAMS`, `MANAGE_ROUTINES`).
4. **Campus Check-In Notification Strip**: `TeacherSelfCheckInCard` redesigned as a sleek, top-anchored banner with instant local state caching, duplicate check-in prevention, and localized BST time formatting.
5. **Suspense Loading Skeleton**: `TeacherDashboardPageSkeleton` and route-level `loading.tsx`.

### Phase 2: My Batches & Student Rosters (`/dashboard/teacher/batches`) — ✅ COMPLETED

1. **Batches Directory (`/dashboard/teacher/batches`)**: `TeacherBatchesView` with live debounced search, status filter (`ONGOING`, `UPCOMING`, `COMPLETED`), and Grid vs. Table view switcher.
2. **Teacher Batch Cards**: `TeacherBatchCard` with routine schedule tags, enrolled student counter, monthly fee badge, and fast action bridges to attendance and exams.
3. **Teacher Batch Table**: `TeacherBatchTable` offering dense row-by-row scanning with status badges and contextual dropdown actions.
4. **Batch Detail & Roster View (`/dashboard/teacher/batches/:batchId`)**: `TeacherBatchDetailView` and `TeacherBatchRosterTable` displaying student roll numbers, class level, institution name, and clickable guardian phone (`tel:...`).
5. **Attendance History Bridge**: Integrated `StudentAttendanceHistoryModal` trigger per enrolled student.
6. **Suspense-First Skeletons**: `TeacherBatchesPageSkeleton`, `TeacherBatchDetailSkeleton`, and route-level `loading.tsx` wrappers.

### Phase 3: Teacher Class Routines (`/dashboard/teacher/routines`) — ✅ COMPLETED

1. **Sidebar Navigation Open**: Removed permission guard from `Class Routine` navigation item in `src/constants/dashboard-navigation.ts` so all active faculty members can access their weekly schedule.
2. **Unified Role-Aware Architecture**: Enhanced `RoutinesManagementView` (`portalRole="TEACHER"`) eliminating redundant parallel components. For teachers without routine management, strictly renders personal schedule (`GET /routines/my/teacher-schedule`).
3. **Full Admin Equivalence for Routine Managers**: Teachers with `MANAGE_ROUTINES` receive complete parity with Admin—defaulting to Master "All Classes" view on load, with full access to "By Batch" and "By Teacher" switchers, plus slot scheduling (`POST`), updating (`PATCH`), and deletion (`DELETE`).
4. **Teacher Selector Name Resolution & Pinned (You) Badge**: Implemented `combinedTeachers` memo merging teacher directory query, routine slot references, and the authenticated teacher's profile with `(You)` badge. Solves missing names/UUID fallbacks cleanly.
5. **Print & PDF Export**: Fully integrated A4 landscape print styles and PDF export accessible to all teachers.
6. **Suspense-First Skeletons**: Extracted reusable `RoutinesSkeleton` in `src/components/modules/routines/` and wired into `loading.tsx` and `<Suspense>` boundaries.

### Phase 4: Teacher Profile, Security & Attendance Summary (`/dashboard/teacher/settings`) — ✅ COMPLETED

1. **Faculty Profile & Academic Credentials**: `TeacherProfileCard` providing personal contact updates (`PATCH /users/me`) alongside read-only verified credentials (designation, qualification, specialization, joining date, and delegation status badges).
2. **Avatar Management**: Reused `AdminAvatarCard` for direct photo upload and purge (`PATCH/DELETE /users/me/avatar`).
3. **Security & Sessions**: Reused `ChangePasswordCard` (`PATCH /users/change-password`) and `ActiveSessionsCard` (`GET /auth/sessions`, `POST /auth/logout-all`).
4. **Attendance History**: `TeacherAttendanceHistoryCard` rendering monthly working days, on-time, late, absent, leave, and attendance rate %, plus chronological check-in table via `useMyTeacherAttendanceSummary`.
5. **Institution Overview**: `TeacherInstitutionCard` displaying campus address, contacts, and active size indicators.
6. **Unified Route Architecture**: `/dashboard/teacher/settings` operating with dedicated Suspense skeleton and tab-based navigation.
