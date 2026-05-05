# ParkAddis Backend API Documentation (Full Specification)

This document provides a comprehensive technical reference for the ParkAddis backend. It covers all available endpoints, request/response structures, and integrated financial flows (Chapa & Wallet).

## 1. Fundamentals

### Base URL

- **Production (Render):** `https://park-addis.onrender.com/api`
- **Development (Local):** `http://localhost:1000/api`

### Authentication

ParkAddis uses **Session IDs** for authentication.

- **Mobile Integration:** Pass the `sessionId` in the `Authorization` header as a Bearer token.
- **Header Format:** `Authorization: Bearer <sessionId>`
- **Web Integration:** Managed automatically via `httpOnly` cookies.

### Content Type

All requests and responses use `application/json`.

---

## 2. Authentication API (`/api/auth`)

### Register User & Vehicle

`POST /api/auth/register`

- **Body:**
  ```json
  {
    "fullName": "...",
    "email": "...",
    "password": "...",
    "phoneNumber": "...",
    "role": "user",
    "car": {
      "plateNumber": "...",
      "carModel": "...",
      "color": "..."
    }
  }
  ```
- **Response (201):** `{ "ok": true, "message": "...", "sessionId": "..." }`

### User Login

`POST /api/auth/login`

- **Body:** `{ "email": "...", "password": "..." }`
- **Response (200):** `{ "user": { ... }, "sessionId": "..." }`

### Current Profile

`GET /api/auth/me`

- **Requires Auth**
- **Response (200):** `{ "userId": "...", "email": "...", "fullName": "...", "role": "..." }`

---

## 3. Parking Inventory API (`/api/parking`)

### Search Locations

`GET /api/parking`

- **Query Params:** `distance` (km), `lat`, `lng`.
- **Logic:** If `distance=All`, returns everything. Otherwise, returns pins within specified distance.

### Detail & Spot Availability

`POST /api/parking/location`

- **Body:** `{ "id": "<locationId>" }`
- **Response (200):**
  ```json
  {
    "location": { "id": "...", "name": "...", "address": "...", "geom": "..." },
    "spot": { "id": "...", "pricePerHour": "...", "availableSlots": 10 }
  }
  ```

---

## 4. Reservation & Session Lifecycle (`/api/reservation`)

### Create Reservation

`POST /api/reservation`

- **Requires Auth**
- **Body:**
  ```json
  {
    "spotId": "...",
    "vehicleId": "...",
    "startTime": "ISO-TIMESTAMP",
    "endTime": "ISO-TIMESTAMP"
  }
  ```
- **Response (200):** `{ "reservedSpot": { "id": "...", "status": "RESERVED", "qrToken": "..." } }`

### List and Active State

- `GET /api/reservation`: List all user reservations (History).
- `GET /api/reservation/active`: Get the current ongoing or upcoming reservation.

### QR Validation & Session Management

These endpoints manage the hardware/scanner interaction:

- `POST /api/reservation/validate`: `{ "qrToken": "..." }` -> Verifies if token is valid for entry.
- `POST /api/reservation/start`: `{ "reservationId": "..." }` -> Marks user as checked-in (ACTIVE).
- `POST /api/reservation/complete`: `{ "reservationId": "..." }` -> Marks user as checked-out (COMPLETED).

---

## 5. Admin Backend Guide

This section explains how your admin app should use ParkAddis backend APIs for gate validation, reservation lookup, and auth.

### Admin Authentication

Admin users log in using the same auth endpoints as regular users.

#### `POST /api/auth/login`

- **Body:** `{ "email": "admin@example.com", "password": "..." }`
- **Response (200):** `{ "user": { "id": "...", "role": "admin", ... }, "sessionId": "..." }`

#### How auth works

- On login, the backend creates a session record and returns a `sessionId`.
- This `sessionId` is stored either in a secure cookie (`httpOnly`) or used as a Bearer token.
- All protected backend routes require valid auth via either:
  - `Cookie: sessionId=<sessionId>`
  - `Authorization: Bearer <sessionId>`

#### `GET /api/auth/me`

