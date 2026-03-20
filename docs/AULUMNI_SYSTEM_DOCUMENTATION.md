# AULUMNI System Documentation

Repository snapshot analyzed on 2026-03-20.

## 1. Overview

AULUMNI is a Laravel-based alumni information system with a social-media-inspired interface that is focused on job postings rather than general social posting.

At a high level, the system supports:

- alumni account management
- alumni profile records split into personal, academic, contact, and employment data
- admin moderation of alumni-submitted job posts
- employee and admin account management
- branch, department, and course utilities
- Excel import and export for alumni and employees
- in-app notifications, especially for import reports
- basic feed interactions such as reactions

The current repository represents a mix of:

- implemented business features
- starter-kit authentication/settings scaffolding
- in-progress social/feed features
- a few legacy or inconsistent code paths that need cleanup

## 2. Business Scope

### Product intention

The product behaves like an institution-managed alumni network with a feed-like experience, but the feed is currently centered on job postings only.

### Primary users

- Admins: manage users, alumni records, master data, and moderate posts
- Employees: modeled in the database and UI, but their runtime experience is still limited
- Alumni: view the feed, create job posts, react to posts, and access their profile-related UI

## 3. Technology Stack

### Backend

- Laravel 12
- PHP 8.2
- Laravel Fortify for authentication
- Laravel Reverb for realtime broadcasting
- Laravel Echo on the frontend
- Maatwebsite Excel for import/export
- Database-backed sessions, cache, jobs, and notifications

### Frontend

- React 19
- TypeScript
- Inertia.js
- Vite
- Tailwind CSS 4
- Radix UI
- shadcn-style component patterns
- Lucide icons

### Developer tooling

- Laravel Pint
- ESLint
- Prettier
- PHPUnit-based feature tests

## 4. Architecture Summary

The application uses a standard Laravel + Inertia architecture:

1. Laravel routes map requests to controllers.
2. Controllers query Eloquent models and return either Inertia pages or JSON responses.
3. React pages under `resources/js/pages` render the UI.
4. Shared props from `HandleInertiaRequests` provide auth user, modal flash state, sidebar state, and notifications.
5. Reverb/Echo provide live updates for posts and user notifications.

### Runtime layers

- HTTP layer: route files grouped by feature under `routes/`
- Domain layer: controllers, actions, requests, imports, exports, notifications
- Persistence layer: Eloquent models backed by MySQL/SQLite-compatible migrations
- SPA layer: Inertia pages, layouts, and reusable components in `resources/js`

## 5. Roles and Access Control

### Role model

User roles are stored in `users.user_type`.

Observed role values:

- `admin`
- `employee`
- `alumni`

### Middleware

Role protection is handled by `App\Http\Middleware\EnsureRole`, which checks:

- authenticated user exists
- `user_type` exactly matches the required role string

### Practical access patterns

- Admin-only modules are mostly protected with `auth` + `role:admin`
- Alumni feed reactions are protected with `auth` + `role:alumni`
- Settings pages use `auth`, with some actions additionally requiring `verified`

### Important caveat

The `routes/admin.php` file currently uses only `auth` middleware, not `role:admin`. That means the admin user-management routes are not as tightly protected as the rest of the admin modules.

## 6. Major Functional Modules

### 6.1 Authentication and Account Settings

Authentication is provided by Laravel Fortify.

Enabled features in `config/fortify.php`:

- registration
- password reset
- email verification
- two-factor authentication

Settings area includes:

- profile update
- password update
- appearance settings
- two-factor setup
- account deletion

### 6.2 Alumni Management

This is the most developed business module.

Capabilities:

- paginated alumni directory
- filtering by branch, school level, course, batch, and status
- search by name
- multi-column sorting
- bulk activation, deactivation, and deletion
- Excel import/export
- manual alumni creation through a 4-step flow
- alumni profile review and update by section

Alumni data is split across:

- `alumni`
- `alumni_personal_details`
- `alumni_academic_details`
- `alumni_contact_details`
- `alumni_employment_details`

