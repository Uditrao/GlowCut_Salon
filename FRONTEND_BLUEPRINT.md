# GlowCut Salon — Frontend Blueprint

> Internship Project | Triyuga Soft Tech Pvt. Ltd.
> Frontend Team: 2 Members (Person A + Person B)
> Stack: HTML5, CSS3, Vanilla JavaScript

---

## SECTION 1 — Design System & Theme Rules
### (Both members must read and follow this before writing a single line of CSS)

---

### 1.1 Color Palette

Define all colors once inside `css/variables.css` using CSS custom properties.
Every page must import `variables.css` first — never hardcode any color directly.

```
--color-primary:        #7B2150   /* Deep Burgundy — main brand color */
--color-primary-dark:   #561538   /* Darker shade for hover states */
--color-primary-light:  #F2D9E6   /* Light blush — section backgrounds */
--color-accent:         #C9A84C   /* Gold — highlights, badges, icons */
--color-accent-light:   #F5EDD5   /* Light gold — tag backgrounds */
--color-bg:             #FAF7F2   /* Cream white — main page background */
--color-bg-dark:        #1C1018   /* Near black — dark section backgrounds */
--color-text-dark:      #2C2C2C   /* Main body text */
--color-text-mid:       #666666   /* Subtext, captions */
--color-text-light:     #FFFFFF   /* Text on dark backgrounds */
--color-border:         #E8D5DF   /* Subtle borders */
--color-success:        #2E7D5B   /* Confirmation messages */
--color-error:          #C0392B   /* Error states */
--color-warning:        #D4870A   /* Warnings, "almost full" queue states */
```

---

### 1.2 Typography

Import from Google Fonts — add this link in the `<head>` of every HTML file:
`Playfair Display` (weights 400, 600, 700) + `Poppins` (weights 300, 400, 500, 600)

```
--font-heading:    'Playfair Display', Georgia, serif
--font-body:       'Poppins', sans-serif

--text-xs:    0.75rem    /* 12px — labels, fine print */
--text-sm:    0.875rem   /* 14px — captions, helper text */
--text-base:  1rem       /* 16px — default body */
--text-md:    1.125rem   /* 18px — slightly larger body */
--text-lg:    1.25rem    /* 20px — card titles */
--text-xl:    1.5rem     /* 24px — section subheadings */
--text-2xl:   2rem       /* 32px — section headings */
--text-3xl:   2.75rem    /* 44px — hero heading */
--text-4xl:   3.5rem     /* 56px — large hero (desktop only) */
```

**Rule:** All `<h1>` to `<h3>` use `--font-heading`. All body text, labels, buttons, nav links use `--font-body`.

---

### 1.3 Spacing Scale

```
--space-1:   0.25rem   /* 4px */
--space-2:   0.5rem    /* 8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
--space-24:  6rem      /* 96px */
```

**Rule:** Never write arbitrary pixel values for margin/padding. Always use these variables or multiples of 4px.

---

### 1.4 Border Radius & Shadows

```
--radius-sm:   6px
--radius-md:   12px
--radius-lg:   20px
--radius-xl:   32px
--radius-full: 9999px   /* Pill shape — for tags, badges */

--shadow-sm:   0 1px 4px rgba(0,0,0,0.08)
--shadow-md:   0 4px 16px rgba(123,33,80,0.10)
--shadow-lg:   0 8px 32px rgba(123,33,80,0.15)
--shadow-card: 0 2px 12px rgba(0,0,0,0.07)
```

---

### 1.5 Breakpoints (Mobile First)

Write base CSS for mobile, then override for larger screens using:

```
/* Tablet */
@media (min-width: 768px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1280px) { ... }
```

**Rule:** Every page must look good on 375px (iPhone SE), 768px (tablet), and 1280px (laptop). Test all three before marking a page done.

---

### 1.6 Reusable Component Classes (Define in global.css)

These classes are used across multiple pages — define them once, reuse everywhere.

**Buttons:**
- `.btn-primary` — Burgundy background, white text, gold hover border
- `.btn-outline` — Transparent background, burgundy border and text
- `.btn-gold` — Gold background, dark text — used for special offers/CTAs
- `.btn-sm` — Smaller padding variant
- `.btn-lg` — Larger padding variant

**Cards:**
- `.card` — White background, border-radius-md, shadow-card, padding-6
- `.card-hover` — Add to `.card` when card should lift on hover (transform + shadow-lg)

