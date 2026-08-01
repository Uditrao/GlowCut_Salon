# GlowCut Salon — Full-Stack Web Application

> Internship Project | Triyuga Soft Tech Pvt. Ltd.
> Role: Web Design & Development Intern

GlowCut Salon is a production-style full-stack multi-page salon web application featuring real-time digital queue token management, automated 30-minute time slot booking, combo packages & memberships, customer review moderation, and an AI-powered hairstyle advisor.

---

## 🌟 Key Features

1. **Multi-Page Responsive Frontend**: 11 HTML5 pages built with custom CSS3 variables, typography, glassmorphism UI, and Flexbox/Grid.
2. **Real-Time Live Queue Management**: Digital token issuance (e.g. `A-007`) with 10-second live polling (`setInterval`), token search lookup, and admin queue advancement.
3. **Multi-Step Appointment Booking**: Service -> Stylist & 30-min Slot Picker -> Details & Promo Code -> Printable Digital Token Ticket.
4. **AI Hairstyle Advisor**: Photo upload analysis powered by Anthropic Claude 3.5 Sonnet Vision API (with fallback offline recommendation engine).
5. **Combos, Memberships & Promo Codes**: Combo package deals, Silver/Gold/Platinum VIP tiers, and real-time promo code validation tool (`/api/promo/validate`).
6. **Reviews & Rating Breakdown**: Star breakdown statistics, customer review submission, and admin approval pipeline.
7. **Admin Portal**: JWT authentication guard, live dashboard analytics, floor queue controller ("Mark Done -> Call Next"), review moderation, and contact enquiry inbox.

---

## 📂 Project Architecture

```
d:\Salon/
├── backend/
│   ├── config/          # MongoDB connection logic (db.js)
│   ├── controllers/     # Business logic for all 12 controllers
│   ├── middleware/      # JWT protection & Multer upload handling
│   ├── models/          # 10 Mongoose Schemas (User, Service, Stylist, etc.)
│   ├── routes/          # Express route definitions
│   ├── seed/            # Seeding script for demo data (seed.js)
│   ├── uploads/         # Local file storage (gallery & AI photos)
│   ├── .env.example     # Environment template
│   ├── package.json     # Node.js dependencies
│   └── server.js        # Express app entry point
│
└── frontend/
    ├── css/             # Custom CSS design system (variables.css, global.css, page styles)
    ├── js/              # Central API utility (api.js) & page scripts
    ├── index.html       # Home page with live queue widget
    ├── services.html    # Services menu & sortable price table
    ├── offers.html      # Combos, memberships & promo code tester
    ├── book.html        # Multi-step booking wizard & token ticket
    ├── queue.html       # Real-time queue status & token lookup
    ├── gallery.html     # Masonry portfolio & before/after sliders
    ├── ai-advisor.html  # AI Hairstyle Advisor with vision analysis
    ├── reviews.html     # Ratings breakdown & review submission
    ├── about.html       # Brand story & team showcase
    ├── contact.html     # Contact details, map embed & enquiry form
    └── admin.html       # Admin portal & floor queue manager
```

---

## 🚀 How to Run the Application

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **MongoDB** (running locally on port `27017` or a MongoDB Atlas URI)

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# (Optional) Pre-fill database with demo services, stylists, packages & admin account
npm run seed

# Start development server
npm run dev
```
The server will launch at `http://localhost:5000`.

### 3. Frontend Setup
Option A: Open any HTML file (e.g. `frontend/index.html`) directly in your browser or via VS Code Live Server extension.  
Option B: Access directly through Express static server at `http://localhost:5000/index.html`.

### 4. Admin Credentials
- **URL**: `http://localhost:5000/admin.html`
- **Email**: `admin@glowcut.in`
- **Password**: `admin123`
