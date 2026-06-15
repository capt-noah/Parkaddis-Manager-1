# ParkAddis Clerk App: Complete Integration Guide

This document is the comprehensive reference for frontend developers building the ParkAddis Clerk Mobile Application. It details the exact API payloads, response structures, and step-by-step logic required to implement the gate management features.

---

## 1. Authentication & Session Management

Clerks authenticate via the **dedicated clerk auth endpoints**. This ensures faster lookups by querying the `employees` table directly.

### Clerk Login

**`POST /api/clerk/login`**

- **Request Body:**
  ```json
  {
    "email": "clerk1@parkaddis.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": "uuid-here",
      "email": "clerk1@parkaddis.com",
      "fullName": "John Doe",
      "role": "employee",
      "status": "ACTIVE",
      "userType": "employee"
    },
    "sessionId": "session-uuid-here"
  }
  ```

### Clerk Registration (If enabled)

**`POST /api/clerk/register`**

- **Request Body:**
  ```json
  {
    "fullName": "New Clerk",
    "email": "clerk2@parkaddis.com",
    "password": "password",
    "phoneNumber": "0911...",
    "assignedLocationId": "loc-uuid",
    "shiftStartTime": "08:00",
    "shiftEndTime": "16:00"
  }
  ```
- **Success Response (201 Created):** Returns the `user` and `sessionId` as above.

- **Frontend Logic:** If `user.userType !== 'employee'`, deny access and show an error. Store `sessionId` securely and attach `Authorization: Bearer <sessionId>` to all future requests.

### Clerk Registration Flow

**`POST /api/clerk/register`**

- **Request Body:**
  ```json
  {
    "fullName": "New Clerk",
    "email": "clerk2@parkaddis.com",
    "password": "password",
    "phoneNumber": "0911...",
    "assignedLocationId": "loc-uuid",
    "shiftStartTime": "08:00",
    "shiftEndTime": "16:00"
  }
  ```
- **Success Response (201 Created):** Returns the registered clerk object and `sessionId`.
- **Frontend Logic:** After registration, use the returned `sessionId` like login, store it securely, and use it for authenticated clerk requests.
- **Note:** In production, clerk registration is usually controlled by the admin panel; this endpoint can be used for initial clerk setup or standalone onboarding.

### Clerk Profile

**`GET /api/clerk/me`**