### 6.3 Employee Management

Capabilities:

- paginated employee list
- filtering by branch and department
- search and sorting
- bulk user actions
- create employee modal
- Excel import/export

Employee records are stored in `employees` and linked to `users`.

### 6.4 Admin Management

Capabilities currently visible in code:

- admin listing page
- bulk user actions through shared user routes
- import/export UI patterns similar to employee management

This module is less polished than alumni and employee management and contains some copied employee logic.

### 6.5 Utility Management

Master-data modules:

- branches
- departments
- courses

These support dropdowns and filtering across the admin interface.

### 6.6 Job Posting and Feed

The feed is the main alumni-facing social area.

Current post workflow:

- alumni submit job posts
- posts are created with `pending` status
- admins review and approve or reject posts
- approved posts appear in the alumni news feed

Post data currently used by the application includes:

- job title
- company
- location
- job type
- salary
- job description
- privacy
- status
- attachments

### 6.7 Reactions

Reactions are implemented as a toggle:

- one reaction per user per post
- creating a reaction increments `reactions_count`
- reacting again removes it and decrements the counter

### 6.8 Notifications

Notifications are stored in the database and also broadcast in realtime.

The clearest implemented notification type is:

- `ImportReportNotification`

This is used after alumni imports to show:

- total rows
- successful rows
- failed rows
- per-row validation failures

## 7. End-to-End Workflows

### 7.1 Manual Alumni Creation

Manual alumni creation is a 4-step process handled by `User\AlumniController`:

1. Personal details
2. Academic details
3. Contact details
4. Employment details

Implementation details:

- each step validates and stores data in the session
- `current_step` prevents users from skipping ahead
- the final step calls `App\Actions\Alumni\CreateAlumni`
- `CreateAlumni` creates the `users` row and all alumni detail rows
- the session is cleared after successful completion

Generated credentials:

- user type is set to `alumni`
- the initial password is derived from initials and the current year
- the username is auto-generated from the name by `CreateNewUser`

### 7.2 Alumni Import

Alumni import uses `App\Imports\AlumniImport`.

Import flow:

1. Admin uploads an Excel file.
2. Each row is validated with `WithValidation`.
3. Invalid rows are skipped and collected through `SkipsFailures`.
4. Valid rows are transformed and passed to `CreateAlumni`.
5. A report is built with success and failure counts.
6. The importing user receives an `ImportReportNotification`.

Notable characteristics:

- import column names are mapped to DB-oriented keys via `importToDbMap()`
- rows are validated against both alumni tables and the `users` table
- the notification payload is designed for both database storage and broadcast delivery

### 7.3 Employee Import

Employee import uses `App\Imports\EmployeeImport`.

Flow:

1. Read rows from Excel.
2. Generate a unique `EMP-xxxxx` identifier.
3. Create the linked `users` account.
4. Create or update the `employees` record.

Compared to alumni import, employee import is simpler and currently has less reporting structure.

### 7.4 Job Post Submission and Moderation

Post lifecycle:

1. Alumni open the create-post modal.
2. `PostRequest` validates job-post fields and attachments.
3. `PostController@store` creates the post with `pending` status.
4. Attachments are stored under `storage/app/public/attachments/YYYY/MM`.
5. A `PostsUpdated` event is broadcast on the public `posts` channel.
6. Admins review posts in `/content/post`.
7. Admins approve or reject posts.
8. Alumni feed shows only posts with `approved` status.

### 7.5 Feed Rendering

Feed data is prepared by `HomeController@show_posts`.

Feed query behavior:

- only approved posts are shown
- author, attachments, comments, and shares are eager-loaded
- a `liked_by_user` flag is computed per post
- posts are sorted newest first

### 7.6 Realtime Behavior

Two realtime flows are present:

- public `posts` channel for feed/admin post refresh
- private `App.Models.User.{user_id}` channel for notifications

Frontend listeners:

