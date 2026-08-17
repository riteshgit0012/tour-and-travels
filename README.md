# Sanatan Tour & Travels 🚗🛕

Ayodhya-based cab & tour service ke liye ek **multi-page, fully responsive, animated** website.
**Frontend:** React (Vite) · **Backend:** Python FastAPI · **Database:** SQLite

Ye project [sanatantourandtravels.com](https://sanatantourandtravels.com/) se inspired hai, lekin
isme sab kuch ek page par nahi hai — proper **navbar** ke saath **Home, About Us, Gallery aur Contact**
ke alag-alag pages hain, smooth page transitions, scroll animations aur professional look ke saath.

---

## ✨ Features

- **Multi-page routing** (React Router) — Home / About / Gallery / Contact
- **Animations** — Framer Motion se page transitions, scroll reveals, hero mandala, marquee, hover effects
- **Fully responsive** — mobile, tablet aur desktop, teeno par accha dikhta hai (mobile pe hamburger menu)
- **Working forms** — Booking form (Home) aur Contact form data FastAPI backend me SQLite ke andar save hota hai
- **Fleet showcase** — 9 vehicles per-km pricing ke saath
- **Gallery** — category filter + lightbox (keyboard arrows se navigate hota hai)
- **Graceful fallback** — agar backend band ho to bhi site poori dikhti hai (local fallback data use hota hai)
- **Floating WhatsApp & Call buttons**

---

## 🗂️ Project Structure

```
tour-and-travels/
├── backend/                 # FastAPI + SQLite
│   ├── main.py              # App + saare API endpoints
│   ├── models.py            # Pydantic request/response models
│   ├── database.py          # SQLite helper (bookings + contacts save)
│   ├── seed_data.py         # Fleet, features, gallery, testimonials data
│   └── requirements.txt
│
└── frontend/                # React (Vite)
    ├── index.html
    ├── vite.config.js       # Dev proxy: /api -> http://localhost:8000
    ├── package.json
    └── src/
        ├── main.jsx         # Entry point
        ├── App.jsx          # Routes + layout shell
        ├── api.js           # Backend API calls (fallback ke saath)
        ├── data/siteData.js # Company details + fallback content
        ├── components/      # Navbar, Footer, FleetCard, BookingForm, etc.
        ├── pages/           # Home, About, Gallery, Contact
        └── styles/          # base.css, components.css, pages.css
```

---

## 🚀 Setup & Run

Do terminal chahiye — ek backend ke liye, ek frontend ke liye.

### 1️⃣ Backend (FastAPI)

```bash
cd backend

# (recommended) virtual environment banao
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# dependencies install karo
pip install -r requirements.txt

# server chalao
uvicorn main:app --reload --port 8000
```

Backend chalu ho jayega **http://localhost:8000** par.
API docs dekhne ke liye: **http://localhost:8000/docs**

> Pehli baar chalane par `app.db` (SQLite file) apne aap ban jayegi.

### 2️⃣ Frontend (React)

Naya terminal kholo:

```bash
cd frontend

# dependencies install karo
npm install

# dev server chalao
npm run dev
```

Site khulegi **http://localhost:5173** par. 🎉

> Vite ka dev proxy `/api` ki saari requests automatically `http://localhost:8000` (backend) par bhej deta hai,
> isliye CORS ki tension nahi hai. Bas dono servers chalu hone chahiye.

---

## 🔌 API Endpoints

| Method | Endpoint              | Kaam                                  |
|--------|-----------------------|---------------------------------------|
| GET    | `/api/health`         | Health check                          |
| GET    | `/api/company`        | Company/contact details               |
| GET    | `/api/fleet`          | Saari vehicles                        |
| GET    | `/api/features`       | "Why choose us" points                |
| GET    | `/api/destinations`   | Popular darshan spots                 |
| GET    | `/api/gallery`        | Gallery images                        |
| GET    | `/api/testimonials`   | Customer reviews                      |
| GET    | `/api/stats`          | Counter stats                         |
| POST   | `/api/booking`        | Booking form submit                   |
| POST   | `/api/contact`        | Contact form submit                   |
| GET    | `/api/admin/bookings` | Saari bookings dekho (simple admin)   |
| GET    | `/api/admin/contacts` | Saare contact messages dekho          |

Submit ki hui bookings/messages dekhne ke liye browser me `http://localhost:8000/api/admin/bookings` khol lo.

---

## 🖼️ Images ke baare me (IMPORTANT)

Abhi gallery aur destinations me **placeholder images** (picsum.photos) use hui hain taaki site turant
chal jaye aur koi broken image na dikhe. **Apni asli photos** lagane ke liye:

- **Gallery + Destinations:** `frontend/src/data/siteData.js` me `GALLERY` aur `DESTINATIONS` ke andar
  `src` / `image` URLs ko apni photos se replace kar do (ya local images `frontend/public/` me daal ke
  `/meri-photo.jpg` jaisa path de do). Same data `backend/seed_data.py` me bhi hai — waha bhi update kar dena.
- Fleet cards icon-based hain (broken image ka risk nahi), chaho to waise hi rakho ya photos add kar lo.

---

## 🏗️ Production Build

```bash
cd frontend
npm run build      # optimized files 'dist/' me ban jayenge
npm run preview    # build ko locally test karo
```

Production me deploy karte waqt `vite.config.js` ke proxy ki jagah frontend ko backend ke actual URL
par point karna hoga (ya dono ko same server/domain se serve karna hoga).

---

## 🛠️ Tech Stack

- **React 18** + **Vite** — fast frontend tooling
- **React Router v6** — multi-page routing
- **Framer Motion** — animations
- **React Icons** — icons
- **FastAPI** + **Uvicorn** — Python backend
- **SQLite** (Python stdlib) — bina kisi extra DB setup ke data storage
- **Plain CSS** (organized) — portable, koi build-time CSS dependency nahi

---

## 📞 Contact Details (site me use hue)

- **Phone / WhatsApp:** +91 9910761272
- **Email:** ladesar16@gmail.com
- **Address:** Near Maharshi Valmiki Airport, Gurudev Palace, Ayodhya, Uttar Pradesh

Inko badalne ke liye ek hi jagah edit karo: `frontend/src/data/siteData.js` ka `COMPANY` object
(aur backend ke liye `backend/main.py` ka `COMPANY` dict).

---

Made with ❤️ for a smooth Ayodhya yatra.
