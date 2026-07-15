# StayProx Backend Auth Guide

This backend already includes complete `register` and `login` APIs with JWT authentication and role support (`tenant`, `owner`).

## 1) What Was Created

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected, requires token)

Main files:

- `models/User.js`
- `controllers/userController.js`
- `routes/userRoutes.js`
- `middleware/authMiddleware.js`
- `server.js`

## 2) How Register Works

Endpoint: `POST /api/auth/register`

Input:

```json
{
  "name": "Nimal",
  "email": "nimal@example.com",
  "password": "123456",
  "role": "owner"
}
```

Steps:

1. Validate required fields.
2. Validate role is `tenant` or `owner`.
3. Check whether email already exists.
4. Hash password using `bcryptjs`.
5. Save user in MongoDB.
6. Return JWT token + user payload.

## 3) How Login Works

Endpoint: `POST /api/auth/login`

Input:

```json
{
  "email": "nimal@example.com",
  "password": "123456"
}
```

Steps:

1. Validate email/password are provided.
2. Find user by email.
3. Compare plain password with hashed password using `bcryptjs.compare`.
4. If valid, return JWT token + user payload.

## 4) How Protected Routes Work

The middleware `protect`:

1. Reads `Authorization: Bearer <token>`.
2. Verifies token using `JWT_SECRET`.
3. Fetches user from DB.
4. Adds `req.user`.

The middleware `requireRole("owner")`:

1. Checks `req.user.role`.
2. Allows only owner users.

Example owner-only route:

- `POST /api/rooms` (add boarding)

## 5) Run Locally

1. Copy env file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Start API:

```bash
npm run dev
```

## 6) Test Quickly (PowerShell)

Register:

```powershell
$body = @{
  name = "Nimal"
  email = "nimal@example.com"
  password = "123456"
  role = "owner"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/register" -ContentType "application/json" -Body $body
```

Login:

```powershell
$body = @{
  email = "nimal@example.com"
  password = "123456"
} | ConvertTo-Json

$login = Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/auth/login" -ContentType "application/json" -Body $body
$token = $login.token
```

Get current user (`/me`):

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:5000/api/auth/me" -Headers @{ Authorization = "Bearer $token" }
```

Owner add room:

```powershell
$room = @{
  title = "Near Campus Room"
  location = "Colombo 06"
  price = 25000
  description = "WiFi and attached bathroom"
  contact = "+94 77 123 4567"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://localhost:5000/api/rooms" -Headers @{ Authorization = "Bearer $token" } -ContentType "application/json" -Body $room
```

## 7) Learning Notes

- Never store plain passwords.
- JWT should be short-lived for production and rotated.
- Role checks must happen in backend, not frontend only.
- Use proper validation library next (e.g. `zod` or `joi`) for stronger input safety.