- `resources/js/components/post-list.tsx` listens for `.PostsUpdated`
- `resources/js/components/notification-listener.tsx` listens for private notifications

## 8. Data Model

Below is the intended logical data model based on the models and controllers.

### Core identity tables

| Table | Purpose | Key relationships |
| --- | --- | --- |
| `users` | Base authentication and role record | has one alumni, has one employee, has many posts/comments/reactions/shares |
| `employees` | Employee profile and org assignment | belongs to user |
| `alumni` | Root alumni record | belongs to user, owns all alumni detail tables |

### Alumni detail tables

| Table | Purpose |
| --- | --- |
| `alumni_personal_details` | Names, birthday, gender, bio, interests, address |
| `alumni_academic_details` | student number, school level, batch, branch, course |
| `alumni_contact_details` | email, contact numbers, addresses, social links |
| `alumni_employment_details` | first job, current work, income, satisfaction, AU usefulness |

### Content tables

| Table | Purpose |
| --- | --- |
| `posts` | Alumni-created job posts |
| `attachments` | uploaded media or files linked to posts |
| `comments` | threaded comments on posts |
| `reactions` | one-user-per-post reactions |
| `shares` | post shares with optional comment |

### Utility tables

| Table | Purpose |
| --- | --- |
| `branches` | campus/branch master data |
| `departments` | academic/organizational department master data |
| `courses` | course master data linked to departments |
| `batch` | graduation year master data |

### Laravel infrastructure tables

- `notifications`
- `sessions`
- `cache`
- `cache_locks`
- `jobs`
- `job_batches`
- `failed_jobs`
- `password_reset_tokens`

## 9. Eloquent Relationships

### `User`

- has one `Alumni`
- has one `Employee`
- has many `Post`
- has many `Comment`
- has many `Reaction`
- has many `Share`

### `Alumni`

- belongs to `User`
- has one personal detail record
- has one academic detail record
- has one contact detail record
- has one employment detail record

### `Post`

- belongs to `User` as `author`
- has many `Attachment`
- has many `Comment`
- has many `Reaction`
- has many `Share`

### `Comment`

- belongs to `Post`
- belongs to `User`
- belongs to parent `Comment`
- has many child comments

## 10. Route Reference

This section summarizes the main application routes registered by `php artisan route:list --except-vendor`.

### 10.1 Public and Home

| Method | Path | Name | Purpose |
| --- | --- | --- | --- |
| GET | `/` | `home` | Entry point; redirects experience by role |
| GET | `/{user_name}` | `news-feed.show_profile` | Alumni profile-style route and notifications redirect edge case |

### 10.2 Notifications

| Method | Path | Name | Purpose |
| --- | --- | --- | --- |
| GET | `/notifications` | `notifications.index` | Notification center |

### 10.3 Content / Job Posts

| Method | Path | Name | Purpose | Access |
| --- | --- | --- | --- | --- |
| GET | `/content/post` | `post.index` | Admin post listing | admin |
| GET | `/content/post/{post}` | `post.show` | Post JSON detail | admin |
| GET | `/content/post/{post_id}` | `post.retrieve` | Simplified post JSON | admin |
| DELETE | `/content/post/{post}` | `post.destroy` | Delete post | admin |
| PATCH | `/content/post/approve/{post}` | `post.approve` | Approve post | admin |
| PATCH | `/content/post/reject/{post}` | `post.reject` | Reject post | admin |
| POST | `/post` | `post.store` | Create job post | authenticated user |

### 10.4 Alumni Feed Actions

| Method | Path | Name | Purpose | Access |
| --- | --- | --- | --- | --- |
| POST | `/post-action/reaction` | `reaction.store` | Toggle reaction | alumni |

### 10.5 Alumni Management

