# Student Conduct Management System

**Web Application for Managing Student Behavior Using Point-Based
System**

Student Conduct Management System adalah aplikasi web modern untuk
**mengelola perilaku siswa secara digital menggunakan sistem poin**,
dirancang untuk sekolah, institusi pendidikan, dan penelitian akademik.\
Aplikasi ini membantu admin mencatat pelanggaran dan prestasi siswa,
menerapkan aturan poin secara konsisten, serta mengirimkan notifikasi
otomatis melalui WhatsApp.

> Built with Laravel, React, TypeScript, and Inertia.js --- designed for
> scalability, clarity, and learning.

------------------------------------------------------------------------

## ✨ Features

### 🎯 Core Features

-   Point-based student behavior management
-   Flexible point rules (positive & negative)
-   Period-based validation (limit per month)
-   Automatic SP1 notification via WhatsApp
-   Admin dashboard with analytics
-   Student portal (no password login)
-   Clean and scalable architecture

### 👨‍💼 Admin Features

-   Manage students data
-   Manage point rules (CRUD)
-   Assign points to students
-   View statistics and charts
-   Automatic WhatsApp notification (SP1)

### 👩‍🎓 Student Features

-   Login with NISN + birth date
-   View personal dashboard
-   View point history and status

------------------------------------------------------------------------

## 🧠 Who Is This Project For?

This project is suitable for: - Students learning Laravel & React -
Final project / thesis reference - School management system - Developers
who want to learn Inertia.js - Portfolio project - Research on student
behavior analytics

------------------------------------------------------------------------

## 🏗️ Technology Stack

### Backend

-   Laravel 12
-   PHP 8+
-   MySQL / MariaDB
-   Service Layer Architecture
-   Custom Authentication Guard

### Frontend

-   React
-   TypeScript
-   Inertia.js
-   Vite
-   Tailwind CSS (shadcn UI)
-   Recharts (Charts)

### External Services

-   WhatsApp Gateway (Fonnte)

------------------------------------------------------------------------

## 🔐 Authentication System

### Admin

-   Email + Password
-   Guard: `web`
-   Full system access

### Student

-   Login without password
-   NISN + Birth Date
-   Guard: `student`
-   Limited access (read-only)

------------------------------------------------------------------------

## 🔄 Application Flow (Simple Explanation)

1.  Admin creates point rules
2.  Admin assigns points to students
3.  System validates rules and period
4.  SP1 notification is sent via WhatsApp
5.  Student logs in and views dashboard

------------------------------------------------------------------------

## 📂 Project Structure (Simplified)

    app/
     ├── Http/Controllers/
     │    ├── Admin/
     │    └── Student/
     ├── Services/
     │    ├── StudentPointService.php
     │    └── FonnteService.php

    resources/
     ├── js/
     │    ├── pages/
     │    └── components/

    routes/
     ├── web.php
     └── student.php

------------------------------------------------------------------------

## ⚙️ Installation Guide

``` bash
git clone https://github.com/Kazetama/student-conduct-app.git
cd student-conduct-app
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
npm run dev
```

------------------------------------------------------------------------

## 📊 Dashboard & Analytics

Admin dashboard includes student statistics, point trends, and violation
distributions using Recharts.

------------------------------------------------------------------------

## 🚀 Future Improvements

-   Teacher & Parent roles
-   RBAC system
-   SP2 & SP3 automation
-   PDF export
-   Queue-based notifications
-   Audit logs

------------------------------------------------------------------------

## 👤 Author

**Kaze (Kazetama)**\
Software Developer \| Researcher \| Technical Consultant
