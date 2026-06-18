# 🛒 NextonicStore - E-commerce Platform

A modern, full-stack e-commerce application built with React, Node.js, and PostgreSQL. Features a beautiful UI with dark mode support, user authentication, shopping cart functionality, and admin product management.

![NextonicStore](https://img.shields.io/badge/NextonicStore-E--commerce-blue)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-316192)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-DaisyUI-38B2AC)

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX** - Beautiful, responsive design with TailwindCSS and DaisyUI
- **Dark Mode Support** - Toggle between light and dark themes
- **Product Catalog** - Browse and view product details
- **Shopping Cart** - Add, remove, and manage cart items with persistent storage
- **User Authentication** - Secure login/signup with Clerk
- **Admin Panel** - Role-based access for product management
- **Real-time Updates** - Live product updates and notifications
- **Mobile Responsive** - Optimized for all device sizes

### 🔧 Backend Features
- **RESTful API** - Clean, well-structured API endpoints
- **PostgreSQL Database** - Reliable data storage with Neon
- **CRUD Operations** - Full product management capabilities
- **Security** - Helmet.js for security headers and Arcjet for rate limiting
- **Error Handling** - Comprehensive error management
- **CORS Support** - Cross-origin resource sharing enabled

### Frontend

* **React 19.1.0** - Modern UI library
* **Vite** - Fast build tool and dev server
* **TailwindCSS** - Utility-first CSS framework
* **DaisyUI** - Component library for TailwindCSS
* **React Router DOM** - Client-side routing
* **Zustand** - State management
* **Clerk** - Authentication and user management
* **Lucide React** - Beautiful icons
* **React Hot Toast** - Toast notifications

### Backend

* **Node.js** - JavaScript runtime
* **Express.js** - Web framework
* **PostgreSQL** - Database (hosted on Neon)
* **Neon Serverless** - Database connection
* **Stripe** - Secure payment processing
* **Helmet.js** - Security middleware
* **Arcjet** - Rate limiting and security
* **CORS** - Cross-origin resource sharing
* **Morgan** - HTTP request logger

## 📁 Project Structure

```
STORE/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── productController.js # Product CRUD operations
│   │   └── loginusers.js       # User authentication
│   ├── lib/
│   │   └── arcjet.js          # Security configuration
│   ├── routes/
│   │   ├── productRoutes.js   # Product API routes
│   │   └── userRoutes.js      # User API routes
│   └── server.js              # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddProductModal.jsx    # Product creation modal
│   │   │   ├── Navbar.jsx             # Navigation component
│   │   │   ├── ProductCard.jsx        # Product display card
│   │   │   ├── ProtectedRoute.jsx     # Route protection
│   │   │   └── ThemeSelector.jsx      # Theme toggle
│   │   ├── pages/
│   │   │   ├── CartPage.jsx           # Shopping cart page
│   │   │   ├── Hero.jsx               # Landing page hero
│   │   │   ├── HomePage.jsx           # Main product listing
│   │   │   └── ProductPage.jsx        # Individual product view
│   │   ├── store/
│   │   │   ├── useAddtoCart.js        # Cart state management
│   │   │   ├── useLogin.js            # Authentication state
│   │   │   ├── useProduct.js          # Product state management
│   │   │   └── useThemeStore.js       # Theme state management
│   │   ├── config/
│   │   │   └── auth0.js               # Auth0 configuration
│   │   └── App.jsx                    # Main app component
│   └── dist/                          # Production build
└── package.json                       # Root package configuration
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database (Neon recommended)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd STORE
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
npm install --prefix frontend
```

### 3. Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
PGHOST=your-neon-host
PGUSER=your-username
PGPASSWORD=your-password
PGDATABASE=your-database-name
PGPORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
Create the products table in your PostgreSQL database:

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Run the Application

#### Development Mode
```bash
# Start backend server
npm run dev

# In another terminal, start frontend
cd frontend
npm run dev
```

#### Production Mode
```bash
# Build and start
npm run build
npm start
```

## 🎯 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Authentication
- Integrated with Clerk for user authentication
- Role-based access control (Admin/User)


## 🔐 Authentication & Authorization

The application uses **Clerk** for authentication and user management.
Features:
* Secure user registration and login
* Protected routes
* Session management
* Role-based access control
* Admin users can manage products
* Regular users can browse and purchase products

## 🛒 Shopping & Payments

* **Shopping Cart** - Add, remove, and manage cart items
* **Persistent Cart Storage** - Cart data persists across sessions
* **Stripe Checkout Integration** - Secure online payments
* **Success & Cancel Payment Flow**
* **Real-time Total Calculation**

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Theme** - Toggle between themes
- **Modern Components** - Built with DaisyUI components
- **Smooth Animations** - Enhanced user experience
- **Toast Notifications** - Real-time feedback
- **Loading States** - Better user feedback

## 🛒 Shopping Cart Features

- **Persistent Storage** - Cart persists across browser sessions
- **Quantity Management** - Add, remove, and update quantities
- **Real-time Updates** - Instant cart updates
- **Total Calculation** - Automatic price calculations
- **Cart Badge** - Visual cart item count

## 🚀 Deployment

### Frontend (Vercel)

* Deployed on Vercel
* React Router SPA rewrites configured
* Clerk authentication enabled

### Backend (Render)

* Express.js API hosted on Render
* PostgreSQL database hosted on Neon
* Stripe Checkout integration configured

### Live Links

* **Frontend:** https://your-vercel-app.vercel.app
* **Backend API:** https://productstore-1hrq.onrender.com


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 👨‍💻 Author

Created with ❤️ by Shubham Raj

## 🔗 Links

- [Live Demo](https://productstore-2-17ip.onrender.com) - Frontend Application
- [Backend API](https://productstore-1hrq.onrender.com) - REST API Server
- [API Health Check](https://productstore-1hrq.onrender.com) - Service Status

---

**Note**: This is a full-stack e-commerce application with modern features and best practices. Make sure to configure your environment variables and database before running the application.