| Method | Path | Name | Purpose | Access |
| --- | --- | --- | --- | --- |
| GET | `/user/alumni` | `alumni.index` | Alumni listing | admin |
| GET | `/user/alumni/{user_name}` | `alumni.show` | Alumni full profile | admin |
| GET | `/user/alumni/{alumni}/personal` | `alumni.show_personal` | Personal tab | admin |
| GET | `/user/alumni/{alumni}/academic` | `alumni.show_academic` | Academic tab | admin |
| GET | `/user/alumni/{alumni}/contact` | `alumni.show_contact` | Contact tab | admin |
| GET | `/user/alumni/{alumni}/employment` | `alumni.show_employment` | Employment tab | admin |
| GET | `/user/alumni/create/{step}` | `alumni.step` | Multi-step creation page | admin |
| POST | `/user/alumni/create/process_personal_details` | `alumni.process_personal_details` | Step 1 submit | admin |
| POST | `/user/alumni/create/process_academic_details` | `alumni.process_academic_details` | Step 2 submit | admin |
| POST | `/user/alumni/create/process_contact_details` | `alumni.process_contact_details` | Step 3 submit | admin |
| POST | `/user/alumni/create/process_employment_details` | `alumni.process_employment_details` | Final step submit | admin |
| POST | `/user/alumni/import` | `alumni.import` | Import alumni | admin |
| GET | `/user/alumni/export_alumni` | `alumni.export_alumni` | Export alumni | admin |
| PATCH | `/user/alumni/update_profile/{user}` | `alumni.update_profile` | Update linked user record | admin |
| PATCH | `/user/alumni/update_personal/{alumni}` | `alumni.update_personal` | Update personal details | admin |
| PATCH | `/user/alumni/update_academic/{alumni}` | `alumni.update_academic` | Update academic details | admin |
| PATCH | `/user/alumni/update_contact/{alumni}` | `alumni.update_contact` | Update contact details | admin |
| PATCH | `/user/alumni/update_employment/{alumni}` | `alumni.update_employment` | Update employment details | admin |

### 10.6 Employee Management

| Method | Path | Name | Purpose | Access |
| --- | --- | --- | --- | --- |
| GET | `/user/employee` | `employee.index` | Employee listing | admin |
| GET | `/user/employee/create` | `employee.store` | Currently mapped oddly; intended creation entry | admin |
| POST | `/user/employee/import` | `employee.import` | Import employees | admin |
| GET | `/user/employee/export_employee` | `employee.export_employee` | Export employees | admin |

### 10.7 Admin Management

| Method | Path | Name | Purpose | Access in current code |
| --- | --- | --- | --- | --- |
| GET | `/user/admin` | `admin.index` | Admin listing | authenticated |
| GET | `/user/admin/create` | `admin.store` | Currently mapped oddly; intended creation entry | authenticated |
| POST | `/user/admin/import` | `admin.import` | Import admins | authenticated |
| GET | `/user/admin/export_admin` | `admin.export_admin` | Export admins | authenticated |

### 10.8 Shared User Operations

| Method | Path | Name | Purpose |
| --- | --- | --- | --- |
| PATCH | `/user/activate/{user}` | `user.activate` | Activate one user |
| PATCH | `/user/deactivate/{user}` | `user.deactivate` | Deactivate one user |
| DELETE | `/user/delete/{user}` | `user.destroy` | Delete one user |
| POST | `/user/bulk_activate` | `user.bulk_activate` | Bulk activate users |
| POST | `/user/bulk_deactivate` | `user.bulk_deactivate` | Bulk deactivate users |
| POST | `/user/bulk_delete` | `user.bulk_delete` | Bulk delete users |

### 10.9 Settings

| Method | Path | Name | Purpose |
| --- | --- | --- | --- |
| GET | `/settings/profile` | `profile.edit` | Edit profile page |
| PATCH | `/settings/profile` | `profile.update` | Update profile |
| DELETE | `/settings/profile` | `profile.destroy` | Delete account |
| GET | `/settings/password` | `user-password.edit` | Password page |
| PUT | `/settings/password` | `user-password.update` | Update password |
| GET | `/settings/appearance` | `appearance.edit` | Appearance page |
| GET | `/settings/two-factor` | `two-factor.show` | Two-factor page |

