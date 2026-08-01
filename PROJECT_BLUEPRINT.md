# GlowCut Salon — Complete Project Blueprint

> Internship Project | Triyuga Soft Tech Pvt. Ltd.
> Role: Web Design & Development Intern
> Team Size: 2 Members

---

## 1. Project Overview

**Project Name:** GlowCut Salon Website
**Type:** Full-Stack Multi-Page Web Application
**Goal:** Build a complete, production-style salon website that includes online appointment booking, a real-time waiting queue display, customer reviews, combo packages & offers, and an AI-powered hairstyle advisor — demonstrating all skills relevant to Triyuga Softtech's core client services.

**Why This Project Fits Triyuga Softtech:**
Triyuga builds websites for Indian SMBs across beauty, retail, healthcare, and services. A salon website covers responsive web design, form handling, booking systems, e-commerce-style pricing pages, SEO-ready content structure, and client-facing UI — exactly what they deliver daily.

---

## 2. Feature Decisions (What We Are & Are Not Building)

### Features We Are Building

| Feature | Reason |
|---|---|
| Multi-page responsive website | Core web design skill |
| Appointment booking system | Real-world client requirement |
| Waiting queue with token display | Unique, impressive, practical |
| Customer review & rating system | Standard for service businesses |
| Services & pricing page | Core salon requirement |
| Combo packages & membership plans | E-commerce/offer logic skill |
| Seasonal discount banners with promo codes | Marketing feature |
| AI Hairstyle Advisor | Easy — single Claude API call with image |
| Basic admin panel | Needed to manage queue & appointments |
| Contact page with enquiry form | Standard deliverable |
| Gallery page | Visual showcase |
| About Us & Stylists page | Trust-building |

### Features We Are NOT Building (Too Complex)

| Dropped Feature | Reason Dropped |
|---|---|
| AR Try-On Filter (virtual hairstyle overlay) | Requires computer vision + AR rendering libraries. Very complex, not feasible for internship timeline. |
| Live payment gateway integration | Requires RBI compliance, test accounts, complex error handling. |
| SMS/Email OTP verification | Requires paid third-party APIs and backend config beyond scope. |

### AI Hairstyle Advisor — Decision: KEEP IT

This feature is very easy to implement. The user uploads a photo → the frontend sends the image as base64 to the backend → backend calls Anthropic Claude API (claude-sonnet model with vision) with a prompt asking for face shape detection and hairstyle recommendations → the API returns a structured text response → frontend displays the top 5 suggestions with descriptions and reference image names.

No complex libraries. No training data. Just one API call. This feature alone will make the project stand out when presented to the Triyuga team.

---

## 3. Tech Stack

### Frontend
- **HTML5** — semantic structure for all pages
- **CSS3** — custom CSS with CSS variables for theming, Flexbox and Grid for layout
- **Vanilla JavaScript** — DOM manipulation, fetch API calls, form validation, queue polling
- **No frontend framework** — keeps it simple and shows raw skills (React/Vue is overkill here)
- **Font Awesome 6** — icons throughout the UI
- **Google Fonts** — Playfair Display (headings) + Poppins (body text)

### Backend
- **Node.js** — runtime environment
- **Express.js** — web framework for API routes
- **MongoDB** — NoSQL database (flexible schema, easy to set up locally)
- **Mongoose** — ODM for MongoDB to define schemas and models
- **JSON Web Tokens (JWT)** — for admin authentication
- **Multer** — for handling image uploads (gallery + AI advisor photos)
- **dotenv** — for managing environment variables (API keys, DB string)
- **cors** — to allow frontend-backend communication during development
- **Anthropic Node.js SDK** — for the AI hairstyle advisor feature

### Development Tools
- **VS Code** — IDE
- **Git + GitHub** — version control and collaboration
- **MongoDB Compass** — GUI to view database during development
- **Postman** — to test all backend API routes before connecting frontend
- **Live Server (VS Code extension)** — for frontend development
- **Nodemon** — auto-restart backend server on file changes

---

## 4. Project Folder Structure