**Badges:**
- `.badge-gold` — Gold background, dark text, pill shape — for "Popular", "Best Value"
- `.badge-primary` — Burgundy background, white text
- `.badge-success` — Green, for "Confirmed" status
- `.badge-warning` — Amber, for "Almost Full" queue

**Section Layout:**
- `.section` — padding-top and padding-bottom of space-16 (64px)
- `.section-dark` — dark background (--color-bg-dark), light text
- `.section-blush` — light pink background (--color-primary-light)
- `.container` — max-width 1200px, centered, horizontal padding space-6

**Forms:**
- `.form-group` — wrapper div for label + input pair
- `.form-input` — consistent styling for all text inputs and selects
- `.form-label` — styled label above every input
- `.form-error` — red text below an invalid input field

**Stars:**
- `.star-rating` — display a visual 5-star rating using filled/empty star icons

---

### 1.7 Animation Rules

- Use CSS transitions, not JavaScript, for hover effects.
- `transition: all 0.25s ease` on buttons and cards.
- Use `@keyframes fadeInUp` for elements that animate when the page loads (hero text, stat counters).
- Use Intersection Observer API in JS to trigger `.animate-in` class when sections scroll into view.
- Keep animations subtle — do not use heavy bouncing or spinning effects.
- No animation on the queue status numbers — they must update cleanly and clearly.

---

### 1.8 Navigation Bar (global.css + global structure in every HTML file)

**Structure:**
- Logo on the far left (GlowCut wordmark + scissor icon)
- Nav links in the center: Home, Services, Offers, Book Now, Gallery, Reviews, About, Contact
- CTA button on the far right: "Book Appointment" in `.btn-primary`
- On mobile: hamburger icon replaces nav links, which slide in as a full-height sidebar

**Rules:**
- Navbar is sticky (stays at top while scrolling)
- Active page link is highlighted in `--color-primary`
- On scroll past 80px, navbar gets a white background + `--shadow-sm` (add via JS scroll event)
- The "Book Appointment" button in the navbar always links to `/book.html`

---

### 1.9 Footer (global.css)

**Four Columns:**
1. Logo + one-line tagline + social media icons (Instagram, Facebook, YouTube)
2. Quick Links — all page links
3. Services — list of top 6 services with links to services page
4. Contact Info — phone, email, address, working hours

**Bottom Bar:** Copyright text + "Made with Triyuga Soft Tech" credit

**Rules:**
- Footer background: `--color-bg-dark`
- Text: `--color-text-light` with reduced opacity for less important text
- Social icons: circle bordered, turn gold on hover
- Full responsive — stack to 2 columns on tablet, 1 column on mobile

---

### 1.10 Toast Notification (global JS)

Create a single `showToast(message, type)` function in `js/api.js`:
- Types: `success`, `error`, `info`
- Appears bottom-right corner
- Slides in, stays for 3 seconds, fades out
- Color matches type (green, red, blue)
- Used across all forms for feedback

---

## SECTION 2 — PERSON A FRONTEND WORK

### Pages Assigned to Person A:
1. Home Page (`index.html`)
2. Services & Pricing Page (`services.html`)
3. Offers & Packages Page (`offers.html`)
4. Book Appointment Page (`book.html`)
5. Queue Status Page (`queue.html`)
6. Shared Files: Navbar HTML snippet, Footer HTML snippet, `variables.css`, `global.css`

---

### Page A1 — Home Page (`index.html`)

**Purpose:** First impression of the salon. Communicate brand, services, offers, and drive bookings.

**Sections (in order from top to bottom):**

---

**A1.1 Hero Section**
- Full viewport height on desktop, 85vh on mobile
- Background: High-quality salon image with a dark overlay (rgba 0,0,0,0.45)
- Left-aligned content block (60% width on desktop, full on mobile):
  - Small gold tag above heading: "Delhi's Premium Salon"
  - H1 heading: "Look Stunning, Feel Confident" (Playfair Display, large)
  - Sub-text: One or two lines about the salon's promise
  - Two buttons side by side: "Book Appointment" (btn-primary) + "Explore Services" (btn-outline white)
- Right side: A stylish floating card showing "Today's Queue Status":
  - "Currently Serving: Token #A-005"
  - "Estimated Wait: 20 min"
  - This data is fetched live from `/api/queue/today`
  - Refresh icon to manually re-fetch
- Scroll-down indicator arrow at the bottom

---

