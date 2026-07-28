# 📚 Fixora API Documentation

**Base URL**

```http
https://fixora-backend-seven.vercel.app
```

---

# Authentication

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/users/register` | POST | Public | Register a new user. Request body must include the user's role. |
| `/auth/login` | POST | Public | Login and receive access & refresh tokens. |
| `/auth/me` | GET | Authenticated | Get the currently logged-in user's profile. |
| `/auth/me/update` | PUT | Authenticated | Update the currently logged-in user's information. |
| `/auth/refresh-token` | POST | Authenticated | Generate a new access token using the refresh token. |

---

# Admin APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/users/admin/users` | GET | Admin | Retrieve all users. |
| `/users/admin/users/:userId` | PATCH | Admin | Update a user's status (`ACTIVE` or `BANNED`). |
| `/category` | POST | Admin | Create a new service category. |
| `/bookings/admin` | GET | Admin | Retrieve all bookings. |

---

# Technician APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/technician/profile` | GET | Technician | Retrieve the logged-in technician's profile. |
| `/technician/profile` | PUT | Technician | Update technician profile information. |
| `/technician/availability` | PUT | Technician | Update technician availability manually. |

---

# Public Technician APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/technician` | GET | Public | Retrieve all technician profiles. |
| `/technician/:technicianId` | GET | Public | Retrieve a technician with services and reviews. |

---

# Service APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/services` | POST | Technician | Create a new service. |
| `/services` | GET | Public | Retrieve all services with optional filters. |
| `/services/:serviceId` | PATCH | Technician | Update an existing service. |

### Available Filters

| Query Parameter | Example |
|----------------|---------|
| `categoryName` | `/services?categoryName=Electrical` |
| `location` | `/services?location=Dhaka` |
| `price` | `/services?price=1000` |
| `rating` | `/services?rating=4.5` |
| `active` | `/services?active=true` |

---

# Booking APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/bookings` | POST | Authenticated | Create a booking. |
| `/bookings/:bookingId` | GET | Booking Owner | Retrieve a specific booking. |
| `/bookings/user/:userId` | GET | User/Admin | Retrieve all bookings for a specific user. |
| `/bookings/technician/:technicianId` | GET | Technician/Admin | Retrieve bookings assigned to a technician. |
| `/bookings/update-status/:bookingId` | PATCH | Technician | Update booking status. |
| `/bookings/cancel-booking/:bookingId` | PATCH | Booking Owner | Cancel a booking if its status is `PENDING` or `ACCEPTED`. |

---

# Review APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/review/:bookingId` | POST | Booking Owner | Submit a review after the booking has been completed. |

---

# Payment APIs

| Endpoint | Method | Access | Description |
|----------|--------|--------|-------------|
| `/payment/:bookingId` | POST | Authenticated | Create a payment session for a booking. |
| `/payment` | GET | Authenticated | Retrieve the logged-in user's payment history. |
| `/payment/:paymentId` | GET | Authenticated | Retrieve a specific payment belonging to the logged-in user. |

---

# Booking Status Flow

```text
PENDING
   │
   ▼
ACCEPTED
   │
   ▼
IN_PROGRESS
   │
   ▼
COMPLETED

PENDING ─────► CANCELLED
ACCEPTED ────► CANCELLED
```

# Authorization Header

```http
Authorization: <access_token>
```
