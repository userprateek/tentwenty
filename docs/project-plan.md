# TickTock Project Plan

## Product

TickTock is a timesheet web application for employees to sign in, view weekly timesheets, create or update weekly entries, and later persist the workflow with PostgreSQL.

## Screens Received

1. Login page
   - Route: `/login`
   - Split screen layout with form on the left and blue brand panel on the right.
   - Form fields: email, password, remember me.
   - Primary action: Sign in.

2. Timesheet list
   - Route: `/timesheets`
   - Shared app header with `ticktock`, Timesheets nav item, and user menu.
   - Main content card with filters, sortable table, status pills, actions, page size selector, pagination, and footer.
   - Actions: View, Update, Create.

3. Weekly timesheet detail
   - Route: `/timesheets/[weekId]`
   - Shared app header.
   - Week card with title, date range, progress summary, per-day task rows, add-task rows, row action menu, and footer.
   - Actions: add task, edit task, delete task.

4. Add new entry modal
   - Rendered on top of `/timesheets/[weekId]`.
   - Modal form fields: project, type of work, task description, hours stepper.
   - Actions: Add entry, Cancel, close.

## Implementation Order

1. Establish app shell and design tokens.
   - Create shared header, footer, buttons, inputs, select controls, status badges, cards, and modal primitives.
   - Replace the current starter page with a redirect or login entry point.
   - Status: started. Inter and initial login-specific tokens are in place.

2. Build `/login`.
   - Match the split-screen layout first.
   - Add client-side form state and call a mock auth API route.
   - Status: visual pass complete. API wiring remains.

3. Build `/timesheets`.
   - Create static table data in a local fixture.
   - Add filters, pagination UI, and action links.
   - Wire list to a mock API route after the visual pass.
   - Status: visual pass complete. API wiring remains.

4. Build `/timesheets/[weekId]`.
   - Create the weekly task layout and progress bar.
   - Add interactive menus and modal state.
   - Status: visual pass complete. Modal/API wiring remains.

5. Build add/edit entry modal.
   - Make the modal reusable for create and edit.
   - Wire the hours stepper and submit/cancel interactions.
   - Status: add-entry modal visual pass complete. Submit still needs API wiring.

6. Add API routes with in-memory data.
   - `POST /api/auth/login`
   - `GET /api/auth/session`
   - `DELETE /api/auth/session`
   - `GET /api/timesheets`
   - `GET /api/timesheets/[weekId]`
   - `POST /api/timesheets/[weekId]/entries`
   - `PATCH /api/timesheets/[weekId]/entries/[entryId]`
   - `DELETE /api/timesheets/[weekId]/entries/[entryId]`

7. Add PostgreSQL later.
   - Introduce Prisma or Drizzle after UI/API behavior is stable.
   - Model users, projects, work types, timesheets, days, and entries.

## Data Model Draft

User:
- id
- name
- email
- passwordHash
- createdAt
- updatedAt

Project:
- id
- name
- createdAt
- updatedAt

WorkType:
- id
- name
- createdAt
- updatedAt

Timesheet:
- id
- userId
- weekNumber
- startDate
- endDate
- status: completed | incomplete | missing
- requiredHours
- submittedHours
- createdAt
- updatedAt

TimesheetEntry:
- id
- timesheetId
- projectId
- workTypeId
- date
- description
- hours
- createdAt
- updatedAt

## Visual Notes

- Font: Inter throughout.
- Page background: light neutral gray.
- Primary blue: bright app blue used for login brand panel, primary buttons, action links, and active pagination.
- Cards: white, subtle border/shadow, 8px radius.
- Form controls: 8px radius, light gray borders, generous height.
- Status pills:
  - Completed: pale green with dark green text.
  - Incomplete: pale yellow with brown text.
  - Missing: pale pink with red text.
- Header: white, fixed-height horizontal bar with brand at left and user dropdown at right.

## Open Questions

- Should users land on `/login` or should `/` redirect to `/login`?
- Are there mobile designs, or should I create responsive versions based on these desktop screens?
- Do project and work type options come from admin-managed lists later?