### 10.10 Utility Routes

| Method | Path | Name | Purpose |
| --- | --- | --- | --- |
| GET | `/utility/branch` | `branch.index` | Branch list |
| POST | `/utility/branch` | `branch.store` | Branch create |
| PUT/PATCH | `/utility/branch/{branch}` | `branch.update` | Branch update |
| DELETE | `/utility/branch/{branch}` | `branch.destroy` | Branch delete |
| GET | `/utility/course` | `courses.index` | Course list |
| POST | `/utility/course` | `courses.store` | Course create |
| PUT/PATCH | `/utility/{course}` | `courses.update` | Course update |
| DELETE | `/utility/{course}` | `courses.destroy` | Course delete |
| PUT/PATCH | `/utility/{department}` | `department.update` | Department update |
| DELETE | `/utility/{department}` | `department.destroy` | Department delete |

The utility area currently contains route inconsistencies. See Section 14.

## 11. Frontend Structure

### Pages

Main page folders under `resources/js/pages`:

- `admin/`
- `alumni/`
- `auth/`
- `settings/`

### Layouts

- `layouts/app-layout.tsx`: global application wrapper with modal and confirmation support
- `layouts/app/app-sidebar-layout.tsx`: sidebar shell, hides the sidebar for alumni users
- `layouts/auth/*`: auth-specific layouts

### Important components

- `alumni-list.tsx`: admin alumni directory with filters and bulk actions
- `employee-list.tsx`: employee directory UI
- `admin-list.tsx`: admin directory UI
- `post-list.tsx`: admin job-post moderation view
- `post-create-modal.tsx`: alumni job-post creation modal
- `post-item.tsx`: feed card renderer
- `notification-listener.tsx`: realtime notification listener
- `notifications/*`: notification detail rendering

### Navigation behavior

Admin UI uses:

- sidebar navigation
- top header with notifications and account menu

Alumni UI currently:

- hides the sidebar
- uses the top header with branding and notifications

There is a `NavAlumni` component in the repository, but it is not currently wired into the active layout.

## 12. Setup and Local Development

### 12.1 Prerequisites

- PHP 8.2 or newer
- Composer
- Node.js and npm
- database server or SQLite

### 12.2 Install

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

### 12.3 Run development services

Option A:

```bash
composer dev
```

This starts:

- `php artisan serve`
- `php artisan queue:listen --tries=1`
- `npm run dev`

Option B:

Run them individually if you prefer.

### 12.4 Realtime configuration

The frontend is already configured for Echo + Reverb in `resources/js/app.tsx`, but `.env.example` does not ship with Reverb variables and defaults broadcasting to `log`.

To enable realtime features consistently, add and align:

- `BROADCAST_CONNECTION=reverb`
- `REVERB_APP_ID`
- `REVERB_APP_KEY`
- `REVERB_APP_SECRET`
- `REVERB_HOST`
- `REVERB_PORT`
- `REVERB_SCHEME`
- `VITE_REVERB_APP_KEY`
- `VITE_REVERB_HOST`
- `VITE_REVERB_PORT`
- `VITE_REVERB_SCHEME`

Then run:

```bash
php artisan reverb:start
```

### 12.5 Storage

Post attachments are stored in the public disk. Make sure the public storage link exists:

```bash
php artisan storage:link
```

## 13. Testing Status

Current automated tests are mostly starter-kit coverage for:

- authentication
- email verification
- password reset
- two-factor auth
- profile settings

There is very little or no automated coverage for the custom business modules:

- alumni creation stepper
- alumni import/export
- employee/admin management
- post creation/moderation
- reactions
- notifications
- utility management

This means the business-critical modules are currently under-tested compared with the auth/settings scaffolding.

## 14. Known Gaps and Inconsistencies

This section is important. The repository does not represent a perfectly aligned production system yet.

