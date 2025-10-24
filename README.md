# College Resource Booking System

A full-stack web application for managing and booking college resources (such as rooms, labs, and equipment). Built with a modern React frontend and a robust Node.js/Express backend with MongoDB.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Resource Management**: Browse and book available college resources
- **Booking System**: Easy-to-use interface for scheduling resource reservations
- **Admin Dashboard**: Comprehensive admin panel for managing resources, users, and bookings
- **Responsive Design**: Modern, mobile-friendly UI with dark mode support
- **Real-time Notifications**: Toast notifications for user feedback
- **Auto-seeding**: Automatic population of mock data on first run

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notification system
- **React Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

## 🔧 Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd c:/Users/shubh/Downloads/room_allocation
   ```

2. **Install backend dependencies**:
   ```bash
   cd shubh_Backend
   npm install
   ```

3. **Install frontend dependencies**:
   ```bash
   cd ../shubh_Frontend
   npm install
   ```

4. **Set up environment variables**:
   - Create a `.env` file in the `shubh_Backend` directory
   - Add the following variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/college-resource-booking
     JWT_SECRET=your-super-secret-jwt-key-here
     ```

## 🚀 Running the Application

1. **Start the backend server**:
   ```bash
   cd shubh_Backend
   npm run dev
   ```
   The backend will start on `http://localhost:5000` and automatically seed mock data on first run.

2. **Start the frontend development server**:
   ```bash
   cd ../shubh_Frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173` (or the port shown in the terminal).

3. **Access the application**:
   - Open your browser and navigate to the frontend URL
   - Register a new account or use the seeded admin account:
     - Email: `admin@college.edu`
     - Password: `admin123`

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Resources
- `GET /api/resources` - Get all resources
- `GET /api/resources/:id` - Get resource by ID
- `POST /api/resources` - Create new resource (Admin only)
- `PUT /api/resources/:id` - Update resource (Admin only)
- `DELETE /api/resources/:id` - Delete resource (Admin only)

### Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Admin
- `GET /api/admin/users` - Get all users (Admin only)
- `GET /api/admin/bookings` - Get all bookings (Admin only)
- `POST /api/admin/seed` - Seed mock data (Admin only)

## 🏗 Project Structure

```
room_allocation/
├── shubh_Backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── bookingController.js
│   │   └── resourceController.js
│   ├── middleware/
│   │   ├── adminMiddleware.js
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Booking.js
│   │   ├── Resource.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── resourceRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── shubh_Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js
│   │   ├── components/
│   │   │   ├── BookingModal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── ResourceCard.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ManageResources.jsx
│   │   │   ├── MyBookings.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── postcss.config.js
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. Copyright (c) 2025 Shubh Shukla. 

GitHub: [https://github.com/shubh-aarambh](https://github.com/shubh-aarambh)

## 📞 Support

If you have any questions or need help, please open an issue in the repository or contact Shubh Shukla at shubhshukla1006@gmail.com.

---

**Happy booking! 🎓**
