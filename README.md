# AULUMNI

AULUMNI is an alumni management and job-posting platform built with Laravel, Inertia, React, and TypeScript. The product combines:

- an admin back office for managing alumni, employees, admins, branches, departments, and courses
- an alumni-facing feed where approved job posts can be published and reacted to
- Excel-based import and export workflows for institutional data management
- Fortify-powered authentication with password reset, email verification, and two-factor authentication

This repository started from the Laravel React starter kit, but it has already been adapted into a school-focused alumni system.

## Documentation

Full project documentation is available at:

- [docs/AULUMNI_SYSTEM_DOCUMENTATION.md](docs/AULUMNI_SYSTEM_DOCUMENTATION.md)

That document covers:

- product scope and current feature set
- architecture and technology stack
- roles and permissions
- route and module reference
- data model summary
- setup and local development
- known gaps and technical debt found in the current codebase

## Quick Start

Prerequisites:

- PHP 8.2+
- Composer
- Node.js and npm
- a database supported by Laravel

Install and run:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run dev
php artisan serve
```

You can also use the built-in Composer helper:

```bash
composer dev
```

`composer dev` starts:

- the Laravel web server
- the queue listener
- the Vite dev server

## Realtime Features

The frontend is already wired for Laravel Echo + Reverb, but realtime broadcasting is not fully enabled by the default `.env.example`.

If you want live post updates and notification broadcasts to work consistently, configure:

- `BROADCAST_CONNECTION=reverb`
- `REVERB_*` server variables
- matching `VITE_REVERB_*` frontend variables

Then start Reverb separately:

```bash
php artisan reverb:start
```

## Current Status

The project is usable as a foundation for an alumni job-posting platform, but the repository still contains several incomplete or mismatched parts. See the "Known Gaps and Inconsistencies" section in the main documentation before planning production work.