- **Requires Auth**
- **Response:**
  ```json
  {
    "userId": "...",
    "email": "...",
    "fullName": "...",
    "role": "admin"
  }
  ```
- The admin app should verify `role === "admin"` before showing gate controls.

### Admin Reservation Listing

#### `GET /api/reservation`

- **Requires Auth**
- **Behavior:** Returns reservations for the authenticated user.
- **Admin note:** Currently this endpoint is user-scoped. If your admin app needs global reservation search, extend the backend with an admin-only list endpoint.

#### Recommendation for admin use

- Use `GET /api/auth/me` first to confirm admin role.
- Admin UI can then call reservation listing for the logged-in admin or, if a dedicated admin endpoint exists, query that.
- Reservation objects returned include:
  - `id`
  - `startTime`
  - `endTime`
  - `status`
  - `qrToken`
  - `createdAt`
  - `spotId`
  - `locationName`
  - `locationAddress`
  - `pricePerHour`
  - `plateNumber`
  - `carModel`
  - `carColor`
  - `paymentStatus`

### Get details for a reservation

Currently the backend does not expose a dedicated `GET /api/reservation/:id` route.

#### Current options

- Use `GET /api/reservation` to fetch reservation items and filter client-side.
- Each reservation payload already contains user, vehicle, spot, and payment status metadata.

#### Suggested admin extension

If needed, add a backend route such as:

- `GET /api/reservation/:id`
- `GET /api/admin/reservations` for global reservation queries

### QR code scan validation flow

For gate entry and exit, use the validation endpoint.

#### `POST /api/reservation/validate`

- **Body:** `{ "qrToken": "..." }`
- **Purpose:** Validate the scanned QR token and advance the reservation state.
- **Response:** Depends on reservation status.

##### Validation behavior

- If reservation status is `RESERVED`:
  - The backend automatically starts the session (`ACTIVE`).
  - The response is the started reservation.
- If reservation status is `ACTIVE`:
  - The backend completes the session (`COMPLETED`).
  - The response includes final reservation details.
- If reservation status is `COMPLETED`:
  - The backend may return a payment object for checkout or indicate the session is finished.

##### Example request

```json
POST /api/reservation/validate
{
  "qrToken": "user-qr-token-value"
}
```

##### Example success response

```json
{
  "id": "...",
  "status": "ACTIVE",
  "startTime": "...",
  "endTime": "...",
  "qrToken": "...",
  "paymentStatus": "PENDING"
}
```

### Manual session control

If the admin app wants explicit start/stop actions, use these endpoints.

#### `POST /api/reservation/start`

- **Body:** `{ "reservationId": "..." }`
- **Response:** Reservation object with `status: "ACTIVE"`.
- **Use case:** Start a session manually when a car enters.

#### `POST /api/reservation/complete`

- **Body:** `{ "reservationId": "..." }`
- **Response:** Reservation object with `status: "COMPLETED"`.
- **Use case:** End a session when a car leaves.

### Cancel reservation from admin

Admins can cancel reservations using:

- `DELETE /api/reservation?id=<reservationId>`
- Requires auth
- If cancelled within 15 minutes of booking, a reservation fee refund is issued.

### Admin workflow summary

1. **Authenticate admin** via `POST /api/auth/login`.
2. **Confirm role** with `GET /api/auth/me`.
3. **Fetch reservations** using current reservation endpoints or add an admin list route.
4. **Scan QR** at gate with `POST /api/reservation/validate`.
5. **Optionally use manual controls**:
   - `POST /api/reservation/start`
   - `POST /api/reservation/complete`
6. **View reservation details** from the returned reservation object.

### Auth integration details

#### Cookie-based web use

- The backend sets `sessionId` as an `httpOnly` cookie on login.
- The browser sends this cookie automatically on subsequent requests.

#### Token-based mobile/admin use

- Pass `sessionId` as a bearer token:
  - `Authorization: Bearer <sessionId>`
- This is useful for your admin app when you do not want to rely on cookies.

### Handling errors

Common response patterns:

- `401 Unauthorized`: invalid or missing session.
- `400 Bad Request`: missing required body fields such as `qrToken` or `reservationId`.
- `404 Not Found`: reservation not found or unable to cancel.
- `500 Internal Server Error`: server-side failure, check backend logs.