### 14.1 Post schema mismatch

The application code treats `posts` as a job-posting table with fields such as:

- `job_title`
- `company`
- `location`
- `job_type`
- `salary`
- `job_description`

However, the large migration `2026_02_03_022802_create_all_tables.php` still creates `posts` with a generic `content` field instead.

Implication:

- either the database has been altered outside the committed migrations
- or the repository is missing a follow-up migration for the job-post schema

### 14.2 Contact detail field mismatch

`AlumniImport` and `AlumniExport` use `telephone` and `company_address`, but:

- `AlumniContactDetails` model does not list them as fillable
- the committed migration for `alumni_contact_details` does not define them

Implication:

- those fields are not consistently represented across import/export, model, and schema layers

### 14.3 Missing frontend pages referenced by controllers

The following Inertia pages are referenced but not present in the repository:

- `employee/dashboard`
- `alumni/notifications`
- `courses/Index`

Implication:

- these flows will fail if reached

### 14.4 Tests still target a missing `dashboard` route

Feature tests reference `route('dashboard')`, but the current web routes expose `home` at `/` instead.

Implication:

- the test suite reflects starter-kit assumptions more than current application routing

### 14.5 Utility route collisions and naming problems

The utility routing is currently inconsistent:

- `routes/department.php` uses the path segment `course` for department index/store
- department update/delete use `/utility/{department}` without a dedicated prefix
- course update/delete also use `/utility/{course}` without a dedicated prefix
- the UI navigation links do not fully match the registered route paths

Implication:

- department and course management are not cleanly separated
- some screens may be unreachable or ambiguous

### 14.6 Admin route protection is weaker than expected

`routes/admin.php` is protected by `auth` only, while similar admin modules use `auth` + `role:admin`.

Implication:

- non-admin authenticated users may access pages that should likely be restricted

### 14.7 Admin module contains copied employee logic

`AdminController` includes:

- employee import/export naming
- employee-style creation logic
- redirects back to employee routes in some cases

Also, `app/Models/Admin.php` defines a class named `Employee`, which is almost certainly incorrect.

Implication:

- the admin management area needs refactoring before it can be considered stable

### 14.8 Feed interactions are only partially implemented

The repository includes models/controllers for:

- comments
- attachments
- shares

But:

- comment, share, and attachment routes are not wired in the main route files
- the comment/share buttons in the feed are mostly placeholders
- some older components still expect content-style posts rather than job-style posts

Implication:

- the app is currently closer to "job feed with likes" than a complete social interaction system

### 14.9 Realtime defaults are incomplete

The frontend expects Reverb configuration, but `.env.example` defaults broadcasting to `log` and does not include Reverb variables.

Implication:

- live updates will not work out of the box without extra environment setup

### 14.10 Navigation placeholders remain

UI navigation still references not-yet-implemented or mismatched destinations such as:

- announcements
- system logs
- some profile/chat/event placeholders
- inconsistent utility links

Implication:

- the interface includes roadmap or placeholder affordances that are not backed by finished routes/pages

## 15. Recommended Next Steps

If this repository is going to move toward production readiness, the highest-value cleanup order is:

1. Align the database migrations with the actual job-post schema in code.
2. Fix route definitions for department, course, admin, and employee create flows.
3. Lock down admin-only modules with consistent role middleware.
4. Add missing Inertia pages or remove dead controller references.
5. Normalize alumni contact fields across migration, model, import, export, and types.
6. Decide whether comments/shares are in scope now or should be removed from the current release.
7. Add business-feature tests for alumni creation, imports, posts, moderation, and notifications.

## 16. Summary

AULUMNI is already shaped around a clear product idea: an institution-managed alumni platform where the social surface is focused on job opportunities. The strongest implemented areas are alumni management, Excel imports, and the job-post creation/moderation flow. The main challenge in the current repository is not the absence of structure, but the presence of several incomplete transitions from starter-kit code and earlier social-feed assumptions into the current job-posting product direction.
