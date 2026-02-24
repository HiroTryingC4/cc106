# Smart Stay - Property Management System

A complete property management solution built with React, Node.js, and Express. Smart Stay enables hosts to manage their properties, guests to book accommodations, and admins to oversee the entire system.

## 🌟 Features

### For Guests
- Browse and search available properties
- Book accommodations with date selection
- Secure QR code payment system
- Upload checkout photos
- Leave reviews and ratings
- Manage bookings and profile

### For Hosts
- List and manage properties
- Approve/reject bookings
- View analytics and reports
- Financial tracking (revenue, expenses, deposits)
- Guest communication and management
- Chatbot customization

### For Admins
- System-wide oversight
- User management (create, edit, deactivate)
- Financial reports across all hosts
- Generate custom reports
- System settings and configuration
- Data backup and export

### Additional Features
- AI Chatbot assistant on all pages
- Role-based authentication (Admin, Host, Guest)
- Responsive design
- Real-time notifications
- Security deposit tracking
- Multi-role dashboards

---

## 🚀 Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Context API for state management

### Backend
- Node.js
- Express.js
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads

### Data Storage
- JSON files (PostgreSQL integration planned)

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Git

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd smart-stay
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

Start the backend server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

---

## 👥 Demo Credentials

### Admin Account
- Email: `admin@smartstay.com`
- Password: `password123`
- Access: `/admin/login`

### Host Account
- Email: `host1@smartstay.com`
- Password: `password123`
- Access: `/host/login`

### Guest Account
- Email: `guest1@example.com`
- Password: `password123`
- Access: `/guest/login`

---

## 📁 Project Structure

```
smart-stay/
├── backend/
│   ├── data/              # JSON data files
│   ├── middleware/        # Auth middleware
│   ├── routes/           # API routes
│   │   ├── admin/        # Admin routes
│   │   ├── host/         # Host routes
│   │   └── guest/        # Guest routes
│   ├── uploads/          # Uploaded files
│   ├── server.js         # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/           # Static files
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # Context providers
│   │   ├── hooks/        # Custom hooks
│   │   ├── pages/        # Page components
│   │   │   ├── Admin/    # Admin pages
│   │   │   ├── Host/     # Host pages
│   │   │   ├── Guest/    # Guest pages
│   │   │   ├── Auth/     # Authentication pages
│   │   │   └── Public/   # Public pages
│   │   ├── App.js        # Main app component
│   │   └── index.js      # Entry point
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Guest Routes
- `GET /api/guest/bookings` - Get guest bookings
- `POST /api/guest/bookings` - Create booking
- `POST /api/guest/payments/create` - Create payment
- `POST /api/guest/checkout/:bookingId/photos` - Upload checkout photos
- `POST /api/guest/reviews` - Submit review

### Host Routes
- `GET /api/host/units` - Get host units
- `POST /api/host/units` - Create unit
- `GET /api/host/bookings` - Get host bookings
- `PUT /api/host/bookings/:id/approve` - Approve booking
- `GET /api/host/analytics/guests` - Get guest analytics
- `GET /api/host/financial/summary` - Get financial summary
- `GET /api/host/guests` - Get guest list

### Admin Routes
- `GET /api/admin/users` - Get all users
- `POST /api/admin/users` - Create user
- `GET /api/admin/financial` - System-wide financial data
- `POST /api/admin/reports/generate` - Generate report
- `GET /api/admin/system/stats` - System statistics

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/faqs` - Get FAQs

---

## 🎨 Key Features Explained

### 1. Role-Based Access Control
- Three user roles: Admin, Host, Guest
- Protected routes with role verification
- Separate dashboards for each role

### 2. Booking System
- Date range selection
- Price calculation
- Security deposit tracking
- Booking status management (pending, confirmed, completed)

### 3. Payment System
- QR code generation for payments
- Payment status tracking
- Financial reports and analytics

### 4. AI Chatbot
- Keyword-based responses
- FAQ management
- Conversation history
- Available on all pages

### 5. Analytics & Reports
- Guest statistics
- Booking trends
- Revenue tracking
- Custom report generation

---

## 🧪 Testing

### Test User Flows

#### Guest Flow
1. Register/Login as guest
2. Browse available units
3. Create a booking
4. Make payment via QR code
5. Upload checkout photos
6. Leave a review

#### Host Flow
1. Login as host
2. Add new property
3. View and manage bookings
4. Approve/reject bookings
5. View analytics and financial reports
6. Manage chatbot responses

#### Admin Flow
1. Login as admin
2. View system statistics
3. Manage users
4. Generate reports
5. Configure system settings
6. Download data backup

---

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify `.env` file exists with correct values
- Run `npm install` to ensure dependencies are installed

### Frontend won't start
- Check if port 3000 is available
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear browser cache

### Authentication issues
- Verify JWT_SECRET is set in backend `.env`
- Check if backend server is running
- Clear browser localStorage

### File upload issues
- Ensure `uploads/` directory exists in backend
- Check file size limits in multer configuration
- Verify file permissions

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

---

## 🚧 Future Enhancements

- [ ] PostgreSQL database integration
- [ ] Real-time notifications with WebSockets
- [ ] Email notifications
- [ ] Advanced AI chatbot with NLP
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration
- [ ] Calendar synchronization
- [ ] Advanced search filters
- [ ] Map integration

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Development

### Running in Development Mode

Backend:
```bash
cd backend
npm run dev  # If nodemon is configured
# or
npm start
```

Frontend:
```bash
cd frontend
npm start
```

### Building for Production

Frontend:
```bash
cd frontend
npm run build
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📞 Support

For support, email support@smartstay.com or open an issue in the repository.

---

## 🎯 Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Completion**: 80.3% (188/234 tasks)

### Completed Phases
- ✅ Phase 1: Foundation & Authentication
- ✅ Phase 2: Core Pages & Navigation
- ✅ Phase 3: Guest Features
- ✅ Phase 4: Host Dashboard & Management
- ✅ Phase 5: Admin Panel
- ✅ Phase 6: AI Chatbot
- 🔄 Phase 7: Polish & Refinement (In Progress)

---

Made with ❤️ by the Smart Stay Team
