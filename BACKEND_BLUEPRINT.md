# GlowCut Salon — Backend Blueprint

> Internship Project | Triyuga Soft Tech Pvt. Ltd.
> Backend Team: 2 Members (Person A + Person B)
> Stack: Node.js, Express.js, MongoDB, Mongoose, JWT, Multer, Anthropic SDK

---

## SECTION 1 — Project Setup & Architecture Rules
### (Both members must read before writing any backend code)

---

### 1.1 How the Backend is Structured

The backend follows the **MVC pattern** (Model → Controller → Routes):

- **Model** (`/models/`) — Defines the shape of data stored in MongoDB (like a table blueprint)
- **Controller** (`/controllers/`) — Contains all business logic (what happens when an API endpoint is called)
- **Route** (`/routes/`) — Maps HTTP method + URL path to the correct controller function
- **Middleware** (`/middleware/`) — Functions that run before the controller (e.g., check if user is logged in)

**How a request flows:**
```
Frontend fetch() → Express Route → Middleware (optional) → Controller Function → Model (DB query) → Response sent back
```

---

### 1.2 Folder Structure (Backend Only)

```
backend/
├── server.js              ← Entry point. Creates Express app, registers routes, starts server.
├── .env                   ← Secret keys. Never commit this file.
├── .env.example           ← Shows what variables are needed (commit this one).
├── .gitignore             ← Must include: node_modules, .env, uploads/
│
├── config/
│   └── db.js              ← Mongoose connection to MongoDB
│
├── models/                ← One file per MongoDB collection
│   ├── User.js
│   ├── Appointment.js
│   ├── Service.js
│   ├── Stylist.js
│   ├── Package.js
│   ├── PromoCode.js
│   ├── Review.js
│   ├── Queue.js
│   └── Enquiry.js
│
├── routes/                ← One file per feature
│   ├── auth.routes.js
│   ├── appointment.routes.js
│   ├── queue.routes.js
│   ├── service.routes.js
│   ├── stylist.routes.js
│   ├── package.routes.js
│   ├── promo.routes.js
│   ├── review.routes.js
│   ├── ai.routes.js
│   ├── gallery.routes.js
│   └── enquiry.routes.js
│
├── controllers/           ← One file per feature, matches routes/
│   ├── auth.controller.js
│   ├── appointment.controller.js
│   ├── queue.controller.js
│   ├── service.controller.js
│   ├── stylist.controller.js
│   ├── package.controller.js
│   ├── promo.controller.js
│   ├── review.controller.js
│   ├── ai.controller.js
│   ├── gallery.controller.js
│   └── enquiry.controller.js
│
├── middleware/
│   ├── auth.middleware.js     ← Verifies JWT token on protected routes
│   └── upload.middleware.js   ← Multer config for image file uploads
│
├── uploads/               ← Where uploaded images are stored locally
│   ├── gallery/
│   └── ai-photos/
│
└── seed/
    └── seed.js            ← One-time script to fill DB with demo data (services, stylists, packages)
```

---

### 1.3 Standard API Response Format

Every API response must follow this exact format for consistency:

**Success Response:**
```
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": { ...the actual result object or array... }
}
```

**Error Response:**
```
{
  "success": false,
  "message": "This time slot is already booked",
  "error": "SLOT_UNAVAILABLE"   ← optional error code for frontend to handle
}
```

