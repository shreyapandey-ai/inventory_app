
#Inventory Management System
##Overview
###This is a full-stack Inventory Management System built using Next.js (App Router), Prisma ORM, PostgreSQL, and JWT-based authentication.

The system supports role-based access control with separate Admin and Manager dashboards. It includes product management, stock tracking with movement history, CSV bulk uploads, analytics, and AI-generated reporting.

This project demonstrates a production-ready architecture with secure APIs, structured database design, and scalable dashboard implementation.

Tech Stack
Frontend:

Next.js (App Router)

React

Tailwind CSS

Backend:

Next.js API Routes

Prisma ORM

PostgreSQL

Authentication:

JWT (JSON Web Token)

HTTP-only Cookies

Additional Features:

CSV Bulk Product Upload

Stock Movement System

Role-Based Access Control

Analytics Dashboard

AI-Based Report Generation

Core Features
1. Authentication System
User Registration

User Login

JWT Authentication

HTTP-only cookie storage

Role-based route protection

Admin and Manager roles

2. Role-Based Access Control
Admin:

Full dashboard access

Add/Edit/Delete products

Manage categories

Manage suppliers

Update stock

Bulk upload via CSV

View analytics

Generate AI reports

Manager:

Read-only dashboard

View products

View stock analytics

Cannot modify inventory

3. Product Management
Add new products

Automatic SKU generation

Edit product details

Delete product (only if stock is zero)

Quantity validation (cannot go below 0)

Price validation (must be >= 0)

Linked to category and supplier

4. Stock Movement System
Every stock update creates a movement record.

Supported Movement Types:

SALE

RESTOCK

DAMAGE

RETURN

Each movement stores:

Type

Quantity

Optional note

Timestamp

Stock is automatically adjusted when a movement is created.

5. CSV Bulk Upload
Admin can upload multiple products using a CSV file.

Required CSV columns:

name,quantity,price,categoryId,supplierId
Features:

SKU auto-generated

Negative quantity prevented

Negative price prevented

Bulk insertion using Prisma createMany

6. Analytics Dashboard
Admin Dashboard includes:

Total Products

Total Stock

Low Stock Detection

Category Distribution

Supplier Distribution

Stock Visualization Charts

Manager Dashboard includes:

Total Products

Total Stock

Read-only product listing

Basic analytics

7. AI Report Generation
Generates reports based on:

Current stock levels

Low stock items

Inventory summary

Can be extended to export PDF or structured analytics reports.

Database Schema Overview
Models:

User

id

email

password

role (ADMIN / MANAGER)

Category

id

name

products

Supplier

id

name

email

phone

products

Product

id

name

sku

quantity

price

categoryId

supplierId

stockMovements

StockMovement

id

productId

type (SALE / RESTOCK / DAMAGE / RETURN)

quantity

note

createdAt

Relationships:

Product belongs to Category

Product belongs to Supplier

Product has many StockMovements

Installation Guide
1. Clone Repository
git clone https://github.com/shreyapandey-ai/inventory_app.git
cd inventory_app
2. Install Dependencies
npm install
3. Setup Environment Variables
Create a .env file:

DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_secret_key"
4. Run Prisma Migration
npx prisma migrate dev
5. Start Development Server
npm run dev
Application runs at:

http://localhost:3000
API Endpoints
Authentication:

POST /api/auth/register

POST /api/auth/login

Products:

GET /api/products

POST /api/products

GET /api/products/[id]

PUT /api/products/[id]

DELETE /api/products/[id]

POST /api/products/update-stock

Categories:

GET /api/categories

POST /api/categories

Suppliers:

GET /api/suppliers

POST /api/suppliers

Bulk Upload:

POST /api/products/bulk

AI Reporting:

POST /api/ai/report

Security Implementation
JWT stored in HTTP-only cookies

Role validation inside dashboard layout

Server-side route protection

Input validation for product data

Foreign key relational integrity via Prisma

Future Improvements
Email notifications for low stock

Pagination and filtering

Export reports to PDF or Excel

Real-time stock updates

Advanced data visualization

Activity logs

Author
Shreya Pandey

GitHub:
https://github.com/shreyapandey-ai