**A1.2 Stats Bar**
- Dark background section (`--color-bg-dark`), horizontal row of 4 stats
- Stats: `2500+ Happy Clients` | `15+ Expert Stylists` | `10 Years Experience` | `4.8★ Rating`
- Each stat: large number in gold, label in small white text below
- Numbers animate from 0 to final value using a counter JS animation (trigger on scroll into view)

---

**A1.3 Our Services Overview**
- Section heading: "What We Do Best"
- Section sub-heading: Brief one-liner about expertise
- Grid of 6 service category cards (2 columns mobile, 3 columns tablet, 6 columns desktop):
  - Hair | Skin | Nails | Makeup | Spa | Men's
  - Each card: icon (Font Awesome), category name, short description, price starting from
  - On hover: card lifts, background turns light blush
  - Each card links to `/services.html#category-name`

---

**A1.4 How to Book — 3 Steps**
- Blush background section
- Heading: "Booking is Simple"
- Three horizontal steps with numbered icons:
  1. Choose Your Service
  2. Pick a Stylist & Time
  3. Relax & Get Glamoured
- Each step has a Font Awesome icon, step number in a gold circle, title, and description
- Arrow connectors between steps on desktop
- CTA below: "Start Booking Now" button

---

**A1.5 Featured Offer Banner**
- Full-width banner with a gradient of burgundy to dark
- Promo text: "Weekend Special: 20% OFF all Hair Services — This Weekend Only!"
- Gold countdown timer showing days/hours remaining (calculate from a hardcoded end date)
- Use Code box showing promo code: "WEEKEND20"
- "Book Now" button links to `/book.html`

---

**A1.6 Meet Our Stylists (Preview)**
- White background
- Section heading: "Expert Hands Behind Your Look"
- Horizontal scroll row of 4 stylist cards (fetch from `/api/stylists`, show first 4)
- Each card: circle photo, name, specialization badges, star rating, "Book with [Name]" button
- "View All Stylists" link to `/about.html#team`

---

**A1.7 Customer Reviews Strip**
- Blush background
- Section heading: "What Our Clients Say"
- Auto-sliding testimonials carousel (JS, auto-advances every 4 seconds, pause on hover)
- Each testimonial: quote icon, review text, star rating, customer name, service availed
- Show 1 card on mobile, 2 on tablet, 3 on desktop
- Manual prev/next arrows + dot indicators below
- "Read All Reviews" link to `/reviews.html`

---

**A1.8 Why Choose Us**
- Dark background
- Heading: "The GlowCut Promise"
- Grid of 4 feature tiles:
  - Certified Stylists — All staff are professionally trained
  - Hygienic Tools — All instruments sterilized between each client
  - Premium Products — We use only top international brands
  - No Hidden Charges — Price you see is price you pay
- Each tile: icon in gold, bold title, short description

---

**A1.9 Instagram Feed Mockup**
- Section heading: "Follow Our Work — @GlowCutSalon"
- Grid of 9 static images arranged in 3×3 (real salon work photos saved locally)
- Hover effect: slight zoom + overlay with a pink tint + Instagram icon
- Clicking any image opens a simple lightbox overlay with the full image

---

**A1.10 Final CTA Section**
- Burgundy background, centered layout
- Large Playfair Display heading: "Ready for Your Transformation?"
- Subtext: "Book your appointment today and let us take care of the rest."
- Large "Book My Appointment" button (btn-gold)

---

### Page A2 — Services & Pricing (`services.html`)

**Purpose:** Show every service offered with clear prices and durations.

**Sections:**

---

**A2.1 Page Hero**
- Smaller hero (50vh), salon interior image with overlay
- Breadcrumb: Home > Services
- H1: "Our Services & Pricing"
- Short subtitle about service quality

---

**A2.2 Category Filter Tabs**
- Sticky horizontal tab row just below the hero
- Tabs: All | Hair | Skin | Nails | Makeup | Spa | Men's
- Clicking a tab filters the services grid below (JS filter — hide/show based on data-category)
- Active tab is underlined and colored in burgundy

---

**A2.3 Services Grid**
- 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- Each service card contains:
  - Service icon or small image thumbnail
  - Service name (bold, Playfair Display)
  - Short description (1 line)
  - Duration badge (e.g., "45 min") in gold pill
  - Price: Show original price crossed out if there's a discount, then current price in burgundy
  - "Book This Service" button — links to `/book.html?service=service-id`
- All service data is fetched from `/api/services`
- Show a skeleton loading state (grey placeholder cards) while fetching

---