**HTTP Status Codes to use:**
- `200` — OK (successful GET, PATCH, DELETE)
- `201` — Created (successful POST that creates a new document)
- `400` — Bad Request (missing required fields, validation failed)
- `401` — Unauthorized (no token, or invalid token)
- `403` — Forbidden (token is valid but user doesn't have permission)
- `404` — Not Found (document with given ID doesn't exist)
- `500` — Internal Server Error (something crashed — catch all errors)

---

### 1.4 Error Handling Pattern

Wrap every controller function in a `try-catch` block. Never let the server crash due to an unhandled error.

```
Inside every controller function:
try {
  // your logic here
} catch (error) {
  console.error('[ControllerName] Error:', error.message);
  return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
}
```

---

### 1.5 Environment Variables (.env file)

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/glowcut
JWT_SECRET=glowcut_super_secret_key_2024
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-...
```

**Rules:**
- Never hardcode these values anywhere in the code.
- Always use `process.env.VARIABLE_NAME`.
- Call `require('dotenv').config()` at the top of `server.js`.

---

### 1.6 CORS Setup

In `server.js`, configure CORS to allow requests from the frontend:
- Allow all origins during development (`*`)
- Allowed methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
- Allowed headers: Content-Type, Authorization

---

### 1.7 server.js Responsibilities

- Load dotenv
- Connect to MongoDB (call the db.js config function)
- Initialize Express app
- Apply global middleware: express.json(), express.urlencoded(), cors(), static files
- Register all routes with prefix `/api/`
  - `/api/auth` → auth.routes.js
  - `/api/services` → service.routes.js
  - `/api/stylists` → stylist.routes.js
  - `/api/appointments` → appointment.routes.js
  - `/api/queue` → queue.routes.js
  - `/api/packages` → package.routes.js
  - `/api/promo` → promo.routes.js
  - `/api/reviews` → review.routes.js
  - `/api/ai` → ai.routes.js
  - `/api/gallery` → gallery.routes.js
  - `/api/enquiry` → enquiry.routes.js
  - `/api/admin` → all admin sub-routes
- Start listening on PORT
- Handle undefined routes with a 404 response

---

## SECTION 2 — PERSON A BACKEND WORK

### Features Assigned to Person A:
1. Project Setup (server.js, db.js, package.json, .env)
2. Authentication API (admin login + JWT middleware)
3. Appointments API (full CRUD)
4. Queue Management API
5. Services API
6. Stylists & Availability API

---

### A1 — Project Setup

**Tasks:**
- Run `npm init -y` in the backend folder
- Install all required packages:
  - express, mongoose, dotenv, cors, jsonwebtoken, bcryptjs, multer
  - Install Anthropic SDK: `npm install @anthropic-ai/sdk`
  - Dev dependencies: nodemon
- Set up `package.json` scripts:
  - `"start": "node server.js"`
  - `"dev": "nodemon server.js"`
- Create `config/db.js`:
  - Use `mongoose.connect(process.env.MONGO_URI)` inside an async function
  - Log "MongoDB Connected" on success, log error and exit on failure
- Create the full folder structure (empty files with placeholder comments)
- Create `.gitignore` and `.env.example`
- Create `server.js` with all the setup described in Section 1.7

**Seed Script (`seed/seed.js`):**
- Create a standalone Node script that:
  - Connects to MongoDB
  - Deletes all existing Services, Stylists, Packages documents
  - Inserts the full list of services from the PROJECT_BLUEPRINT (all categories, names, prices, durations)
  - Inserts 6 mock stylists (name, specializations, experience, bio, rating, isAvailable: true)
  - Inserts the 4 combo packages and 3 membership plans from the PROJECT_BLUEPRINT
  - Creates an admin user (email: admin@glowcut.in, password: hashed using bcryptjs)
  - Logs "Seed complete" and exits
- Run with: `node seed/seed.js`

---

### A2 — Authentication API

**Files:** `models/User.js`, `routes/auth.routes.js`, `controllers/auth.controller.js`, `middleware/auth.middleware.js`

**User Model Fields:**
- `name` — String, required
- `email` — String, required, unique, lowercase
- `passwordHash` — String, required (store bcrypt hash, never plain text)
- `role` — String, enum: ['admin', 'customer'], default: 'customer'
- `createdAt` — Date, default: Date.now

**Auth Routes:**
- `POST /api/auth/login`

**Login Controller Logic:**
1. Receive `{ email, password }` from request body
2. Validate that both fields exist — return 400 if not
3. Find user in DB by email — return 404 if not found
4. Compare incoming password with stored hash using `bcryptjs.compare()`
5. If mismatch — return 401 with "Invalid credentials"
6. If match — generate JWT using `jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })`
7. Return 200 with `{ success: true, token: '...', user: { id, name, email, role } }`

**JWT Middleware (`middleware/auth.middleware.js`):**
- Export a function `protect` that:
  1. Reads Authorization header — format: `Bearer <token>`
  2. If header is missing or wrong format → return 401
  3. Verify token using `jwt.verify(token, process.env.JWT_SECRET)`
  4. If verification fails (expired or tampered) → return 401
  5. If valid → attach decoded payload to `req.user` and call `next()`
- Export a second function `adminOnly` that:
  1. Calls `protect` first (or runs after it)
  2. Checks `req.user.role === 'admin'` — if not → return 403

---

### A3 — Services API

**Files:** `models/Service.js`, `routes/service.routes.js`, `controllers/service.controller.js`

**Service Model Fields:**
- `name` — String, required
- `category` — String, enum: ['Hair', 'Skin', 'Nails', 'Makeup', 'Spa', "Men's"]
- `description` — String
- `price` — Number, required
- `durationMinutes` — Number, required
- `imageUrl` — String (path to local image or placeholder)
- `isActive` — Boolean, default: true

**Routes:**
- `GET /api/services` — Get all active services (isActive: true), optionally filter by `?category=Hair`
- `GET /api/services/:id` — Get one service by ID
- `POST /api/services` — Admin only (`protect + adminOnly` middleware) — Create new service
- `PATCH /api/services/:id` — Admin only — Update service (price, description, etc.)
- `DELETE /api/services/:id` — Admin only — Set isActive to false (soft delete, don't actually remove)

**Controller Logic Details:**

`getServices`:
- If query param `category` is provided, filter by category
- Only return services where `isActive: true`
- Sort alphabetically by name

`createService`:
- Validate all required fields
- Check if a service with the same name already exists — return 400 if it does
- Create and save new Service document
- Return 201 with created service

`updateService`:
- Find by ID, return 404 if not found
- Only update the fields that were provided in the request body (use `$set` or merge)
- Return updated service

---

### A4 — Stylists & Availability API

**Files:** `models/Stylist.js`, `routes/stylist.routes.js`, `controllers/stylist.controller.js`

**Stylist Model Fields:**
- `name` — String, required
- `photo` — String (image path)
- `specializations` — Array of Strings (e.g., ['Hair Colour', 'Bridal'])
- `experienceYears` — Number
- `bio` — String
- `rating` — Number (0 to 5, 1 decimal place)
- `isAvailable` — Boolean, default: true

**Routes:**
- `GET /api/stylists` — Get all available stylists (isAvailable: true)
- `GET /api/stylists/:id` — Get one stylist
- `GET /api/stylists/:id/availability?date=YYYY-MM-DD` — Get available time slots for a stylist on a date

**Availability Controller Logic (most complex here):**

`getStylistAvailability`:
1. Receive `stylistId` from params, `date` from query string
2. Validate that `date` is a valid date and is not a Monday (salon is closed)
3. Define the full list of time slots for the day:
   - Tuesday to Saturday: 10:00 to 20:00, every 30 minutes = 20 slots
   - Sunday: 10:00 to 18:00 = 16 slots
4. Query the Appointments collection: find all appointments where `stylistId` matches AND `date` matches AND `status` is NOT 'cancelled'
5. Extract the `timeSlot` values from those appointments into a "bookedSlots" array
6. For each slot in the full slot list, mark it as `available: true` if it's not in bookedSlots, or `available: false` if it is
7. Return the array of `{ time: '10:00', available: true/false }` objects

---

### A5 — Appointments API

**Files:** `models/Appointment.js`, `routes/appointment.routes.js`, `controllers/appointment.controller.js`

**Appointment Model Fields:**
- `customerName` — String, required
- `customerPhone` — String, required, 10-digit validation
- `customerEmail` — String, optional
- `serviceId` — ObjectId, ref: 'Service', required
- `stylistId` — ObjectId, ref: 'Stylist', required (or 'any' string for auto-assign)
- `date` — Date, required
- `timeSlot` — String, required (e.g., "14:30")
- `status` — String, enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'], default: 'confirmed'
- `tokenNumber` — String (e.g., "A-007") — auto-generated, required
- `promoCode` — String, optional
- `finalPrice` — Number (after discount applied)
- `notes` — String, optional
- `createdAt` — Date, default: Date.now

**Routes:**
- `POST /api/appointments` — Book new appointment (public)
- `GET /api/appointments/:id` — Get single appointment by ID (public — customer checks their booking)
- `PATCH /api/appointments/:id/cancel` — Cancel an appointment (public, by customer)
- `GET /api/admin/appointments?date=YYYY-MM-DD` — Admin: get all appointments for a date (protected)
- `PATCH /api/admin/appointments/:id/status` — Admin: update status of any appointment (protected)

**Book Appointment Controller Logic (`createAppointment`) — Most Important:**

1. Receive all fields from request body
2. Validate: customerName, customerPhone, serviceId, date, timeSlot are all present
3. Validate phone number format (10 digits, starts with 6–9)
4. If date is a Monday → return 400 "Salon is closed on Mondays"
5. If date is in the past → return 400 "Cannot book a past date"
6. Check if service exists in DB → return 404 if not
7. Handle stylistId "any" case: query all available stylists, then find one who has the timeSlot free for that date
8. Check slot availability for the chosen stylist on that date and time (same logic as getStylistAvailability)
9. If slot is already booked → return 400 "This time slot is already booked for this stylist"
10. Fetch the service to get the base price
11. If promoCode is provided → validate it (call promo validation logic internally):
    - Find PromoCode in DB by code (case-insensitive)
    - Check isActive, check expiryDate, check usedCount < maxUsageCount
    - Calculate final price based on discount type
    - Increment promoCode.usedCount by 1 and save
12. Generate token number:
    - Get or create today's Queue document
    - Increment totalTokensIssued by 1
    - Token format: "A-" + padded number (e.g., A-001, A-007, A-023)
    - Add the new appointment's ID to Queue.queueList array
13. Create and save the Appointment document
14. Return 201 with the full appointment object including tokenNumber

---

### A6 — Queue Management API

**Files:** `models/Queue.js`, `routes/queue.routes.js`, `controllers/queue.controller.js`

**Queue Model Fields:**
- `date` — Date, required, unique (one Queue document per day)
- `currentTokenBeingServed` — String (e.g., "A-003"), default: null
- `totalTokensIssued` — Number, default: 0
- `queueList` — Array of ObjectIds referencing Appointment documents
- `averageServiceDurationMinutes` — Number, default: 35

**Routes:**
- `GET /api/queue/today` — Get full queue status for today (public)
- `PATCH /api/queue/advance` — Admin: mark current as done, move to next token (protected)
- `GET /api/queue/token/:tokenNumber` — Look up a specific token's position in queue (public)

**getQueueToday Controller Logic:**
1. Find the Queue document for today's date (match by date only, ignore time)
2. If no queue document exists yet (no bookings today), return a "Queue is empty" response
3. Populate the queueList with appointment details (customer name, service name, stylist, status)
4. Calculate position of each token in the queue
5. Calculate estimated wait for each position: position × averageServiceDurationMinutes
6. Return: currentTokenBeingServed, totalTokensIssued, queue list with positions and wait times

**advanceQueue Controller Logic (Admin only):**
1. Find today's Queue document
2. Find the current token in the queueList — set its appointment status to 'completed'
3. Remove it from the front of the queueList
4. Set currentTokenBeingServed to the tokenNumber of the next appointment in the list
5. If queueList is now empty, set currentTokenBeingServed to null
6. Set the next appointment's status to 'in-progress'
7. Save the Queue document
8. Return updated queue state

**getTokenPosition Controller Logic:**
1. Receive tokenNumber from URL param
2. Find the appointment with that tokenNumber
3. Find today's Queue document
4. Find the index of that appointment in queueList
5. Return: tokenNumber, position in queue, how many people are ahead, estimated wait time

---

## SECTION 3 — PERSON B BACKEND WORK

### Features Assigned to Person B:
1. Reviews API
2. Packages & Promo Codes API
3. AI Hairstyle Advisor API
4. Gallery Upload API
5. Enquiry/Contact API
6. Admin Analytics API

---

### B1 — Reviews API

**Files:** `models/Review.js`, `routes/review.routes.js`, `controllers/review.controller.js`

**Review Model Fields:**
- `customerName` — String, required
- `rating` — Number, required, min: 1, max: 5
- `comment` — String, required, minLength: 20
- `serviceAvailed` — String (name of service, not an ID — easier for display)
- `isApproved` — Boolean, default: false (admin must approve before showing publicly)
- `createdAt` — Date, default: Date.now

**Routes:**
- `GET /api/reviews` — Get all approved reviews (`isApproved: true`), with optional filter `?rating=5` and sort `?sort=recent`
- `GET /api/reviews/summary` — Get rating breakdown (count per star level + average + total)
- `POST /api/reviews` — Submit a new review (public — sets isApproved to false by default)
- `GET /api/admin/reviews/pending` — Admin: get reviews awaiting approval (protected)
- `PATCH /api/admin/reviews/:id/approve` — Admin: approve a review (protected)
- `DELETE /api/admin/reviews/:id` — Admin: reject/delete a review (protected)

**getReviews Controller Logic:**
1. Build a query filter object: `{ isApproved: true }`
2. If `rating` query param is provided, add it to filter
3. Determine sort order based on `sort` query param:
   - `recent` → sort by createdAt descending
   - `highest` → sort by rating descending
   - `lowest` → sort by rating ascending
4. Implement pagination: accept `page` and `limit` query params (default: page=1, limit=10)
5. Use `.skip((page-1) * limit).limit(limit)` on the query
6. Return reviews array + `totalCount` (for frontend to calculate total pages)

**getReviewSummary Controller Logic:**
1. Fetch all approved reviews (just rating field for efficiency)
2. Calculate total count
3. Calculate average rating (sum of all ratings / total count), round to 1 decimal
4. Count reviews per star level (1 through 5)
5. Calculate percentage for each level (count / total * 100)
6. Return: `{ average, total, breakdown: { 5: {count, percentage}, 4: {...}, ... } }`

---

### B2 — Packages & Promo Codes API

**Files:** `models/Package.js`, `models/PromoCode.js`, `routes/package.routes.js`, `controllers/package.controller.js`

**Package Model Fields:**
- `name` — String, required
- `type` — String, enum: ['combo', 'membership'], required
- `description` — String
- `includedServices` — Array of Strings (service names — for display)
- `originalPrice` — Number
- `discountedPrice` — Number, required
- `savingsAmount` — Number (calculated: originalPrice - discountedPrice)
- `validityDays` — Number (e.g., 30 for combos, 30 for monthly memberships)
- `badge` — String (e.g., "Best Value", "Most Popular")
- `isActive` — Boolean, default: true

**PromoCode Model Fields:**
- `code` — String, required, unique, uppercase
- `discountType` — String, enum: ['percentage', 'flat'], required
- `discountValue` — Number, required (e.g., 20 for 20%, or 100 for ₹100 flat)
- `minOrderValue` — Number, default: 0
- `expiryDate` — Date, required
- `maxUsageCount` — Number, required
- `usedCount` — Number, default: 0
- `isActive` — Boolean, default: true
- `description` — String (shown on offers page)

**Package Routes:**
- `GET /api/packages` — Get all active packages, filter by `?type=combo` or `?type=membership`
- `GET /api/packages/:id` — Get single package
- `POST /api/packages` — Admin: create package (protected)
- `PATCH /api/packages/:id` — Admin: update package (protected)
- `DELETE /api/packages/:id` — Admin: deactivate (soft delete) package (protected)

**Promo Code Routes:**
- `POST /api/promo/validate` — Public: validate a promo code and return discount details
- `GET /api/admin/promos` — Admin: list all promo codes (protected)
- `POST /api/admin/promos` — Admin: create a new promo code (protected)
- `PATCH /api/admin/promos/:id` — Admin: activate/deactivate a code (protected)

**validatePromoCode Controller Logic:**
1. Receive `{ code, orderValue }` from request body
2. Convert code to uppercase
3. Find PromoCode in DB where `code` matches (case-insensitive) AND `isActive: true`
4. If not found → return 400 "Invalid promo code"
5. Check `expiryDate` — if expired → return 400 "This promo code has expired"
6. Check `usedCount < maxUsageCount` — if exceeded → return 400 "This promo code is no longer available"
7. Check `orderValue >= minOrderValue` — if not → return 400 "Minimum order value for this code is ₹X"
8. Calculate discount:
   - If `percentage`: discountAmount = (orderValue × discountValue) / 100
   - If `flat`: discountAmount = discountValue
   - finalPrice = orderValue - discountAmount (minimum 0)
9. Return 200 with `{ valid: true, discountAmount, finalPrice, description }`
10. NOTE: Do NOT increment usedCount here — only increment when appointment is actually created

---

### B3 — AI Hairstyle Advisor API

**Files:** `routes/ai.routes.js`, `controllers/ai.controller.js`

**No model needed** — this feature does not store anything in DB (photo is analyzed and discarded).

**Route:**
- `POST /api/ai/hairstyle` — Receive image, send to Claude API, return suggestions

**Middleware on this route:**
- `upload.single('photo')` (Multer middleware) — handles the uploaded image file
- Rate limiting: add a simple counter in memory (or using a small middleware) to allow max 5 requests per IP per hour — prevents API cost abuse

**Controller Logic (most interesting part of the backend):**

1. Check if a file was uploaded via Multer (`req.file`) — if not, return 400 "Please upload a photo"
2. Validate file type: only allow image/jpeg, image/png, image/webp — return 400 if invalid type
3. Validate file size: max 5MB — return 400 if too large
4. Read the uploaded file from disk and convert it to base64 using `fs.readFileSync()` + `Buffer.toString('base64')`
5. Get the face shape hint from request body if provided: `req.body.faceShape` (optional)
6. Build the Claude API prompt:
   - System: "You are a professional hairstylist. Analyze the face in the image and respond only in valid JSON format. No markdown, no explanation outside the JSON."
   - User message content: an array with the base64 image object AND a text prompt:
     - If faceShape hint was given: "The user believes their face shape is [faceShape]. Confirm or correct this, then recommend 5 hairstyles."
     - If no hint: "Detect the face shape from this image and recommend 5 hairstyles."
     - "For each suggestion return an object with: name (string), description (2 sentences max), suitableFor (face shape name), recommendedLength (short/medium/long), stylingTip (one sentence)."
     - "Respond with exactly this JSON: { faceShapeDetected: string, suggestions: [array of 5 objects] }"
7. Call the Anthropic SDK:
   - Model: `claude-sonnet-4-20250514`
   - Max tokens: 1000
   - Pass the image as a base64 source block with the correct media_type
8. Parse the response text as JSON (wrap in try-catch — if Claude returns non-JSON, return 500 with a friendly message)
9. Delete the uploaded file from disk after processing (clean up) using `fs.unlinkSync(req.file.path)`
10. Return 200 with `{ success: true, data: { faceShapeDetected, suggestions } }`

**Upload Middleware (`middleware/upload.middleware.js`):**
- Configure Multer with `diskStorage`:
  - `destination`: save to `uploads/ai-photos/`
  - `filename`: generate a unique name using `Date.now() + '-' + Math.random()`
- Set file size limit: 5MB
- Set file filter: only allow jpeg, png, webp
- Export two Multer instances:
  - `uploadAIPhoto` — for the AI advisor route (single file, field name: 'photo')
  - `uploadGalleryImage` — for gallery uploads (single file, field name: 'image')

---

### B4 — Gallery API

**Files:** `models/GalleryItem.js`, `routes/gallery.routes.js`, `controllers/gallery.controller.js`

**GalleryItem Model Fields:**
- `imageUrl` — String, required (relative path: `/uploads/gallery/filename.jpg`)
- `caption` — String
- `category` — String, enum: ['Hair Colour', 'Haircuts', 'Bridal', 'Skin', 'Nails', 'Salon Interior']
- `stylistName` — String
- `serviceName` — String
- `uploadedByAdmin` — Boolean, default: false (false = submitted by customer, needs review)
- `isApproved` — Boolean, default: false
- `createdAt` — Date, default: Date.now

**Routes:**
- `GET /api/gallery` — Get all approved gallery items, filter by `?category=Haircuts`
- `POST /api/gallery` — Customer: upload a photo for review (public, needs approval)
- `POST /api/admin/gallery` — Admin: upload official gallery image (protected — auto-approved)
- `DELETE /api/admin/gallery/:id` — Admin: delete a gallery image (protected)
- `PATCH /api/admin/gallery/:id/approve` — Admin: approve customer-submitted photo (protected)

**getGallery Controller Logic:**
1. Query: `{ isApproved: true }`
2. If `category` query param provided, add to filter
3. Sort by createdAt descending (newest first)
4. Return array of items with imageUrl, caption, category, stylistName

**uploadGalleryImage Controller Logic (Customer):**
1. Check that `req.file` exists (Multer result)
2. Get optional `category`, `caption`, `stylistName` from req.body
3. Create GalleryItem with `isApproved: false`, `uploadedByAdmin: false`
4. Save imageUrl as `/uploads/gallery/${req.file.filename}`
5. Return 201 "Photo submitted for review. It will appear in the gallery once approved."

**Admin Upload Controller Logic:**
1. Same as above but set `isApproved: true` and `uploadedByAdmin: true` automatically
2. No approval step needed

---

### B5 — Enquiry / Contact API

**Files:** `models/Enquiry.js`, `routes/enquiry.routes.js`, `controllers/enquiry.controller.js`

**Enquiry Model Fields:**
- `name` — String, required
- `email` — String, required
- `phone` — String
- `subject` — String, enum: ['General Enquiry', 'Appointment Help', 'Feedback', 'Partnership', 'Other']
- `message` — String, required, minLength: 10
- `isRead` — Boolean, default: false
- `createdAt` — Date, default: Date.now

**Routes:**
- `POST /api/enquiry` — Submit a contact form (public)
- `GET /api/admin/enquiries` — Admin: get all enquiries (protected), filter by `?isRead=false`
- `PATCH /api/admin/enquiries/:id/read` — Admin: mark as read (protected)
- `DELETE /api/admin/enquiries/:id` — Admin: delete an enquiry (protected)

**submitEnquiry Controller Logic:**
1. Validate required fields: name, email, message
2. Validate email format using a simple regex
3. Validate message length: minimum 10 characters
4. Create and save Enquiry document
5. Return 201 "Your message has been received. We'll get back to you within 24 hours."

---

### B6 — Admin Analytics API

**Files:** Add `admin.routes.js` + `admin.controller.js` (or add analytics to existing controllers)

**Route:**
- `GET /api/admin/analytics` — Protected (admin only)

**Analytics Controller Logic:**
1. Calculate the following using MongoDB aggregation or multiple parallel queries:

   - `bookingsToday`: Count of appointments where `date` is today AND status is not 'cancelled'
   - `revenueToday`: Sum of `finalPrice` for all completed appointments today
   - `queueLength`: Count of appointments in today's Queue.queueList where status is not 'completed'
   - `averageRating`: Calculate from approved reviews (sum of ratings / total approved reviews), round to 1 decimal
   - `totalBookingsThisMonth`: Count of all non-cancelled appointments this calendar month
   - `revenueThisMonth`: Sum of finalPrice for completed appointments this month
   - `topService`: The service name that appears most frequently in appointments this month
   - `pendingReviews`: Count of reviews where isApproved is false
   - `unreadEnquiries`: Count of enquiries where isRead is false

2. Run these as parallel queries using `Promise.all([query1, query2, ...])` for efficiency
3. Return all stats in one response object

---

## SECTION 4 — Shared Backend Responsibilities

### Person A Shared Tasks
- Full project scaffolding (folder structure, package.json, server.js, db.js, .gitignore, .env.example)
- The `seed.js` script — ensures both members can start with populated data from Day 1
- Define the `auth.middleware.js` (protect + adminOnly) — both members will use these on their protected routes
- Define the response format standard and share with Person B before they start writing controllers

### Person B Shared Tasks
- Define the `upload.middleware.js` (Multer) — both gallery and AI routes use this
- Create `uploads/` directory and add a `.gitkeep` file inside each subfolder so Git tracks the empty folder
- Write a shared test checklist in Postman so both members can verify each other's routes work correctly before connecting to frontend

---

## SECTION 5 — Backend Rules to Remember (Must-Follow)

1. Never store plain text passwords. Always hash with `bcryptjs.hash(password, 10)` before saving.
2. Never return the `passwordHash` field in any API response. Use `.select('-passwordHash')` in Mongoose queries.
3. All admin routes must use the `protect` middleware. Test by calling without a token — it must return 401.
4. Always validate request body fields in the controller before touching the database.
5. Wrap every controller in `try-catch`. A single uncaught error must not crash the entire server.
6. Use `mongoose.Types.ObjectId.isValid(id)` before any `findById(id)` query — return 400 if the ID format is invalid.
7. Soft delete preferred over hard delete: set `isActive: false` or `isApproved: false` instead of removing documents. Exceptions: gallery image admin delete, review reject (these actually remove the document).
8. Every Mongoose schema must have `timestamps: true` OR a manual `createdAt` field. Never create a document without a creation date.
9. When returning a list, always include a count. Frontend needs it for pagination and stats.
10. Don't put business logic inside route files. Routes only map paths to controller functions. Logic goes in controllers.
11. The seed script must be idempotent — running it twice should not create duplicate data (use `deleteMany` before `insertMany`).
12. Use `Promise.all()` for parallel DB queries in analytics. Never chain sequential `await` calls when queries are independent.
13. Image files in `uploads/` must not be committed to Git. They are in `.gitignore`.
14. When the AI API call fails, return a helpful error message — "AI service is temporarily unavailable. Please try again." — not a raw error stack trace.
15. Test every route in Postman before telling the frontend team it's ready to connect.

---

## SECTION 6 — Postman Testing Checklist (Both Members)

Before connecting any route to the frontend, test the following in Postman:

**Auth:**
- POST /api/auth/login with correct credentials → should return 200 + token
- POST /api/auth/login with wrong password → should return 401
- GET any protected route without Authorization header → should return 401
- GET any protected route with valid token → should return 200

**Services:**
- GET /api/services → returns array of active services
- GET /api/services?category=Hair → returns only Hair services
- POST /api/services without token → returns 401
- POST /api/services with admin token + valid body → returns 201 with new service

**Appointments:**
- POST /api/appointments with valid data → returns 201 with tokenNumber
- POST /api/appointments with a Monday date → returns 400
- POST /api/appointments for an already-booked slot → returns 400
- GET /api/appointments/:id with valid ID → returns appointment details

**Queue:**
- GET /api/queue/today → returns queue state (or empty queue message)
- PATCH /api/queue/advance without token → returns 401
- PATCH /api/queue/advance with admin token → advances queue, returns updated state

**Promo:**
- POST /api/promo/validate with valid code → returns discount details
- POST /api/promo/validate with expired code → returns 400

**AI Advisor:**
- POST /api/ai/hairstyle with an image file → returns JSON with faceShapeDetected and 5 suggestions
- POST /api/ai/hairstyle without a file → returns 400

**Reviews:**
- GET /api/reviews → returns only approved reviews
- POST /api/reviews with valid body → returns 201 pending approval message
- GET /api/reviews/summary → returns rating breakdown with average and per-star counts