```
glowcut-salon/
│
├── frontend/                        # All HTML, CSS, JS files
│   ├── index.html                   # Home page
│   ├── services.html                # Services & Pricing
│   ├── offers.html                  # Packages & Offers
│   ├── book.html                    # Appointment Booking
│   ├── queue.html                   # Queue Status (public)
│   ├── gallery.html                 # Photo Gallery
│   ├── ai-advisor.html              # AI Hairstyle Advisor
│   ├── reviews.html                 # Reviews & Nearby Salons
│   ├── about.html                   # About Us & Team
│   ├── contact.html                 # Contact Page
│   ├── admin.html                   # Admin Panel
│   │
│   ├── css/
│   │   ├── variables.css            # All CSS custom properties (colors, fonts, spacing)
│   │   ├── global.css               # Reset, base styles, navbar, footer
│   │   ├── home.css
│   │   ├── services.css
│   │   ├── offers.css
│   │   ├── book.css
│   │   ├── queue.css
│   │   ├── gallery.css
│   │   ├── ai-advisor.css
│   │   ├── reviews.css
│   │   ├── about.css
│   │   ├── contact.css
│   │   └── admin.css
│   │
│   ├── js/
│   │   ├── api.js                   # Centralized fetch functions to call backend
│   │   ├── home.js
│   │   ├── services.js
│   │   ├── offers.js
│   │   ├── book.js
│   │   ├── queue.js                 # Polls backend every 10 seconds for queue update
│   │   ├── gallery.js
│   │   ├── ai-advisor.js
│   │   ├── reviews.js
│   │   ├── about.js
│   │   ├── contact.js
│   │   └── admin.js
│   │
│   └── assets/
│       ├── images/                  # All static images used in pages
│       ├── hairstyles/              # Reference hairstyle images for AI advisor suggestions
│       └── icons/                   # Any custom SVG icons
│
├── backend/                         # Node.js + Express server
│   ├── server.js                    # Entry point — starts the Express server
│   ├── .env                         # Environment variables (never commit this)
│   ├── .env.example                 # Template showing what .env variables are needed
│   │
│   ├── config/
│   │   └── db.js                    # MongoDB connection logic
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   ├── Service.js
│   │   ├── Stylist.js
│   │   ├── Package.js
│   │   ├── PromoCode.js
│   │   ├── Review.js
│   │   ├── Queue.js
│   │   └── Enquiry.js
│   │
│   ├── routes/                      # Express route files
│   │   ├── auth.routes.js
│   │   ├── appointment.routes.js
│   │   ├── queue.routes.js
│   │   ├── service.routes.js
│   │   ├── stylist.routes.js
│   │   ├── package.routes.js
│   │   ├── promo.routes.js
│   │   ├── review.routes.js
│   │   ├── ai.routes.js
│   │   ├── gallery.routes.js
│   │   └── enquiry.routes.js
│   │
│   ├── controllers/                 # Business logic for each route
│   │   ├── auth.controller.js
│   │   ├── appointment.controller.js
│   │   ├── queue.controller.js
│   │   ├── service.controller.js
│   │   ├── stylist.controller.js
│   │   ├── package.controller.js
│   │   ├── promo.controller.js
│   │   ├── review.controller.js
│   │   ├── ai.controller.js
│   │   ├── gallery.controller.js
│   │   └── enquiry.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js       # JWT verification — protect admin routes
│   │   └── upload.middleware.js     # Multer config for image uploads
│   │
│   └── seed/
│       └── seed.js                  # Script to pre-fill DB with demo services, stylists, packages
│
├── README.md                        # How to run the project
└── package.json                     # Backend dependencies
```

---

## 5. All Website Pages — Summary

| Page | URL | Purpose |
|---|---|---|
| Home | `/index.html` | Hero, services overview, offers strip, testimonials, stats |
| Services & Pricing | `/services.html` | All services with prices, duration, categories |
| Offers & Packages | `/offers.html` | Combo deals, memberships, seasonal discounts, promo codes |
| Book Appointment | `/book.html` | Multi-step booking form — service → stylist → date/time → confirm |
| Queue Status | `/queue.html` | Token number, queue position, estimated wait time, live updates |
| Gallery | `/gallery.html` | Filterable photo gallery of salon work |
| AI Hair Advisor | `/ai-advisor.html` | Upload photo → get AI hairstyle suggestions |
| Reviews | `/reviews.html` | Customer reviews, ratings, nearby salon comparison cards |
| About Us | `/about.html` | Salon story, team stylists, certifications |
| Contact | `/contact.html` | Address, map embed, phone, hours, enquiry form |
| Admin Panel | `/admin.html` | Manage queue tokens, view/update appointments, analytics |

---

## 6. Database Collections (MongoDB)

### Users
Stores customer details from the booking form. Admin users have a separate role flag.
Fields: name, email, phone, role (customer/admin), passwordHash, createdAt

### Services
Each service offered by the salon.
Fields: name, category (Hair/Skin/Nails/Makeup), description, price, durationMinutes, imageUrl, isActive

### Stylists
Individual stylists at the salon.
Fields: name, photo, specializations (array), experience (years), bio, isAvailable

### Appointments
One document per booked appointment.
Fields: customerName, customerPhone, customerEmail, serviceId, stylistId, date, timeSlot, status (pending/confirmed/in-progress/completed/cancelled), tokenNumber, createdAt

