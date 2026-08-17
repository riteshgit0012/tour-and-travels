from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import seed_data
from database import init_db, list_bookings, list_contacts, save_booking, save_contact
from models import BookingRequest, ContactRequest, SubmitResponse
from login import router as auth_router, db_init_gallery_table, db_list_gallery
from add_car import router as fleet_router, db_init_fleet_table

COMPANY = {
    "name": "Sanatan Tour and Travels",
    "tagline": "Your trusted travel partner in Ayodhya",
    "phone": "+91 9910761272",
    "phone_raw": "919910761272",
    "email": "ladesar16@gmail.com",
    "address": "Near Maharshi Valmiki Airport, Gurudev Palace, Ayodhya, UP",
    "whatsapp": "919910761272",
    "hours": "Open 24 hours, all days",
}

init_db()
db_init_gallery_table()
db_init_fleet_table()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    db_init_gallery_table()
    db_init_fleet_table()
    yield


app = FastAPI(title="Sanatan Tour and Travels API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173",
                   "http://localhost:3000", "http://localhost:4173","https://sanatantourandtravels.vercel.app",],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")
app.include_router(auth_router)
app.include_router(fleet_router)


@app.get("/api/health", tags=["meta"])
def health_check():
    return {"status": "ok", "service": "sanatan-tour-travels"}

@app.get("/api/company", tags=["content"])
def get_company():
    return COMPANY

@app.get("/api/fleet", tags=["content"])
def get_fleet():
    return {"fleet": seed_data.FLEET}

@app.get("/api/features", tags=["content"])
def get_features(): 
    return {"features": seed_data.FEATURES}

@app.get("/api/destinations", tags=["content"])
def get_destinations():
    return {"destinations": seed_data.DESTINATIONS}

@app.get("/api/gallery", tags=["content"])
def get_gallery():
    return {"gallery": db_list_gallery()}

@app.get("/api/testimonials", tags=["content"])
def get_testimonials():
    return {"testimonials": seed_data.TESTIMONIALS}

@app.get("/api/stats", tags=["content"])
def get_stats():
    return {"stats": seed_data.STATS}

@app.post("/api/booking", response_model=SubmitResponse, tags=["forms"])
def create_booking(payload: BookingRequest):
    try:
        booking_id, created_at = save_booking(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not save booking") from exc
    return SubmitResponse(
        success=True,
        message=f"Thank you {payload.name}! Booking received. We will call you shortly.",
        id=booking_id, created_at=created_at,
    )

@app.post("/api/contact", response_model=SubmitResponse, tags=["forms"])
def create_contact(payload: ContactRequest):
    try:
        contact_id, created_at = save_contact(payload.model_dump())
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Could not save message") from exc
    return SubmitResponse(
        success=True,
        message=f"Thanks {payload.name}! Message received. We will get back to you soon.",
        id=contact_id, created_at=created_at,
    )

@app.get("/api/admin/bookings", tags=["admin"])
def admin_bookings():
    return {"count": len(list_bookings()), "bookings": list_bookings()}

@app.get("/api/admin/contacts", tags=["admin"])
def admin_contacts():
    return {"count": len(list_contacts()), "contacts": list_contacts()}

@app.get("/", tags=["meta"])
def root():
    return {"message": "API is running.", "docs": "/docs"}
