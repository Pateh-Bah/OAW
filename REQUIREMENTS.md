# Overhead Aluminium Workshop Web System - Product Requirements Document (PRD)

## ✨ Project Overview

This project is a web application for **Overhead Aluminium Workshop**, a company that specializes in building windows, doors, kitchen cabinets, assembling items, aluminium walls, tables, chairs, and other custom aluminium products. The system is designed to manage staff, customers, site locations, budgeting, and communication, with two types of users: Admin and Staff.

The system will be built using **Next.js**, **Supabase**, and hosted on **Vercel**. GitHub will be used for version control.

---

## 🌐 System Goals

* Centralize customer and site location records
* Automate budget tracking and profit analysis
* Enable secure access with role-based permissions
* Support communication via email and WhatsApp
* Showcase completed and in-progress projects
* Provide internal tools for managing company branding and staff
* Auto-generate professional employee ID cards

---

## 🎨 Key Features

### 1. Authentication & User Roles

* Supabase Auth with email/password
* Roles: `Admin` and `Staff`
  * Admin: Full permissions
  * Staff: Restricted to uploading project media

### 2. Employee Management

* Admin can add/edit/delete/view employee records
* Fields:
  * Full Name
  * Designation
  * Department
  * Badge Number
  * Contact Info
  * Profile Photo
* ID Card Generator:
  * Front: Photo, name, designation, badge number, department, **QR code** (bottom right)
  * Back:
    ```
    Bearer whose name and photograph is on this ID Card is an employee of  
    Overhead Aluminium Workshop  
    If found, please return to the nearest office or Police Station  
    8 Hill Cot Road, Freetown.  
    overheadaluminium@gmail.com  
    +232-77-902-889 / +232-31-902-889  
    https://www.overheadaluminium.com
    ```

### 3. Customer & Site Management

* Record customer:
  * Full name
  * Phone number
  * Email (optional)
* Each customer can have multiple site locations
* Each site has:
  * Address
  * Budget (total cost)
  * Breakdown of costs (materials, labor, etc.)
  * Company earnings per project
  * Project status: `In Progress`, `Completed`
  * Images or videos (uploaded by Senior Staff)

### 4. Budgeting & Finance Module

* Admin-only access to:
  * Create and update budgets per site
  * View company earnings per site/project
  * Calculate profit (total earnings - cost)
* Time-based filters:
  * View profits: Daily, Weekly, Monthly, Yearly
* Share options:
  * Auto-generated link for customer access
  * Export to PDF or printable version

### 5. Dashboard

* Admin Dashboard:
  * Total customers
  * Number of ongoing/completed sites
  * Budget statistics
  * Project status breakdown
* Staff Dashboard:
  * Assigned sites
  * Media upload panel

### 6. Public Website Pages

* **Landing Page**
  * Gallery of completed and ongoing site images/videos
  * Site locations with status
* **About Us Page**
  * Description of company
  * Company logo
  * Contact Info (email, phone, address)
  * Office Image (editable by admin)
* **Our Team Page**
  * Displays staff list with name, designation, and photo
* **Contact Page**
  * Google Map of office location
  * Contact form
    * Options to send via WhatsApp or Email

### 7. Branding & Company Settings (Admin only)

* Change company name
* Upload/change logo
* Set primary theme color

---

## 📈 Technical Stack

* **Frontend**: Next.js + Tailwind CSS + shadcn/ui
* **Backend**: Supabase (PostgreSQL, Auth, Storage)
* **Hosting**: Vercel
* **Version Control**: GitHub
* **Libraries & Tools**:
  * `qrcode.react` - QR code generation
  * `html2pdf.js` / `react-pdf` - PDF generation
  * `react-hook-form` / `Formik` - Form handling
  * `Google Maps API` - Location display
  * `WhatsApp API link` - Message initiation
  * `shadcn/ui` - Enhanced UI components

---

## 🚀 Future Enhancements

* SMS and Email notifications
* Client dashboard to view their own projects
* Activity logs for admin actions
* Finishing/Interior Decoration modules

---

## 💼 Deliverables

* Source code (GitHub)
* Live application (Vercel)
* Employee ID generation templates
* Project documentation

---

## ✅ Success Criteria

* Fully functional and responsive system
* Smooth role-based access control
* Efficient budgeting and profit display
* Seamless communication and project sharing
* Aesthetic and professional presentation of employee IDs and projects