### Queue
Tracks the live queue state for the day.
Fields: date, currentTokenBeingServed, totalTokensIssued, averageServiceDurationMinutes, queueList (array of appointment IDs in order)

### Packages
Combo deals and membership plans.
Fields: name, type (combo/membership), description, includedServices (array of service IDs), originalPrice, discountedPrice, validityDays, badge (e.g. "Best Value"), isActive

### PromoCodes
Discount promo codes.
Fields: code, discountType (percentage/flat), discountValue, minOrderValue, expiryDate, maxUsageCount, usedCount, isActive

### Reviews
Customer reviews for the salon.
Fields: customerName, rating (1-5), comment, serviceAvailed, date, isApproved

### Enquiries
Contact form submissions.
Fields: name, email, phone, subject, message, createdAt, isRead

---

## 7. Key API Endpoints Summary

| Method | Endpoint | What It Does |
|---|---|---|
| POST | `/api/auth/login` | Admin login |
| GET | `/api/services` | Get all services |
| GET | `/api/stylists` | Get all stylists |
| GET | `/api/stylists/:id/availability` | Get available slots for a stylist on a date |
| POST | `/api/appointments` | Book a new appointment — issues a token |
| GET | `/api/appointments/:id` | Get appointment details by ID |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |
| GET | `/api/queue/today` | Get today's full queue status |
| PATCH | `/api/queue/advance` | Admin: mark current token as done, advance queue |
| GET | `/api/packages` | Get all packages and combos |
| POST | `/api/promo/validate` | Validate a promo code and return discount value |
| GET | `/api/reviews` | Get all approved reviews |
| POST | `/api/reviews` | Submit a new review |
| POST | `/api/ai/hairstyle` | Send image → get hairstyle suggestions from Claude API |
| GET | `/api/gallery` | Get all gallery images |
| POST | `/api/gallery` | Admin: upload a new gallery image |
| POST | `/api/enquiry` | Submit a contact form enquiry |
| GET | `/api/admin/appointments` | Admin: get all appointments for a date |
| GET | `/api/admin/analytics` | Admin: get basic stats (bookings today, avg rating, revenue) |

---

## 8. Offers & Pricing Structure

### Individual Services (Examples — seed this into DB)

**Hair Services**
- Women's Haircut — ₹299 (30 min)
- Men's Haircut — ₹149 (20 min)
- Hair Wash + Blowdry — ₹249 (45 min)
- Hair Colour (Global) — ₹999 (90 min)
- Keratin Treatment — ₹2499 (120 min)
- Hair Spa — ₹599 (60 min)

**Skin Services**
- Basic Facial — ₹499 (45 min)
- De-Tan Treatment — ₹399 (30 min)
- Cleanup — ₹299 (30 min)

**Nail & Other**
- Manicure — ₹349 (30 min)
- Pedicure — ₹449 (45 min)
- Eyebrow Threading — ₹49 (10 min)
- Waxing (Arms) — ₹199 (20 min)

### Combo Packages

| Package Name | Includes | Original Price | Offer Price | Badge |
|---|---|---|---|---|
| Bridal Glow Combo | Facial + Hair Wash + Manicure + Pedicure | ₹1,646 | ₹1,199 | Save 27% |
| Party Ready Combo | Haircut + Blowdry + Eyebrows | ₹597 | ₹449 | Popular |
| Full Body Refresh | De-Tan + Waxing Arms + Pedicure | ₹1,047 | ₹799 | Weekend Deal |
| Men's Grooming Pack | Men's Haircut + Facial + Manicure | ₹997 | ₹699 | Men's Special |

### Membership Plans

| Plan | Monthly Fee | Benefits |
|---|---|---|
| Silver | ₹499/month | 10% off all services, priority booking |
| Gold | ₹999/month | 20% off all services, 1 free haircut/month, priority queue |
| Platinum | ₹1,999/month | 30% off, 2 free services/month, dedicated stylist, skip queue |

### Seasonal Offers (Static banners, toggle active in DB)
- Diwali Special: 20% off all colour services — use code DIWALI20
- New Year Glow: Bridal Combo at ₹999 — limited slots
- Sunday Funday: Flat ₹100 off on orders above ₹500 — every Sunday

---

## 9. Queue & Appointment System Logic

### How It Works (Step by Step)