**A2.4 Pricing Comparison Table**
- Section heading: "Quick Price Reference"
- A clean HTML table with: Category | Service Name | Duration | Price columns
- Striped rows (alternating light blush and white)
- Sortable by price (JS: click column header to sort ascending/descending)

---

**A2.5 CTA Banner**
- Same as Home offer banner but simpler
- "Can't decide? Call us: 9267954524" with phone icon

---

### Page A3 — Offers & Packages (`offers.html`)

**Purpose:** Display combo deals, memberships, seasonal offers, and promo code validator.

**Sections:**

---

**A3.1 Page Hero**
- Background: Gold gradient (left) to Burgundy (right) with geometric pattern overlay
- H1: "Exclusive Offers Just for You"
- Sub-text: "Save more when you combine your favourite services"

---

**A3.2 Active Promo Banner Strip**
- Scrolling ticker-tape strip at top (CSS animation, text scrolls left infinitely)
- Shows active promo messages: "DIWALI20 — 20% off colour services" | "WEEKEND20 — 20% off hair services"

---

**A3.3 Combo Packages Section**
- Section heading: "Combo Deals"
- Grid: 2 columns (desktop), 1 column (mobile)
- Each combo card:
  - Package name in Playfair Display
  - "Includes:" list of services inside with tick icons
  - Crossed-out original price + discounted price in large burgundy text
  - Savings badge in gold (e.g. "Save ₹447!")
  - Validity info (e.g. "Valid for 30 days from purchase")
  - "Book This Combo" button
- Fetch from `/api/packages?type=combo`
- Most popular combo gets a "⭐ Most Popular" banner across its top-left corner

---

**A3.4 Membership Plans Section**
- Section heading: "Become a GlowCut Member"
- Sub-heading: "Unlock exclusive benefits every single month"
- 3 plan cards side by side: Silver | Gold | Platinum
- Gold plan card is slightly larger and highlighted with gold border — "Best Value" badge
- Each card:
  - Plan name in large heading
  - Price per month
  - List of benefits with check/cross icons
  - "Choose [Plan Name]" button — links to `/book.html` with plan pre-selected
- Comparison note: "Members get priority queue — skip the wait!"

---

**A3.5 Seasonal Offers Grid**
- Section heading: "Limited Time Offers"
- 3-column grid of offer cards (1 on mobile)
- Each offer card has:
  - Offer image/illustration background
  - Offer title (e.g. "Diwali Special")
  - Short description
  - Promo code pill (clickable — copies to clipboard with a tooltip "Copied!")
  - Validity date
  - "Grab This Deal" button
- These are static/hardcoded, styled to look attractive

---

**A3.6 Promo Code Validator**
- Section heading: "Have a Promo Code?"
- Centered input box + "Apply" button
- On submit: call `/api/promo/validate` with the entered code
- If valid: show green success card — "Code applied! You save ₹[amount]" + what the code gives
- If invalid or expired: show red error message — "This code is invalid or has expired"
- Note below: "Promo code will be applied at the time of booking"

---

**A3.7 FAQ Strip**
- 4-5 simple accordion FAQs:
  - "Can I use multiple promo codes together?" — No, only one code per booking
  - "How do I redeem my membership benefits?" — Show your membership email at the desk
  - "Do combos expire?" — Yes, within 30 days of purchase
  - "Is there a refund policy?" — Rescheduling only, no refunds

---

### Page A4 — Book Appointment (`book.html`)

**Purpose:** The most important functional page — multi-step booking form.

**Overall Layout:**
- Left side (65% on desktop): The multi-step form
- Right side (35% on desktop): Live booking summary card (updates as user fills form)
- On mobile: Full width, summary collapses to a sticky bottom bar

**Step Indicator:**
- Progress bar at top showing: Step 1 → Step 2 → Step 3 → Step 4
- Current step is highlighted, previous steps show green checkmark
- Cannot go to next step if current step has validation errors

---