### Recommended admin UI behavior

- Always verify admin role before showing gate controls.
- Show reservation status clearly: `RESERVED`, `ACTIVE`, `COMPLETED`, `CANCELLED`.
- After QR scan, display whether the session was started or completed.
- If a reservation is completed and payment is needed, show `paymentStatus`.

---

## 6. Wallet Service Documentation

The Wallet Service manages user financial transactions, balances, and payments within the ParkAddis platform. It integrates with Chapa for external payments and handles internal wallet operations for reservations.

### Overview

- **Purpose:** Handle wallet creation, balance management, top-ups, payments, and refunds.
- **Key Features:**
  - Wallet balance calculation from transaction history.
  - Support for reservation fees and full payments.
  - Automatic refunds for cancellations within 15 minutes.
  - Integration with Chapa payment gateway.
- **Dependencies:** Drizzle ORM, Decimal.js for precision, Chapa API.

### Transaction Types

- `TOPUP`: Adds funds to the wallet (via Chapa).
- `RESERVATION_CHARGE`: Deducts funds for reservation fees or full payments.
- `RESERVATION_REFUND`: Credits funds back for cancelled reservations.

### Balance Calculation Logic

Balances are calculated from successful transactions:

- `TOPUP`: +amount
- `RESERVATION_CHARGE`: -amount
- `RESERVATION_REFUND`: +amount

Balances are stored as strings (Decimal.js) for precision and synced after each transaction.

### Functions

#### `createWallet(userId: string)`

Creates a new wallet for a user with zero balance.

- **Parameters:**
  - `userId` (string): The user's ID.
- **Returns:** Wallet object or null.
- **Throws:** None.
- **Example:**
  ```typescript
  const wallet = await createWallet("user-123");
  // { id: "wallet-id", userId: "user-123", balance: "0" }
  ```

#### `getWallet(userId: string)`

Retrieves the user's wallet.

- **Parameters:**
  - `userId` (string): The user's ID.
- **Returns:** Wallet object or null.
- **Throws:** None.
- **Example:**
  ```typescript
  const wallet = await getWallet("user-123");
  // { id: "wallet-id", userId: "user-123", balance: "100.00" }
  ```

#### `getWalletTransactions(walletId: string)`

Fetches all transactions for a wallet.

- **Parameters:**
  - `walletId` (string): The wallet's ID.
- **Returns:** Array of transaction objects or null.
- **Throws:** None.
- **Example:**
  ```typescript
  const transactions = await getWalletTransactions("wallet-id");
  // [{ id: "...", amount: "50.00", type: "TOPUP", status: "SUCCESS", ... }]
  ```

#### `topUpWallet(userId: string, amount: string, returnUrl?: string)`

Initiates a top-up via Chapa.

- **Parameters:**
  - `userId` (string): The user's ID.
  - `amount` (string): Amount to top-up.
  - `returnUrl` (optional string): Redirect URL after payment.
- **Returns:** Chapa payment object or null.
- **Throws:** Errors from Chapa initialization.
- **Example:**
  ```typescript
  const payment = await topUpWallet("user-123", "100.00");
  // { checkout_url: "https://...", tx_ref: "..." }
  ```

#### `calculateBalanceFromHistory(walletId: string, tx?: any)`

Calculates balance from transaction history.

- **Parameters:**
  - `walletId` (string): The wallet's ID.
  - `tx` (optional): Database transaction.
- **Returns:** Balance as number.
- **Throws:** None.
- **Notes:** Used internally for syncing.

#### `syncWalletBalance(walletId: string, tx?: any)`

Updates the wallet balance in the database.

- **Parameters:**
  - `walletId` (string): The wallet's ID.
  - `tx` (optional): Database transaction.
- **Returns:** Updated wallet object.
- **Throws:** None.

#### `refundReservationFee(reservationId: string, tx?: any)`

Refunds the reservation fee for a cancelled reservation.

- **Parameters:**
  - `reservationId` (string): The reservation's ID.
  - `tx` (optional): Database transaction.
- **Returns:** Updated wallet object or null.
- **Throws:** None.
- **Notes:** Called during cancellation if within 15 minutes.

