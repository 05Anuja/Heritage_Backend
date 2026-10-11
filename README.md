# Heritage Bharat — Backend API

Backend RESTful API service for **Heritage Bharat**, an ethnic Indian fashion catalogue showcasing traditional handcrafted collections such as Cotton Chaniya, Lehenga Choli, Mashru, Mulmul Cotton, Roman Silk, Traditional Skirts, Kutchi work, and Mirror Work designs.

Built with Node.js, Express, MongoDB (Mongoose), and Cloudinary, this backend provides product catalogue management, image uploads, customer enquiry capture, and role-based admin authentication.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Installation and Setup](#-installation-and-setup)
- [Admin Account Seeding](#-admin-account-seeding)
- [Running the Application](#-running-the-application)
- [Database Configuration & Models](#-database-configuration--models)
- [API Documentation](#-api-documentation)
  - [Health Check](#health-check)
  - [Authentication Routes](#authentication-routes)
  - [Product Routes](#product-routes)
  - [Enquiry Routes](#enquiry-routes)
- [Application Workflow](#-application-workflow)
- [Deployment Guidelines](#-deployment-guidelines)
- [Future Improvements & Observations](#-future-improvements--observations)

---

## 📌 Project Overview

**Heritage Bharat** is designed to present traditional Indian ethnic wear collections to customers and wholesale buyers. The backend acts as the core API provider:

- Serves public catalogue products filtered by category, identifier, and active status.
- Accepts and stores customer inquiries and lead messages.
- Provides a protected administration layer for catalogue curators to upload product details and images directly to Cloudinary.
- Enforces token-based security ensuring only verified administrators can modify catalogue items.

---

## ✨ Key Features

- **Product Catalogue Management**:
  - Full CRUD functionality for products (`name`, `category`, `description`, `material`, `flair`, `blouse`, `dupatta`, `features`, `images`, `featured`, `active`).
  - Filter active products by category or retrieve individual items by MongoDB ID.
  - Support for bulk deletion and soft/hard updates.
- **Direct Cloudinary Media Upload**:
  - Multipart image processing with Multer (`memoryStorage`).
  - Direct upload streaming into Cloudinary (`heritage_bharat/products` folder).
  - Support for uploading up to 5 images per product (5MB max per image).
  - Image replacement during product updates.
- **Customer Enquiry Management**:
  - Public lead submission endpoint validating name, email, 10-digit phone number, and message.
  - Admin-only endpoint to view customer enquiries ordered chronologically (newest first).
- **Secure Admin Authentication & Authorization**:
  - Email and bcrypt-hashed password authentication.
  - JWT token generation (1-day validity) transmitted via `Authorization: Bearer <token>` headers.
  - Role-based middleware verifying admin role and checking database existence.
- **Admin Seeding Utility**:
  - Standalone provisioning script to seed the initial administrator credentials from environment variables.
- **CORS Protection**:
  - Dynamic CORS whitelist supporting public client and admin dashboard URLs.
- **Robust Process Handling**:
  - Graceful shutdown on `unhandledRejection` and `uncaughtException` events.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | Node.js (ES Modules, `"type": "module"`) | JavaScript runtime environment |
| **Framework** | Express.js (`v5.2.1`) | Web framework for routing and middleware |
| **Database** | MongoDB | NoSQL document database |
| **ODM** | Mongoose (`v9.10.2`) | Object data modeling library for MongoDB |
| **Media Storage** | Cloudinary (`v2.11.0`) | Cloud asset management and image hosting |
| **File Handling** | Multer (`v2.4.0`) | Multipart/form-data handler with memory storage |
| **Security & Auth** | JSON Web Token (`jsonwebtoken` `v9.0.3`) | Stateless token-based session handling |
| **Password Hashing**| bcryptjs (`v3.0.3`) | Password salt hashing and verification |
| **CORS** | cors (`v2.8.6`) | Configured origin whitelist cross-origin resource sharing |
| **Environment** | dotenv (`v18.0.4`) | Environment variable loader |
| **Dev Tools** | nodemon (`v1.14.10`) | Development auto-reload server |

---

## 📁 Project Structure

```text
Heritage_Backend/
├── .env                     # Local environment variables (do not commit)
├── .gitignore               # Git ignored directories and files
├── package.json             # Project metadata, scripts, and dependencies
├── package-lock.json        # Dependency lockfile
├── README.md                # Project documentation
└── src/
    ├── app.js               # Express app configuration, CORS, and route mounting
    ├── server.js            # Server entry point, DB initialization, and process listeners
    ├── config/
    │   ├── cloudinary.js    # Cloudinary SDK configuration
    │   └── db.js            # Mongoose MongoDB connection handler
    ├── controllers/
    │   ├── auth.controller.js      # Admin login and logout handlers
    │   ├── enquiry.controller.js   # Customer enquiry creation and listing
    │   └── product.controller.js   # Product CRUD and Cloudinary upload logic
    ├── middleware/
    │   ├── adminOnly.js            # Role guard verifying admin access
    │   ├── authMiddleware.js       # JWT bearer token verification & admin validation
    │   └── uploadMiddleware.js     # Multer memory storage and image filter configuration
    ├── models/
    │   ├── Admin.js         # Mongoose schema for administrators
    │   ├── Enquiry.js       # Mongoose schema for customer inquiries
    │   └── Product.js       # Mongoose schema for catalogue products
    ├── routes/
    │   ├── auth.routes.js   # Routes for /api/auth
    │   ├── enquiry.route.js # Routes for /api/enquiries
    │   └── product.route.js # Routes for /api/products
    ├── scripts/
    │   └── createAdmin.js   # One-time script to seed initial admin user
    └── utils/
        └── generateToken.js # Helper function to sign JWT tokens (1-day expiry)
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root directory. Below are the required configuration variables:

```env
# Server Configuration
PORT=5000

# Database Configuration
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Credentials (Product Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Seeding Credentials (for src/scripts/createAdmin.js)
Admin_Name=Admin User
Admin_Email=admin@example.com
Admin_Password=YourSecurePassword123  # Minimum 10 characters

# Client Application Origins (CORS Whitelist)
PUBLIC_FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:5174
```

### Environment Variable Reference

| Variable | Required | Description |
| :--- | :---: | :--- |
| `PORT` | Optional | Port for the Express HTTP server (defaults to `5000`). |
| `MONGO_URI` | **Yes** | MongoDB connection string. |
| `JWT_SECRET` | **Yes** | Secret key for signing and verifying JWT tokens. |
| `CLOUDINARY_CLOUD_NAME` | **Yes** | Cloudinary cloud identifier. |
| `CLOUDINARY_API_KEY` | **Yes** | Cloudinary API access key. |
| `CLOUDINARY_API_SECRET` | **Yes** | Cloudinary API secret. |
| `Admin_Name` | For Seed | Name of the initial admin user for `createAdmin.js`. |
| `Admin_Email` | For Seed | Unique email of the initial admin user. |
| `Admin_Password` | For Seed | Password for the initial admin (must be at least 10 chars). |
| `PUBLIC_FRONTEND_URL` | Recommended | URL of the public customer frontend (whitelisted in CORS). |
| `ADMIN_FRONTEND_URL` | Recommended | URL of the admin panel frontend (whitelisted in CORS). |

---

## 🚀 Installation and Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas cluster)
- [Cloudinary](https://cloudinary.com/) account for image uploads

### Step-by-Step Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/05Anuja/Heritage_Backend.git
   cd Heritage_Backend
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory and add the values described in the [Environment Variables](#-environment-variables) section.

---

## 👤 Admin Account Seeding

To access admin-protected routes (`/add-product`, `/update-product`, `/delete-product`, `/delete-all`, `/api/enquiries`), you need an admin account in MongoDB.

Make sure `Admin_Name`, `Admin_Email`, and `Admin_Password` are defined in your `.env` file, then run:

```bash
node src/scripts/createAdmin.js
```

This script:
- Verifies database connectivity.
- Confirms the password is at least 10 characters.
- Hashes the password with bcrypt (10 salt rounds).
- Creates the admin document with role `"admin"` if the email does not already exist.

---

## 💻 Running the Application

### Development Mode (with Nodemon)
Restarts the server automatically upon file changes:
```bash
npm run dev
```

### Production Mode
Runs the application with Node:
```bash
npm start
```

Once started, the server will output:
```text
MongoDB Connected: <cluster-host>
Server is running on port 5000
```

---

## 🗄️ Database Configuration & Models

The backend connects to MongoDB using Mongoose in [src/config/db.js](file:///c:/Users/HP/Desktop/Heritage_Backend/src/config/db.js).

### Data Models

#### 1. Admin Model (`src/models/Admin.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, Trimmed | Full name of the administrator |
| `email` | String | Required, Unique, Lowercase, Trimmed | Login email |
| `password` | String | Required, `select: false` | Hashed password (omitted from queries by default) |
| `role` | String | Enum: `["admin"]`, Default: `"admin"` | User authorization role |
| `timestamps`| Date | Automatic (`createdAt`, `updatedAt`) | Creation and update timestamps |

#### 2. Product Model (`src/models/Product.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, Trimmed | Product title/name |
| `category` | String | Required, Trimmed | Collection/category name |
| `description` | String | Default: `""` | Detailed description of the design |
| `material` | String | Default: `""` | Fabric/material details (e.g., Mashru Silk, Cotton) |
| `flair` | String | Default: `""` | Flair measurement (e.g., 4.5 meters) |
| `blouse` | String | Default: `""` | Blouse description/material |
| `dupatta` | String | Default: `""` | Dupatta description/material |
| `features` | [String]| Default: `[]` | Array of highlighted features/highlights |
| `images` | [String]| Default: `[]` | Array of secure image URLs hosted on Cloudinary |
| `featured` | Boolean | Default: `false` | Whether product is highlighted as featured |
| `active` | Boolean | Default: `true` | Visibility status for public catalogue queries |
| `timestamps`| Date | Automatic (`createdAt`, `updatedAt`) | Creation and update timestamps |

#### 3. Enquiry Model (`src/models/Enquiry.js`)
| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `name` | String | Required, Trimmed | Customer's full name |
| `email` | String | Required, Lowercase, Trimmed | Customer's contact email |
| `phoneNo` | String | Required, Trimmed, Regex: `/^[0-9]{10}$/` | 10-digit contact number |
| `message` | String | Required, Trimmed | Customer message or catalogue enquiry |
| `timestamps`| Date | Automatic (`createdAt`, `updatedAt`) | Creation and update timestamps |

---

## 📡 API Documentation

Base URL: `http://localhost:5000`

### Health Check

#### `GET /api/health`
- **Access**: Public
- **Description**: Returns server operational status.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Heritage Backend is running"
  }
  ```

---

### Authentication Routes

Base path: `/api/auth`

#### `POST /api/auth/login`
- **Access**: Public
- **Description**: Authenticates an administrator and returns a JWT token.
- **Request Body (`application/json`)**:
  ```json
  {
    "email": "admin@example.com",
    "password": "YourSecurePassword123"
  }
  ```
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Admin Login Successfully",
      "token": "<jwt_token_string>",
      "admin": {
        "id": "67098234...",
        "name": "Heritage Admin",
        "email": "admin@example.com",
        "role": "admin"
      }
    }
    ```
  - `400 Bad Request`: Email or password missing.
  - `401 Unauthorized`: Invalid email or password.
  - `500 Internal Server Error`: Server failure.

#### `POST /api/auth/logout`
- **Access**: Protected (`authMiddleware`)
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Confirms session termination for the authenticated admin.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Admin Logout Successfully"
  }
  ```

---

### Product Routes

Base path: `/api/products`

#### `GET /api/products`
- **Access**: Public
- **Description**: Fetches all active products (`active: true`) sorted newest first.
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Products fetched successfully",
    "count": 1,
    "products": [
      {
        "_id": "67098234...",
        "name": "Kutchi Embroidered Chaniya Choli",
        "category": "Chaniya Choli",
        "description": "Authentic Kutchi handwork with mirror detailing",
        "material": "Pure Mulmul Cotton",
        "flair": "4.5 Mtr",
        "blouse": "Unstitched Cotton Blouse",
        "dupatta": "Bandhani Dupatta",
        "features": ["Handcrafted", "Mirror Work"],
        "images": ["https://res.cloudinary.com/.../image.jpg"],
        "featured": true,
        "active": true,
        "createdAt": "2026-10-11T12:00:00.000Z",
        "updatedAt": "2026-10-11T12:00:00.000Z"
      }
    ]
  }
  ```

#### `GET /api/products/category/:category`
- **Access**: Public
- **Description**: Fetches active products matching the specified category name.
- **URL Parameter**: `:category` (e.g., `Lehenga Choli`, `Cotton Chaniya`)
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "message": "Products fetched successfully",
    "count": 1,
    "product": [ /* array of matching product objects */ ]
  }
  ```

#### `GET /api/products/:id`
- **Access**: Public
- **Description**: Fetches an active product by its MongoDB ID.
- **URL Parameter**: `:id` (MongoDB ObjectId)
- **Responses**:
  - `200 OK`: `{ "success": true, "message": "Product fetched successfully", "product": { ... } }`
  - `404 Not Found`: `{ "success": false, "message": "Product not found" }`

#### `POST /api/products/add-product`
- **Access**: Protected (`authMiddleware`, `adminOnly`)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data`
- **Form Data Fields**:
  - `name` *(text, required)*: Product name
  - `category` *(text, required)*: Product category
  - `description` *(text, optional)*: Product description
  - `material` *(text, optional)*: Fabric/material
  - `flair` *(text, optional)*: Flair specification
  - `blouse` *(text, optional)*: Blouse specification
  - `dupatta` *(text, optional)*: Dupatta specification
  - `features` *(text or array, optional)*: One or multiple feature strings
  - `featured` *(text: "true" \| "false", optional, default: false)*
  - `active` *(text: "true" \| "false", optional, default: true)*
  - `images` *(files, required)*: Up to 5 image files (JPEG, PNG, WEBP, etc., max 5MB each)
- **Responses**:
  - `201 Created`: `{ "message": "Product created successfully", "product": { ... } }`
  - `400 Bad Request`: Missing name/category or image files not provided.
  - `401 / 403`: Unauthorized or non-admin access.
  - `500 Internal Server Error`: Cloudinary upload or database error.

#### `PATCH /api/products/update-product/:id`
- **Access**: Protected (`authMiddleware`, `adminOnly`)
- **Headers**:
  - `Authorization: Bearer <token>`
  - `Content-Type: multipart/form-data` (or `application/json` if not uploading new images)
- **URL Parameter**: `:id` (MongoDB ObjectId)
- **Form Data / Body Fields**: Any product fields to update. If new files are uploaded under `images`, they replace existing product images in Cloudinary storage.
- **Responses**:
  - `200 OK`: `{ "message": "Product updated successfully", "product": { ... } }`
  - `404 Not Found`: `{ "message": "Product not found" }`

#### `DELETE /api/products/delete-product/:id`
- **Access**: Protected (`authMiddleware`, `adminOnly`)
- **Headers**: `Authorization: Bearer <token>`
- **URL Parameter**: `:id` (MongoDB ObjectId)
- **Responses**:
  - `200 OK`: `{ "message": "Product deleted successfully" }`
  - `404 Not Found`: `{ "message": "Product Not Found" }`

#### `DELETE /api/products/delete-all`
- **Access**: Protected (`authMiddleware`, `adminOnly`)
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Deletes all products from the database collection.
- **Responses**:
  - `200 OK`: `{ "message": "Products deleted successfully" }`
  - `404 Not Found`: `{ "message": "Product Not Found" }`

---

### Enquiry Routes

Base path: `/api/enquiries`

#### `POST /api/enquiries`
- **Access**: Public
- **Description**: Submits a customer enquiry or catalogue interest request.
- **Request Body (`application/json`)**:
  ```json
  {
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "phoneNo": "9876543210",
    "message": "Interested in wholesale pricing for Kutchi Chaniya Choli catalogue."
  }
  ```
- **Validation Rules**:
  - `phoneNo` must be exactly 10 digits (`/^[0-9]{10}$/`).
  - All fields are required.
- **Responses**:
  - `201 Created`:
    ```json
    {
      "success": true,
      "message": "Enquiry created successfully",
      "enquiry": {
        "_id": "67098234...",
        "name": "Priya Sharma",
        "email": "priya@example.com",
        "phoneNo": "9876543210",
        "message": "Interested in wholesale pricing for Kutchi Chaniya Choli catalogue.",
        "createdAt": "2026-10-11T12:00:00.000Z",
        "updatedAt": "2026-10-11T12:00:00.000Z"
      }
    }
    ```
  - `400 Bad Request`: Missing fields or invalid 10-digit phone number.
  - `500 Internal Server Error`: Database insertion error.

#### `GET /api/enquiries`
- **Access**: Protected (`authMiddleware`, `adminOnly`)
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Retrieves all received enquiries, sorted by newest first (`createdAt: -1`).
- **Responses**:
  - `200 OK`:
    ```json
    {
      "success": true,
      "message": "Enquiry fetched successfully",
      "count": 1,
      "enquiry": [ /* array of enquiry objects */ ]
    }
    ```
  - `401 / 403`: Unauthorized or non-admin access.

---

## 🔄 Application Workflow

```mermaid
flowchart TD
    subgraph Clients
        Customer[Public Customer / Storefront]
        AdminClient[Admin Portal Dashboard]
    end

    subgraph Heritage_Backend
        App[Express Server (src/app.js)]
        CORS[CORS Whitelist Middleware]
        UploadMid[Multer Memory Storage]
        AuthMid[JWT authMiddleware & adminOnly]
        
        ProdCtrl[Product Controller]
        EnqCtrl[Enquiry Controller]
        AuthCtrl[Auth Controller]
    end

    subgraph External_Services
        MongoDB[(MongoDB Database)]
        Cloudinary[(Cloudinary Media Storage)]
    end

    Customer -->|GET /api/products| CORS --> App --> ProdCtrl --> MongoDB
    Customer -->|POST /api/enquiries| CORS --> App --> EnqCtrl --> MongoDB
    
    AdminClient -->|POST /api/auth/login| CORS --> App --> AuthCtrl --> MongoDB
    AdminClient -->|POST /api/products/add-product| CORS --> App --> AuthMid --> UploadMid --> ProdCtrl
    
    ProdCtrl -->|Upload image buffer stream| Cloudinary
    ProdCtrl -->|Store product with image URLs| MongoDB
    AdminClient -->|GET /api/enquiries| CORS --> App --> AuthMid --> EnqCtrl --> MongoDB
```

1. **Client Request**: Clients send requests to Express endpoints.
2. **CORS & Parsing**: Whitelisted frontend origins are verified, and incoming JSON/URL-encoded payloads are parsed.
3. **Authentication Check**: Protected administrative endpoints pass through `authMiddleware` to verify the JWT Bearer token and check the active Admin record in MongoDB.
4. **File Handling**: If product images are present, `Multer` buffers the files into memory and streams them to Cloudinary (`heritage_bharat/products`), receiving back secure image URLs.
5. **Persistence**: Data is created, retrieved, or updated in MongoDB via Mongoose models.

---

## 🚢 Deployment Guidelines

When deploying this backend service to cloud providers (e.g., Render, Railway, AWS EC2, DigitalOcean, or Heroku):

1. **Environment Variables**: Configure all required environment variables listed in the [Environment Variables](#-environment-variables) section on your hosting dashboard.
2. **Build and Start Commands**:
   - Install command: `npm install`
   - Start command: `npm start`
3. **CORS Configuration**: Ensure `PUBLIC_FRONTEND_URL` and `ADMIN_FRONTEND_URL` match your deployed frontend domain URLs (e.g., `https://heritagebharat.com` and `https://admin.heritagebharat.com`).
4. **Database Access**: Ensure your MongoDB Atlas Network Access whitelist includes your hosting provider's IP range or `0.0.0.0/0` with proper authentication credentials.

---

## 🔮 Future Improvements & Observations

Based on code analysis of the current implementation:

1. **Rate Limiting Middleware**: `express-rate-limit` is listed in `package.json` dependencies but is not currently mounted in `src/app.js`. Enabling it on sensitive endpoints (such as `/api/auth/login` and `/api/enquiries`) will help protect against brute-force attacks and spam.
2. **Cookie Parser**: `cookie-parser` is installed in `package.json`. While authentication currently relies on Bearer tokens in headers, supporting `httpOnly` secure cookies can be enabled if preferred for web browsers.
3. **Catalogue Lead Model**: In the initial design, a separate catalogue lead model was planned. Currently, inquiries are consolidated into `src/models/Enquiry.js`. A dedicated `catalogueDownload` lead flow can be added if needed.
4. **Cloudinary Asset Deletion**: When products are deleted or updated with new images, implementing a Cloudinary deletion call (`cloudinary.uploader.destroy`) will ensure unused images are cleaned up from cloud storage.
5. **Pagination**: Adding `page` and `limit` query parameters on `GET /api/products` and `GET /api/enquiries` will improve performance as catalogue entries grow.