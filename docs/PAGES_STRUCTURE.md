# Smart Stay - Complete Pages Structure

## Public / Guest-Facing Pages

### 1. Landing Page (`/`)
- Hero banner with condo images, "Book Now" CTA
- Featured units, amenities, testimonials
- AI Chatbot popup
- Navigation: Home, Units, About, Contact, Login/Register

### 2. Units Listing Page (`/units`)
- Unit cards with image, name, description, price, rating
- Filter by dates, guests, unit type
- "Book Now" button with AI guidance

### 3. Unit Details Page (`/units/:id`)
- Gallery of unit images
- Description, amenities, house rules
- Calendar availability
- Pricing & QR payment options

### 4. Booking & Payment Page (`/booking/:unitId`)
- Booking summary (dates, unit, price)
- Payment options (QR, online)
- Security deposit info
- AI chatbot assistance

### 5. Guest Dashboard / Profile (`/guest/dashboard`)
- Upcoming bookings with status
- Booking history
- Security deposit info
- Personal info (editable)
- Checkout photo submission

### 6. Feedback / Review Page (`/guest/review/:bookingId`)
- Star rating & text review
- Upload photos (optional)

### 7. AI Chatbot Widget (Global Component)
- Assistance with availability, payment, check-in info
- Pre-trained AI responses

---

## Host Pages

### 8. Host Dashboard (`/host/dashboard`)
- Guest analytics (total, monthly, new/returning)
- Booking trends & occupancy per unit
- Revenue vs expenses (Kinita vs Gastos)
- Security deposit tracking
- Notifications & AI insights

### 9. Unit Management Page (`/host/units`)
- Add/edit/remove units
- Upload images, amenities, descriptions
- Record unit conditions before/after stay
- Maintenance request tracking

### 10. Booking Management Page (`/host/bookings`)
- Approve/reject/modify bookings
- Calendar view with real-time availability
- Guest details & contact info
- Payment & security deposit status

### 11. Financial Analytics / Reports Page (`/host/analytics`)
- Revenue summary (total, monthly)
- Expenses & net profit
- Exportable reports (PDF, CSV)
- Graphs & charts for trends

### 12. AI & Chatbot Management Page (`/host/ai-chatbot`)
- Pre-trained responses management
- Monitor guest-chatbot interactions
- AI improvement suggestions

---

## Admin Pages

### 13. Admin Dashboard (`/admin/dashboard`)
- Total hosts & guests
- Booking trends across all units
- Financial overviews
- Alerts on suspicious activities

### 14. User Management Page (`/admin/users`)
- Create/edit/deactivate accounts
- Assign roles & permissions
- Monitor user activity logs

### 15. System / Database Management Page (`/admin/system`)
- Backup & recovery options
- Database performance stats
- Role/permission management

---

## Authentication Pages

### 16. Login Page (`/login`)
- Email/password login
- Role-based redirect (Admin/Host/Guest)
- "Forgot Password" link

### 17. Register Page (`/register`)
- Guest registration form
- Host registration (with approval)
- Terms & conditions

---

## Total Pages: 17 Main Pages + Shared Components