#### `confirmTopUp(tx_ref: string)`

Confirms a successful top-up and updates balance.

- **Parameters:**
  - `tx_ref` (string): Chapa transaction reference.
- **Returns:** Object with success status and balance.
- **Throws:** Errors if transaction not found or already processed.

#### `failTopUp(tx_ref: string)`

Marks a top-up as failed.

- **Parameters:**
  - `tx_ref` (string): Chapa transaction reference.
- **Returns:** Updated transaction object or null.
- **Throws:** None.

#### `payReservationFeeFromWallet(userId: string, reservationId: string, amount: string)`

Charges the reservation fee from wallet, keeps reservation RESERVED.

- **Parameters:**
  - `userId` (string): The user's ID.
  - `reservationId` (string): The reservation's ID.
  - `amount` (string): Fee amount.
- **Returns:** Object with success and balance.
- **Throws:** Insufficient funds, reservation not found, invalid status.

#### `payReservationFromWallet(userId: string, reservationId: string, amount: string)`

Charges full reservation amount from wallet, marks reservation PAID.

- **Parameters:**
  - `userId` (string): The user's ID.
  - `reservationId` (string): The reservation's ID.
  - `amount` (string): Full amount.
- **Returns:** Object with success and balance.
- **Throws:** Insufficient funds, reservation not found.

### Error Handling

- **Insufficient Funds:** Thrown when wallet balance < required amount.
- **Reservation Not Found:** When reservation doesn't exist or doesn't belong to user.
- **Invalid Status:** When trying to pay fee on non-RESERVED reservation.
- **Concurrent Transactions:** Prevents negative balances via race condition checks.

### API Endpoints

#### `GET /api/wallet`

- **Requires Auth**
- **Response (200):** Wallet object.

#### `POST /api/wallet/topup`

- **Requires Auth**
- **Body:** `{ "amount": "100.00", "returnUrl": "..." }`
- **Response (200):** Chapa payment details.

#### `POST /api/wallet/pay/reservation`

- **Requires Auth**
- **Body:** `{ "reservationId": "...", "amount": "50.00" }`
- **Response (200):** `{ "success": true, "balance": "..." }`

#### `POST /api/wallet/pay/reservation-fee`

- **Requires Auth**
- **Body:** `{ "reservationId": "...", "amount": "20.00" }`
- **Response (200):** `{ "success": true, "balance": "..." }`

#### `POST /api/wallet/callback`

- **Internal:** Handles Chapa webhooks for top-ups.

### Integration Notes

- All monetary values are strings to avoid floating-point issues.
- Transactions are atomic using database transactions.
- Refunds are automatic on cancellation within 15 minutes for fee payments.
- Balance is recalculated from history to ensure consistency.

---

## 6. Payment Integration (Chapa Direct) (`/api/payment`)

### Direct Chapa Payment

`POST /api/payment/create`

- **Body:** `{ "qrToken": "..." }`
- **Logic:** Used when a user wants to pay directly for a reservation without using their wallet balance.

### Secure Webhook

`POST /api/payment/webhook`

- **Internal Only:** Receives verified HMAC-SHA256 signatures from Chapa to confirm payments globally.

---

## 7. Vehicle API (`/api/vehicle`)

### List Vehicles

`GET /api/vehicle`

- **Requires Auth**
- **Response (200):** Array of vehicle objects associated with the user.

---

## Appendix: Logical Flows

1.  **Booking:** User selects spot -> `POST /api/reservation` -> Receives `qrToken`.
2.  **Payment (Option A - Wallet full payment):** User checks balance -> `POST /api/wallet/pay/reservation`.
3.  **Payment (Option B - Wallet reservation fee only):** User pays the reservation deposit -> `POST /api/wallet/pay/reservation-fee`.
4.  **Payment (Option C - Chapa):** User calls `POST /api/payment/create` using the `qrToken`.
5.  **Redemption:** User scans QR at gate -> Guard calls `/validate` -> Entry calls `/start` -> Exit calls `/complete`.
6.  **Extension:** If time runs out, user calls `POST /api/reservation/extend`.