**Step 1 — Choose Service:**
- Section heading: "What would you like today?"
- Category filter tabs (same as services page) to narrow down
- Scrollable grid of service cards (same design as services page, but compact)
- Each card has a radio-style selection (clicking card selects it, adds a tick overlay)
- Can select ONLY ONE service (unless it's a combo package)
- Combo package option at bottom: "Or choose a combo deal →" (links to combo selection)
- "Next →" button appears after a service is selected

---

**Step 2 — Choose Stylist & Date:**
- Sub-section A: Stylist selection
  - Cards for each stylist: photo, name, specializations, rating
  - "Any Available Stylist" option at top (auto-assigns)
  - Selected stylist gets highlighted border
- Sub-section B: Date & Time
  - Calendar date picker (simple HTML date input, restrict past dates and Mondays)
  - On date select, call `/api/stylists/:id/availability?date=...`
  - Show time slots as a grid of pills: available slots in white, booked slots greyed out and unclickable
  - Selected slot turns burgundy
- "← Back" and "Next →" buttons

---

**Step 3 — Your Details:**
- Simple form:
  - Full Name (required)
  - Phone Number (required, 10-digit validation)
  - Email Address (optional, for confirmation)
  - Special Requests / Notes (optional, textarea)
  - Promo Code field — "Apply" button next to it, calls promo validate API inline
  - If promo is valid, show discount in the summary card on the right
- "← Back" and "Confirm Booking →" buttons

---

**Step 4 — Confirmation:**
- This screen shows after API call to `POST /api/appointments` succeeds
- Animated green checkmark (CSS animation, circle drawing in + checkmark appearing)
- Large token number displayed prominently: "Your Token: A-007"
- Booking summary: service, stylist, date, time, price
- "View Queue Status" button — links to `/queue.html`
- "Book Another Appointment" button resets form to Step 1
- "Download/Save Details" — shows a simple printable version of the confirmation

**Booking Summary Card (Right Side):**
- Always visible as user moves through steps
- Shows: Selected service, duration, price, stylist name, date/time as they're chosen
- Final price section: Original Price → Promo Discount → Total
- "Estimated Wait on Arrival" shown after date/time is selected

---

### Page A5 — Queue Status (`queue.html`)

**Purpose:** Anyone can check the live queue without logging in.

**Sections:**

---

**A5.1 Hero Bar**
- Dark burgundy background
- Heading: "Live Queue Status"
- Sub-text: "No waiting in the dark — track your turn from anywhere"
- Auto-refresh indicator: "Updates every 10 seconds" with a rotating sync icon

---

**A5.2 Now Serving Card**
- Large centered card, very prominent
- "NOW SERVING" label in small gold caps above
- Token number in massive Playfair Display font: "A - 0 0 5"
- Animated pulsing dot indicator (green, like a live indicator)
- Below: Stylist name + service being performed

---

**A5.3 Queue Statistics Row**
- 3 stat boxes side by side:
  - "People Ahead" — number
  - "Your Estimated Wait" — "X minutes" (calculate from position × average duration)
  - "Total in Queue Today" — number
- If user doesn't have a booking, show generic queue stats without personalised wait time

---

**A5.4 My Token Lookup**
- Input field: "Enter your token number to track your position"
- On submit: highlights the user's position in the queue list below
- Shows personalized message: "You are #3 in the queue — approx 35 min wait"

---

**A5.5 Full Queue List**
- Visual list showing all upcoming tokens
- Each row: Token number | Service | Stylist | Status badge
- Status options: Waiting (grey) | Next Up (gold, highlighted) | In Progress (green) | Done (strikethrough)
- Current token row has a subtle pulse animation

---

**A5.6 Working Hours Bar**
- Simple info row: Today's hours — "10:00 AM to 8:00 PM" | Status: Open / Closed

---

## SECTION 3 — PERSON B FRONTEND WORK

### Pages Assigned to Person B:
1. Gallery Page (`gallery.html`)
2. AI Hair Advisor Page (`ai-advisor.html`)
3. Reviews Page (`reviews.html`)
4. About Us Page (`about.html`)
5. Contact Page (`contact.html`)
6. Admin Panel Page (`admin.html`)
7. Shared: Toast notification system, Mobile hamburger menu JS, Loading skeleton component

---

### Page B1 — Gallery (`gallery.html`)

**Purpose:** Showcase before/after hair transformations and salon ambience.

**Sections:**

---

**B1.1 Page Hero**
- Medium height hero (45vh), dark overlay on salon image
- H1: "Our Work Speaks for Itself"
- Sub-text: "Browse transformations by our expert team"

---

**B1.2 Filter Controls**
- Row of filter pill buttons: All | Hair Colour | Haircuts | Bridal | Skin | Nails | Salon Interior
- Clicking filters the grid below (JS, use data-category attributes on images)
- Active filter pill is filled burgundy, others are outlined

---

**B1.3 Masonry Photo Grid**
- CSS masonry layout (using CSS columns or CSS Grid with auto-placement)
- Each image is a card with slight border-radius
- On hover: smooth zoom effect + a subtle dark overlay appears with service name + stylist name
- Clicking any image opens a full-screen lightbox:
  - Darkened background overlay
  - Centered large image
  - Left/right arrows to navigate between gallery items
  - Close button (top right or Escape key)
  - Shows caption: service name, date, stylist
- Images fetched from `/api/gallery`
- Show skeleton placeholder boxes while loading

---

**B1.4 Before & After Slider Section**
- Section heading: "The Before & After Magic"
- 3 before/after comparison cards
- Each card uses a CSS/JS slider divider — drag left/right to reveal before vs after image
- Show the slider divider handle (a circle with arrows) prominently
- Below each card: service performed + duration + price

---

**B1.5 Upload Your Look CTA**
- Blush background section
- Text: "Had a transformation at GlowCut? Share your photo!"
- Simple file upload input + name field + service field
- Submit sends to backend `POST /api/gallery` (with note that it will be reviewed before appearing)
- Show a thank you toast on submit

---

### Page B2 — AI Hair Advisor (`ai-advisor.html`)

**Purpose:** The showstopper feature — upload photo and get AI hairstyle suggestions.

**Sections:**

---

**B2.1 Page Hero**
- Fun, vibrant section — burgundy to gold diagonal gradient background
- Headline: "Discover Your Perfect Hairstyle — Powered by AI"
- Sub-text: "Upload your photo and let our AI stylist suggest what suits you best"
- Small disclaimer: "Your photo is not stored. It is only used for AI analysis."

---

**B2.2 How It Works — 3 Steps Info Row**
- Horizontal 3-step info bar:
  - Step 1: Upload a clear face photo
  - Step 2: Optionally select your face shape
  - Step 3: Get 5 personalized hairstyle suggestions instantly

---

**B2.3 Upload & Input Area**
- Large centered upload box (dashed border, drag-and-drop supported)
- File input supports JPG, PNG, WEBP only
- Preview: Once image is selected, show a circular preview of the uploaded image inside the box
- Below upload box: Optional face shape selector
  - 5 radio pill buttons with small face outline icons: Round | Oval | Square | Heart | Long
  - "Not sure? Skip this — AI will detect from your photo" note below
- "Get My Style Suggestions" button (btn-gold, large)
  - On click: validate that a file is selected
  - Show loading state: spinner + "Our AI stylist is analysing your look..." text
  - Disable button while loading to prevent double-submit

---

**B2.4 Results Section (hidden until API returns)**
- Heading: "Here Are Your Top 5 Looks"
- Sub-text: "Curated by AI based on your face shape and features"
- Grid of 5 suggestion cards:
  - Reference hairstyle image (pre-saved local image matched to suggestion name)
  - Hairstyle name in Playfair Display
  - "Best for:" badge showing the face shape
  - Recommended length badge
  - Description: 2-3 lines explaining why it suits the user
  - "Book This Style" button — links to `/book.html` with haircut service pre-selected
- If no image was uploaded and API fails, show a friendly error card with a "Try Again" button

---

**B2.5 Hairstyle Inspiration Gallery (Static Section)**
- Section heading: "Browse Trending Styles"
- 3-row scrollable horizontal strip of hairstyle reference images
- Each image has the style name below
- This is fully static — no API call needed
- Purpose: users can browse even without uploading a photo

---

**B2.6 Tips Card**
- Small info card on the side (or below on mobile):
  - "For best results, use a front-facing photo with good lighting"
  - "Remove glasses or hats for more accurate analysis"
  - "The AI suggestion is a guide — our stylists will help you decide in person"

---

### Page B3 — Reviews (`reviews.html`)

**Purpose:** Show customer reviews and compare with nearby salons.

**Sections:**

---

**B3.1 Page Hero**
- Medium hero (40vh)
- H1: "What Our Clients Are Saying"
- Average rating display: Large "4.8 ★" in gold, "Based on 320 reviews" below

---

**B3.2 Rating Summary Card**
- White card, centered
- Overall star rating (4.8) shown large
- 5 progress bars, one per star level (5★ to 1★)
- Each bar shows percentage of reviews at that level
- Total review count
- Data fetched from `/api/reviews` — calculate on frontend

---

**B3.3 Filter & Sort Controls**
- Filter by star rating: All | 5★ | 4★ | 3★ | 2★ | 1★
- Sort by: Most Recent | Highest Rated | Lowest Rated
- Search bar: "Search reviews by keyword"
- All three controls work together (JS filtering on the loaded reviews array)

---

**B3.4 Reviews Grid**
- 1 column (mobile), 2 columns (desktop)
- Each review card:
  - Customer name + first letter avatar (coloured circle)
  - Star rating (filled stars)
  - Service availed (small badge)
  - Date posted
  - Review text (truncated to 3 lines with "Read more" toggle)
- Pagination: show 10 reviews, "Load More" button fetches next 10 (offset-based pagination)

---

**B3.5 Submit a Review Section**
- Blush background, centered
- Heading: "Had a Visit? Share Your Experience"
- Review form:
  - Your Name (text input)
  - Service Availed (dropdown — fetched from `/api/services`)
  - Star Rating (clickable 5 stars — JS, clicking 4th star fills 4 stars)
  - Write your review (textarea, min 20 characters)
  - "Submit Review" button
- On success: toast "Thank you! Your review is pending approval."
- POST to `/api/reviews`

---

**B3.6 Nearby Salons Comparison Section**
- Section heading: "How Do We Compare?"
- 4 static cards showing mock nearby salons (hardcoded data — no real API needed)
- Each card: Salon name | Address | Google star rating | Price range | Speciality
- GlowCut's card is highlighted with a "You're Here ★ Best Rated Nearby" badge
- Note below cards: "Nearby salon data is for reference only. Ratings sourced from public listings."

---

### Page B4 — About Us (`about.html`)

**Purpose:** Build trust — tell the salon's story, show the team, highlight achievements.

**Sections:**

---

**B4.1 Our Story Section**
- Two-column layout: Left = image of salon interior; Right = text block
- Heading: "Our Story"
- 3-4 paragraphs about GlowCut's journey (fictional but realistic):
  - Founded in 2014 in Delhi
  - Started with 2 chairs, now 15+ stylists
  - Focus on quality, hygiene, and affordable luxury
- "Read More" toggle to expand if text is long

---

**B4.2 Values / Mission**
- Dark background section, 3 value tiles:
  - Our Mission — "To make premium beauty accessible to all"
  - Our Vision — "Become Delhi's most loved salon by 2026"
  - Our Values — "Quality, Hygiene, Inclusivity, Joy"

---

**B4.3 Meet the Team Section**
- Section heading: "The Artists Behind Your Look"
- Grid of stylist cards (fetch from `/api/stylists`)
- Each card:
  - Large square photo
  - Name (Playfair Display)
  - Title/Role (e.g., "Senior Colourist")
  - Years of experience badge
  - Specializations shown as small tags
  - Short 1-line bio quote in italics
  - Star rating
  - "Book with [Name]" button

---

**B4.4 Certifications & Achievements**
- Section heading: "Recognised for Excellence"
- Row of 5-6 small achievement tiles (icon + text):
  - VLCC Certified Stylists
  - ISO Standard Hygiene Protocol
  - 5000+ Happy Clients
  - Google 4.8 Rating
  - Featured in Delhi Times 2023

---

**B4.5 Salon Tour Mini Gallery**
- Section heading: "Take a Peek Inside"
- 3 horizontal large images of salon interior — seating area, wash station, reception
- Simple lightbox on click

---

### Page B5 — Contact (`contact.html`)

**Purpose:** Help people get in touch and find the salon.

**Sections:**

---

**B5.1 Page Hero**
- Short hero (35vh)
- Heading: "Get in Touch"
- Sub-text: "We're here to help — call, email, or drop by"

---

**B5.2 Contact Info + Map Row**
- Two-column layout:
  - Left (40%): Contact details as icon-text pairs:
    - 📍 Address: 123 Defence Colony, New Delhi — 110024
    - 📞 Phone: +91 92XXXXXXXX
    - ✉️ Email: hello@glowcut.in
    - 🕐 Hours: Mon: Closed | Tue–Sat: 10AM–8PM | Sun: 10AM–6PM
    - Social media icons row
  - Right (60%): Google Maps iframe embed for the salon's location (use a real Delhi location)

---

**B5.3 Enquiry Form**
- Heading: "Send Us a Message"
- Fields:
  - Full Name
  - Email Address
  - Phone Number
  - Subject (dropdown: General Enquiry | Appointment Help | Feedback | Partnership | Other)
  - Message (textarea)
  - "Send Message" button (btn-primary)
- On submit: POST to `/api/enquiry` → show toast "Your message has been sent! We'll reply within 24 hours."
- Basic client-side validation before submit

---

**B5.4 FAQ Section**
- 6-7 accordion FAQ items (different from offers page):
  - "Do I need to book in advance?" — Recommended but walk-ins welcome based on availability
  - "How do I cancel or reschedule?" — Call or WhatsApp at least 4 hours before
  - "Do you accept card payments?" — Yes, all major UPI, debit/credit cards
  - "Is parking available?" — Yes, limited free parking in front
  - "Do you serve kids?" — Yes, children's haircuts available
  - "Can I gift a session to someone?" — Yes, gift cards available at the desk

---

### Page B6 — Admin Panel (`admin.html`)

**Purpose:** Simple internal tool for salon staff to manage queue and view bookings.

**Access:** Protected — show a login form first. On successful POST to `/api/auth/login`, store JWT in `localStorage`. On every admin API call, send JWT in Authorization header. If token is invalid or missing, redirect back to login.

**Sections (visible after login):**

---

**B6.1 Admin Navbar**
- Different from main site navbar — clean, minimal, dark
- Logo + "Admin Panel" label + Logout button on right
- Active page indicator

---

**B6.2 Dashboard Overview (top)**
- 4 stat cards:
  - Today's Total Bookings
  - Current Queue Length
  - Today's Revenue (sum of confirmed booking prices)
  - Average Rating (last 30 days)
- Data fetched from `/api/admin/analytics`

---

**B6.3 Queue Manager**
- Heading: "Live Queue — [Today's Date]"
- Large "Now Serving" display (same as queue.html but in admin style)
- Sortable table of today's appointments:
  - Columns: Token # | Customer Name | Service | Stylist | Time Slot | Status | Actions
  - Actions column: "Mark Done" button (updates status to completed, advances queue), "Cancel" button
- "Mark as Done → Call Next" prominent button at top — sends PATCH to `/api/queue/advance`

---

**B6.4 Appointment List**
- Date selector to view any day's appointments
- Same table as above but for historical/future dates
- Filter by: All | Confirmed | Completed | Cancelled
- "Export to CSV" button (optional enhancement)

---

**B6.5 Reviews Moderation**
- Table showing pending reviews (isApproved: false)
- Each row: Customer Name | Rating | Review text | Service | Date | Approve / Reject buttons
- Approve sends PATCH to `/api/reviews/:id/approve`
- Reject sends DELETE to `/api/reviews/:id`

---

## SECTION 4 — Shared Responsibilities (Both Persons)

### Person A Shared Tasks
- `css/variables.css` — Create all CSS custom properties (color, font, spacing, etc.)
- `css/global.css` — Navbar, footer, button classes, card classes, badge classes, form classes, grid utilities, toast, section layouts
- Copy-paste the shared navbar HTML into all your own pages
- Ensure your pages link correctly to their respective CSS and JS files

### Person B Shared Tasks
- `js/api.js` — Create a centralized API utility with functions like `getServices()`, `getQueue()`, `postAppointment(data)` etc. that handle fetch, errors, and return parsed JSON
- Toast notification system (showToast function used by all pages)
- Mobile hamburger menu logic (open/close sidebar nav on click, close on outside click)
- Loading skeleton component — reusable grey animated placeholder blocks used while fetching

---

## SECTION 5 — Frontend Rules to Remember (Must-Follow)

1. Always use `--css-variables` for colors and spacing. Never hardcode `#7B2150` directly.
2. Every page must have the shared `<nav>` and `<footer>` with identical HTML markup.
3. Use semantic HTML: `<section>`, `<article>`, `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`.
4. Every image must have a meaningful `alt` attribute.
5. All API calls go through the shared `js/api.js` functions — never write raw `fetch()` calls in page-specific JS.
6. If an API call fails, always show an error toast. Never leave the user with a blank page or silent failure.
7. Show loading skeletons while data is fetching — never show an empty grid that suddenly pops in.
8. Multi-step form (book.html) state must be stored in a JS object and cleared on successful booking.
9. Admin pages must check for JWT token on load — if not present, redirect to login immediately.
10. Test every page by resizing the browser from 375px to 1440px — nothing should overflow or break.
11. All form validations must happen on the frontend before the API call is made.
12. Folder naming: lowercase and hyphenated only. No spaces, no camelCase in file/folder names.
13. Comment your JS clearly — every function must have a one-line comment explaining what it does.
14. Keep JS files small and focused. If a file exceeds 200 lines, break it into helper functions.
15. The `admin.html` page must NEVER be linked from the main site navigation.