1. Customer fills the booking form and submits.
2. System checks stylist availability for the selected date and time slot.
3. If slot is available, an Appointment document is created with status "confirmed".
4. A token number is auto-assigned based on the date's Queue document (increment totalTokensIssued by 1).
5. The customer receives their token number on screen (e.g., Token #A-007).
6. On the Queue Status page, any visitor can see:
   - Which token is currently being served (e.g., "Now Serving: A-005")
   - How many people are ahead in the queue
   - Estimated wait time (people ahead × average service time)
   - A visual progress bar showing queue position
7. The admin panel has a simple "Mark as Done → Call Next" button.
8. When admin clicks it, the Queue document updates currentTokenBeingServed, the frontend polling script (runs every 10 seconds via `setInterval`) picks up the change and updates the display automatically.

### Time Slot Rules
- Slots are 30-minute blocks: 10:00, 10:30, 11:00 ... until 8:00 PM
- Each stylist can only have one appointment per time slot
- If a slot is booked, it should appear as "Unavailable" in the time picker
- Sundays: salon closes at 6:00 PM
- Monday: closed (no slots available)

---

## 10. AI Hairstyle Advisor — How to Implement

### User Flow
1. User lands on `/ai-advisor.html`
2. User uploads a clear face photo using a file input
3. User optionally selects their face shape manually (Round / Oval / Square / Heart / Long) as a hint
4. User clicks "Get My Style Suggestions"
5. Frontend converts image to base64, sends POST request to `/api/ai/hairstyle`
6. Backend receives image, sends to Claude API with a carefully written prompt
7. Claude returns a structured response with 5 hairstyle suggestions
8. Frontend parses and displays each suggestion as a card with name, description, and a pre-saved reference image

### Claude API Prompt Structure (for backend controller)
Send the user's image + a system prompt like:
"You are a professional hairstylist and beauty consultant. Analyze the face shape in this image and recommend 5 hairstyles that would look great on this person. For each suggestion, provide: the hairstyle name, a 2-sentence description of why it suits this face shape, and the best hair length. Format your response as a JSON array of 5 objects, each with fields: name, description, suitableFor, recommendedLength."

### Reference Images
Pre-save 15-20 named hairstyle reference images in `frontend/assets/hairstyles/`.
When Claude returns a suggestion with a name like "Layered Bob", map it to the closest reference image file.

---

## 11. Work Split Summary

### Frontend
| Person A | Person B |
|---|---|
| Home Page | Gallery Page |
| Services & Pricing | AI Hair Advisor |
| Offers & Packages | Reviews Page |
| Book Appointment (multi-step) | About Us |
| Queue Status Page | Contact Page |
| Shared: Navbar, Footer, variables.css, global.css | Shared: Admin Panel, Toast notifications, Mobile menu |

### Backend
| Person A | Person B |
|---|---|
| Project setup, DB connection, server.js | Reviews API |
| Auth API (admin login + JWT) | Packages & Promo Codes API |
| Appointments API (full CRUD) | AI Hairstyle Advisor API |
| Queue Management API | Gallery Upload API |
| Services API | Enquiry/Contact API |
| Stylists & Availability API | Admin Analytics & Admin Appointments API |

---

## 12. Development Timeline (Suggested — 3 Weeks)

### Week 1 — Setup & Core Pages
- Day 1-2: Setup GitHub repo, folder structure, DB connection, seed data, global CSS/theme
- Day 3-4: Home page (both members), Services page
- Day 5: Offers page, Book Appointment page layout

### Week 2 — Functionality
- Day 1-2: Booking form working (frontend + backend connected), Queue status page
- Day 3: Reviews page, Gallery page
- Day 4: AI Advisor page + API connected
- Day 5: About + Contact + Admin panel

### Week 3 — Polish & Presentation
- Day 1-2: Bug fixes, mobile responsiveness check on all pages
- Day 3: Fill in demo data, test full user journey (book → queue → admin advance)
- Day 4: README, cleanup, test on different screen sizes
- Day 5: Final presentation prep

---

## 13. GitHub Collaboration Rules (Important)

- Create one GitHub repository, both members are added as collaborators
- Use two branches: `main` (stable) and `dev` (working branch)
- Each person creates their own feature branch off `dev` (e.g., `feature/booking-page`, `feature/reviews-api`)
- After finishing a feature, raise a Pull Request into `dev`
- Merge into `main` only when the feature is tested and working
- Commit messages should be clear: `feat: add queue polling logic` not `updated stuff`
- Never commit the `.env` file — add it to `.gitignore` immediately

---

## 14. .env Variables Needed

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/glowcut
JWT_SECRET=your_secret_key_here
ANTHROPIC_API_KEY=your_claude_api_key_here
```

---

## 15. What Makes This Project Stand Out for Triyuga

- Real-world use case (salons are a genuine Triyuga client type)
- Live queue system — something most student projects don't have
- AI feature (Claude API) — shows awareness of modern tech
- Admin panel — shows full-stack thinking, not just frontend
- Mobile responsive — directly mirrors what Triyuga delivers to clients
- Combo packages & promo codes — mirrors e-commerce logic Triyuga uses
- Clean folder structure — easy to extend and maintain (professional habit)
