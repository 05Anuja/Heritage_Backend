# Heritage Bharat Backend

Backend API for the **Heritage Bharat** catalogue website.

This project is built using the **MERN Stack** and is designed to manage the Heritage Bharat fashion catalogue, products, customer enquiries, catalogue downloads, images, and admin operations.

The current Heritage Bharat catalogue contains **22 pages** featuring traditional fashion collections such as Cotton Chaniya, Lehenga Choli, Mashru, Mulmul Cotton, Roman Silk, Traditional Skirts, Kutchi work, and Mirror Work designs.

---

## 📌 Project Overview

Heritage Bharat is a traditional Indian fashion catalogue website focused on showcasing ethnic wear and handcrafted designs.

The backend will provide APIs for:

- Product management
- Product categories
- Product details
- Product images
- Customer enquiries
- Catalogue download leads
- Admin authentication
- Admin product management

The frontend will be developed separately using:

- React.js
- Vite
- Tailwind CSS

---

# 🛠️ Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- dotenv

### Planned Technologies

- Cloudinary — Image storage
- JWT — Admin authentication
- bcrypt — Password hashing

---

# 📁 Backend Folder Structure

```text
Heritage_Backend/
│
├── node_modules/
│
├── src/
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── productController.js
│   │   ├── enquiryController.js
│   │   ├── catalogueController.js
│   │   └── authController.js
│   │
│   ├── models/
│   │   ├── Product.js
│   │   ├── Enquiry.js
│   │   ├── CatalogueLead.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── productRoutes.js
│   │   ├── enquiryRoutes.js
│   │   ├── catalogueRoutes.js
│   │   └── authRoutes.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md