- **Auth:** Bearer session token (works outside shift hours for session restore).
- **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": "uuid-here",
      "email": "clerk1@parkaddis.com",
      "fullName": "John Doe",
      "role": "employee",
      "status": "ACTIVE",
      "userType": "employee",
      "assignedLocationId": "loc-uuid",
      "shiftStartTime": "08:00:00",
      "shiftEndTime": "16:00:00",
      "locationName": "Bole Parking"
    }
  }
  ```

### Clerk Sessions (Location-Scoped)

**`GET /api/clerk/sessions`**

- **Auth:** Bearer session token + active shift (`isClerk` middleware).
- **Query Parameters (optional):**
  - `status` — comma-separated reservation statuses, e.g. `ACTIVE,RESERVED`
  - `paymentStatus` — e.g. `PENDING`, `SUCCESS`
- **Success Response (200 OK):**
  ```json
  {
    "reservations": [
      {
        "id": "res-uuid",
        "status": "ACTIVE",
        "plateNumber": "A12345",
        "duration": "1h 30m",
        "accrued": "60.00",
        "paymentStatus": "PENDING",
        "locationName": "Bole Parking"
      }
    ],
    "locationId": "loc-uuid",
    "locationName": "Bole Parking",
    "locationStats": {
      "totalSlots": 50,
      "availableSlots": 32,
      "activeSessions": 5
    }
  }
  ```
- **Error Responses:**
  - `403 Forbidden` — outside shift hours.
  - `400 Bad Request` — clerk has no assigned location.

---

## 2. Core Gate Operations (QR Scanning)

The primary interface of the Clerk app is the QR Scanner. When a QR is scanned, you hit the `/validate` endpoint. The backend automatically determines if it's an Entry (Start) or Exit (Complete).

### Validate QR Code (Primary Action)

**`POST /api/reservation/validate`**

- **Request Body:**
  ```json
  { "qrToken": "scanned-qr-uuid-here" }
  ```
- **Success Response - ENTRY (200 OK):** _(Backend auto-started the session)_
  ```json
  {
    "id": "res-uuid",
    "status": "ACTIVE",
    "actualStartTime": "2026-05-10T08:00:00Z"
  }
  ```
- **Success Response - EXIT (200 OK):** _(Backend auto-completed the session)_
  ```json
  {
    "id": "res-uuid",
    "status": "COMPLETED",
    "actualEndTime": "2026-05-10T10:00:00Z"
  }
  ```
- **Error Responses:**
  - `401 Invalid Token` (QR is fake or expired).
  - `403 Forbidden` (Clerk is outside shift hours, or scanning a QR belonging to a different parking location).

### Manual Session Controls

If the QR scanner fails, the clerk can manually trigger these actions if they find the reservation via search.

**Start Session Manually:** `POST /api/reservation/start`

- **Body:** `{ "reservationId": "..." }`
- **Response:** Returns updated reservation object (`status: "ACTIVE"`).

**End Session Manually:** `POST /api/reservation/complete`

- **Body:** `{ "reservationId": "..." }`
- **Response:** Returns updated reservation object (`status: "COMPLETED"`).

---

## 3. Walk-in User Registration

When a driver arrives without the app, the Clerk registers them at the gate.

### Step 1: Register the Walk-in

**`POST /api/clerk/register-walkin`**

- **Request Body:**
  ```json
  {
    "fullName": "Abebe Bekele",
    "phoneNumber": "0911223344",
    "plateNumber": "A12345",
    "carModel": "Toyota Corolla",
    "color": "Silver"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "message": "Walk-in registered successfully",
    "user": {
      "id": "new-user-uuid",
      "phoneNumber": "0911223344",
      "role": "user"
    }
  }
  ```
  _(Note: The backend automatically generates a secure, random password for them. They can claim the account via SMS password-reset later if implemented)._

### Step 2: Auto-Create Reservation

Immediately after Step 1 succeeds, take the `user.id` and create an active reservation for them.

**`POST /api/clerk/create-reservation`**

- **Request Body:**
  ```json
  {
    "userId": "new-user-uuid",
    "vehicleId": "fetch-from-user-object-or-backend"
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "message": "Reservation created successfully",
    "reservation": {
      "id": "res-uuid",
      "status": "RESERVED",
      "qrToken": "new-qr-token"
    }
  }
  ```

---

## 3. Lookup Lost QR Token (User Search)

When a customer forgets or loses the QR token needed to start or end a reservation, the clerk can search for their account by email or phone number.

### Search User by Email or Phone

**`GET /api/clerk/search-user?email=<email>&phoneNumber=<phoneNumber>`**

- **Query Parameters:** one of `email` or `phoneNumber` is required.
- **Success Response (200 OK):**
  ```json
  {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "phoneNumber": "0911223344",
      "role": "user"
    },
    "activeReservation": {
      "id": "res-uuid",
      "status": "RESERVED",
      "qrToken": "current-qr-token",
      "startTime": "...",
      "endTime": "..."
    }
  }
  ```
- **Use case:** Display the user's current reservation and QR token, then manually trigger session start or completion using the reservation id.

---

## 4. Payment Verification

When a session is completed (Exit scan), the clerk must verify if the user has settled their bill via the ParkAddis Wallet or Chapa.

**`POST /api/clerk/verify-payment`**

- **Request Body:**
  ```json
  { "qrToken": "scanned-qr-uuid-here" }
  ```
  _(Or `{ "reservationId": "..." }`)_
- **Success Response (200 OK):**
  ```json
  {
    "reservationId": "res-uuid",
    "status": "COMPLETED",
    "paymentStatus": "SUCCESS",
    "amount": "50.00"
  }
  ```
- **Frontend Logic:** If `paymentStatus === "SUCCESS"`, display a huge Green Checkmark ("Payment Cleared - Open Gate"). If `PENDING` or `FAILED`, display a Red Warning ("Do Not Open Gate - Payment Required").

---

## 5. UI/UX Implementation Requirements

1. **Fullscreen Scanner:** The primary tab should be a robust, fast camera viewfinder.
2. **Immediate Haptic/Visual Feedback:**
   - Success: Phone vibrates, screen flashes Green for 2 seconds.
   - Error: Phone buzzes twice, screen flashes Red with error message.
3. **No Statistics:** Do not clutter the app with charts or profile settings. The app exists to process cars in under 3 seconds.
4. **Shift Lockout Screen:** If the app receives a `403 Access Denied: Outside of active shift hours`, immediately lock the UI and display "Shift Ended. Please hand over the device."
